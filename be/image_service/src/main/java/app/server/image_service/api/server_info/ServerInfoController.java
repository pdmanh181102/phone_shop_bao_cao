package app.server.image_service.api.server_info;

import java.net.UnknownHostException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.server.image_service.core.util.ServerInfoUtil;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/server-infos")
@RequiredArgsConstructor
public class ServerInfoController {

    private final ServerInfoUtil serverInfoUtil;

    @GetMapping("/address")
    public String getServerIp() throws UnknownHostException {
        return String.format("http://%s", serverInfoUtil.getServerAddress());
    }
}
