package app.server.phone_shop.zalo_pay.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import app.server.phone_shop.api.order_status.OrderStatusEnum;
import app.server.phone_shop.api.orders.OrderEntity;
import app.server.phone_shop.api.orders.OrderRepository;
import app.server.phone_shop.api.payment_methods.PaymentMethodEnum;
import app.server.phone_shop.zalo_pay.client.ZalopayClient;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ZaloPayService {

    @Value("${zalopay.appid}")
    private String appid;

    @Value("${zalopay.key1}")
    private String key1;

    private final ZalopayClient zalopayClient;
    private final ObjectMapper objectMapper;
    private final OrderRepository orderRepository;

    private String generateMrefundId() {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat("yyMMdd");
        fmt.setCalendar(cal);
        String datePart = fmt.format(cal.getTime());
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 10); // lấy 10 ký tự
        return datePart + "_" + appid + "_" + randomPart;
    }

    private String getCurrentAppTransId() {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat("yyMMdd");
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis()) + "_" + UUID.randomUUID().toString().replace("-", "");
    }

    private long getCurrentAppTime() {
        return System.currentTimeMillis();
    }

    // ✅ Tự viết hàm chuyển byte[] thành chuỗi hex
    private String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private String calculateMac(String hmacInput) throws Exception {
        Mac HmacSHA256 = Mac.getInstance("HmacSHA256");
        HmacSHA256.init(new SecretKeySpec(key1.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hashBytes = HmacSHA256.doFinal(hmacInput.getBytes(StandardCharsets.UTF_8));
        return toHexString(hashBytes); // ✅ thay vì dùng DatatypeConverter
    }

    @Transactional
    public Map<String, Object> createZaloPayOrder(UUID orderUid, String redirectUrl) throws Exception {

        OrderEntity orderEntity = orderRepository.findById(orderUid)
                .orElseThrow(() -> new RuntimeException("Lỗi không tìm thấy đơn hàng"));
        BigDecimal total = orderEntity.getTotalAmount();
        BigDecimal shippingAmount = orderEntity.getShippingAmount();
        long amount = total.add(shippingAmount).longValue();

        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("itemid", "product123");
        item.put("itemname", "Sản phẩm Demo");
        item.put("itemprice", amount);
        item.put("itemquantity", 1);
        items.add(item);

        Map<String, Object> embeddata = new HashMap<>();
        embeddata.put("merchantinfo", "Thông tin riêng của merchant");
        embeddata.put("redirecturl", redirectUrl);

        String currentAppTransId = getCurrentAppTransId();
        long currentAppTime = getCurrentAppTime();

        // update apptransid
        orderEntity.setApptransid(currentAppTransId);
        orderRepository.save(orderEntity);

        Map<String, String> orderParams = new HashMap<>();
        orderParams.put("appid", appid);
        orderParams.put("appuser", "demo_user");
        orderParams.put("apptime", String.valueOf(currentAppTime));
        orderParams.put("amount", String.valueOf(amount));
        orderParams.put("apptransid", currentAppTransId);
        orderParams.put("embeddata", objectMapper.writeValueAsString(embeddata)); // ✅ dùng Jackson thay JSONObject
        orderParams.put("item", objectMapper.writeValueAsString(items));
        orderParams.put("description", orderUid.toString());
        orderParams.put("bankcode", "zalopayapp");

        String hmacInput = String.join("|",
                orderParams.get("appid"),
                orderParams.get("apptransid"),
                orderParams.get("appuser"),
                orderParams.get("amount"),
                orderParams.get("apptime"),
                orderParams.get("embeddata"),
                orderParams.get("item"));

        String mac = calculateMac(hmacInput);
        orderParams.put("mac", mac);

        System.out.println("Sending ZaloPay create order request with parameters: " + orderParams);
        Map<String, Object> response = zalopayClient.createOrder(orderParams);
        System.out.println("ZaloPay response: " + response);
        return response;
    }

    public Map<String, Object> checkZaloPayOrder(String apptransid) throws Exception {

        Map<String, String> params = new HashMap<>();
        params.put("appid", appid);
        params.put("apptransid", apptransid);

        String hmacInput = String.join("|",
                params.get("appid"),
                params.get("apptransid"),
                key1);

        String mac = calculateMac(hmacInput);
        params.put("mac", mac);

        System.out.println("Sending ZaloPay check order request with parameters: " + params);
        Map<String, Object> response = zalopayClient.checkOrder(params);
        System.out.println("ZaloPay response: " + response);
        return response;
    }

    @Transactional
    public Map<String, Object> payForOrder(UUID orderUid, String redirectUrl) throws Exception {
        OrderEntity orderEntity = orderRepository.findById(orderUid)
                .orElseThrow(() -> new RuntimeException("Lỗi không tìm thấy đơn hàng"));

        if (orderEntity.getApptransid() != null) {
            try {
                Map<String, Object> check = checkZaloPayOrder(orderEntity.getApptransid());
                Integer returnCode = (Integer) check.get("returncode");

                if (returnCode == 1) {
                    String zptranids = String.valueOf(check.get("zptransid"));
                    Long paymentAmount = Long.valueOf(check.get("amount").toString());
                    Long paymentDiscountAmount = Long.valueOf(check.get("discountamount").toString());
                    orderEntity.setPaid(true);
                    orderEntity.setStatus(OrderStatusEnum.CHO_XU_LY);
                    orderEntity.setZptransid(zptranids);
                    orderEntity.setPaymentAmount(BigDecimal.valueOf(paymentAmount));
                    orderEntity.setPaymentDiscountAmount(BigDecimal.valueOf(paymentDiscountAmount));
                    orderRepository.save(orderEntity);
                    return Map.of("type", 1);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // create order nếu chưa tạo trước đây
        BigDecimal total = orderEntity.getTotalAmount();
        BigDecimal shippingAmount = orderEntity.getShippingAmount();
        long amount = total.add(shippingAmount).longValue();

        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("itemid", "product123");
        item.put("itemname", "Sản phẩm Demo");
        item.put("itemprice", amount);
        item.put("itemquantity", 1);
        items.add(item);

        Map<String, Object> embeddata = new HashMap<>();
        embeddata.put("merchantinfo", "Thông tin riêng của merchant");
        embeddata.put("redirecturl", redirectUrl);

        String currentAppTransId = getCurrentAppTransId();
        long currentAppTime = getCurrentAppTime();

        // update apptransid
        orderEntity.setApptransid(currentAppTransId);
        orderRepository.save(orderEntity);

        Map<String, String> orderParams = new HashMap<>();
        orderParams.put("appid", appid);
        orderParams.put("appuser", "demo_user");
        orderParams.put("apptime", String.valueOf(currentAppTime));
        orderParams.put("amount", String.valueOf(amount));
        orderParams.put("apptransid", currentAppTransId);
        orderParams.put("embeddata", objectMapper.writeValueAsString(embeddata)); // ✅ dùng Jackson thay JSONObject
        orderParams.put("item", objectMapper.writeValueAsString(items));
        orderParams.put("description", orderUid.toString());
        orderParams.put("bankcode", "zalopayapp");

        String hmacInput = String.join("|",
                orderParams.get("appid"),
                orderParams.get("apptransid"),
                orderParams.get("appuser"),
                orderParams.get("amount"),
                orderParams.get("apptime"),
                orderParams.get("embeddata"),
                orderParams.get("item"));

        String mac = calculateMac(hmacInput);
        orderParams.put("mac", mac);

        Map<String, Object> response = zalopayClient.createOrder(orderParams);
        response.put("type", 2);
        return response;
    }

    @Transactional
    public Map<String, Object> refundOrder(UUID orderUid) throws Exception {
        OrderEntity orderEntity = orderRepository.findById(orderUid)
                .orElseThrow(() -> new RuntimeException("Lỗi không tìm thấy đơn hàng"));

        if (orderEntity.getPaymentMethod() != PaymentMethodEnum.ZALO_PAY) {
            throw new RuntimeException("Không thể hoàn tiền cho đơn hàng không thanh toán bằng zalopay");
        }

        if (orderEntity.getPaid() == false) {
            throw new RuntimeException("Không thể hoàn tiền cho đơn hàng chưa được thanh toán!");
        }

        if (orderEntity.getStatus() == OrderStatusEnum.DA_HOAN_TIEN) {
            throw new RuntimeException("Đơn hàng đã thực hiện hoàn tiền trước đây!");
        }

        BigDecimal paymentAmount = orderEntity.getPaymentAmount();
        BigDecimal paymentDiscountAmount = orderEntity.getPaymentDiscountAmount();

        if (paymentAmount == null || paymentDiscountAmount == null)
            throw new RuntimeException("Số tiền hoàn trả không hợp lệ!");

        String zptransid = orderEntity.getZptransid();
        Long refundAmount = paymentAmount.subtract(paymentDiscountAmount).toBigInteger().longValue();
        Map<String, String> orderParams = createRefundOrderParams(zptransid, refundAmount,
                String.format("From: Phone shop by Phung Duc Manh\nContent: Hoàn tiền cho đơn hàng: %s",
                        orderUid.toString()));

        Map<String, Object> response = zalopayClient.refundOrder(orderParams);
        Integer returnCode = (Integer) response.get("returncode");
        String returnMessage = (String) response.get("returnmessage");
        String refundId = String.valueOf(response.get("refundid"));

        if (returnCode == null) {
            throw new RuntimeException("Không nhận được mã phản hồi từ ZaloPay");
        }

        orderEntity.setPaymentRefundId(refundId);
        if (returnCode == 1) {
            orderEntity.setStatus(OrderStatusEnum.DA_HOAN_TIEN);
        }

        orderRepository.save(orderEntity);
        return response;
    }

    public Map<String, String> createRefundOrderParams(String zptransid, Long refundAmount, String description)
            throws Exception {
        String mrefundid = generateMrefundId();

        Map<String, String> orderParams = new HashMap<>();
        orderParams.put("mrefundid", mrefundid);
        orderParams.put("appid", appid);
        orderParams.put("zptransid", zptransid);
        orderParams.put("amount", String.valueOf(refundAmount));
        orderParams.put("timestamp", String.valueOf(getCurrentAppTime()));
        orderParams.put("description", description);

        String hmacInput = String.join("|",
                orderParams.get("appid"),
                orderParams.get("zptransid"),
                orderParams.get("amount"),
                orderParams.get("description"),
                orderParams.get("timestamp"));

        String mac = calculateMac(hmacInput);
        orderParams.put("mac", mac);
        return orderParams;
    }

    public int checkRefundOrder(UUID orderUid) throws Exception {
        OrderEntity orderEntity = orderRepository.findById(orderUid)
                .orElseThrow(() -> new RuntimeException("Lỗi không tìm thấy đơn hàng"));

        String refundId = orderEntity.getPaymentRefundId();
        if (refundId == null)
            throw new RuntimeException("Đơn hàng không có mã giao dịch hoàn tiền!");

        return checkRefund(refundId);
    }

    public int checkRefund(String refundId) throws Exception {
        if (refundId == null)
            throw new RuntimeException("Đơn hàng không có mã giao dịch hoàn tiền!");

        Map<String, String> orderParams = createCheckRefundOrderParams(refundId);

        Map<String, Object> response = zalopayClient.refundOrder(orderParams);
        Integer returnCode = (Integer) response.get("returncode");

        if (returnCode == null) {
            throw new RuntimeException("Không nhận được mã phản hồi từ ZaloPay");
        }
        return returnCode;
    }

    public Map<String, String> createCheckRefundOrderParams(String mrefundid) throws Exception {
        Map<String, String> orderParams = new HashMap<>();
        orderParams.put("appid", appid);
        orderParams.put("mrefundid", mrefundid);
        orderParams.put("timestamp", String.valueOf(getCurrentAppTime()));

        String hmacInput = String.join("|",
                orderParams.get("appid"),
                orderParams.get("mrefundid"),
                orderParams.get("timestamp"));

        String mac = calculateMac(hmacInput);
        orderParams.put("mac", mac);
        return orderParams;
    }
}
