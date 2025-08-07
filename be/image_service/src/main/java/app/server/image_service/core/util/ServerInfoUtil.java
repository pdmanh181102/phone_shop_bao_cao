package app.server.image_service.core.util;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class ServerInfoUtil {

    @Value("${server.port}")
    private int serverPort;

    private String serverIp;

    @PostConstruct
    private void init() {
        try {
            InetAddress inetAddress = InetAddress.getLocalHost();
            // this.serverIp = inetAddress.getHostAddress();
            this.serverIp = "localhost";
        } catch (UnknownHostException e) {
            this.serverIp = "unknown";
        }
    }

    public String getServerIp() {
        return serverIp;
    }

    public int getServerPort() {
        return serverPort;
    }

    public String getServerAddress() {
        return serverIp + ":" + serverPort;
    }
}
