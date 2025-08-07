package app.server.phone_shop.api.otp;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OtpService {
    // Map lưu OTP theo accountId (hoặc email, phone...)
    private final Map<String, OtpInfo> otpStorage = new ConcurrentHashMap<>();

    // Tạo và lưu OTP
    public String generateOtp(String key) {
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000); // OTP 6 chữ số
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

        otpStorage.put(key, new OtpInfo(otp, expiresAt));

        return otp;
    }

    // Kiểm tra OTP
    public boolean verifyOtp(String key, String inputOtp) {
        OtpInfo otpInfo = otpStorage.get(key);

        if (otpInfo == null)
            return false;

        boolean valid = otpInfo.otp().equals(inputOtp) && LocalDateTime.now().isBefore(otpInfo.expiresAt());

        if (valid) {
            otpStorage.remove(key); // OTP chỉ dùng 1 lần
        }

        return valid;
    }

}
