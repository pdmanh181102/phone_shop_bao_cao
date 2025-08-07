package app.server.phone_shop.core.util;

import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;

public class RequestExtractUtil {
    public static String getToken(HttpServletRequest request) {
        return request.getHeader("ACCOUNT_UID");
    }

    public static UUID getAccountUid(HttpServletRequest request) {
        try {
            return UUID.fromString(request.getHeader("ACCOUNT_UID"));
        } catch (Exception exception) {
            return null;
        }
    }

    public static String getType(HttpServletRequest request) {
        try {
            return request.getHeader("TYPE");
        } catch (Exception exception) {
            return null;
        }
    }
}
