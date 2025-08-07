package app.server.phone_shop.zalo_pay.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.zalo_pay.service.ZaloPayService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class ZaloPayController {
    private final ZaloPayService zaloPayService;

    @GetMapping("/pay-for-order")
    public ResponseEntity<?> payForOrder(@RequestParam UUID orderUid, @RequestParam String redirectUrl) {
        try {
            Map<String, Object> response = zaloPayService.payForOrder(orderUid, redirectUrl);
            int type = (Integer) response.get("type");
            if (type == 1) {
                return ResponseEntity.ok(Map.of(
                        "type", 1));
            }

            int returnCode = (Integer) response.get("returncode");
            if (returnCode == 1) {
                String orderUrl = (String) response.get("orderurl");
                return ResponseEntity.ok(Map.of(
                        "type", "2",
                        "message", "Order created successfully",
                        "orderUrl", orderUrl));
            } else {
                String returnMessage = (String) response.get("returnmessage");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Failed to create order", "details", returnMessage));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred", "details", e.getMessage()));
        }
    }

    @GetMapping("/check-order")
    public ResponseEntity<?> checkOrder(
            @RequestParam String apptransid) {
        try {
            Map<String, Object> response = zaloPayService.checkZaloPayOrder(apptransid);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.ok().body(e);
        }
    }

    @GetMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam UUID orderUid, @RequestParam String redirectUrl) {
        try {
            Map<String, Object> response = zaloPayService.createZaloPayOrder(orderUid, redirectUrl);
            int returnCode = (Integer) response.get("returncode");
            if (returnCode == 1) {
                String orderUrl = (String) response.get("orderurl");
                return ResponseEntity.ok(Map.of("message", "Order created successfully", "orderUrl", orderUrl));
            } else {
                String returnMessage = (String) response.get("returnmessage");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Failed to create order", "details", returnMessage));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred", "details", e.getMessage()));
        }
    }

    @GetMapping("/refund-order")
    public ResponseEntity<?> refundOrder(@RequestParam UUID orderUid) {
        try {
            Map<String, Object> response = zaloPayService.refundOrder(orderUid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred", "details", e.getMessage()));
        }
    }

}
