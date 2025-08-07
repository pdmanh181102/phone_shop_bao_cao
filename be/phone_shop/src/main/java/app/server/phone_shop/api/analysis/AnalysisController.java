package app.server.phone_shop.api.analysis;

import java.time.Instant;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.server.phone_shop.api.analysis.dto.CountByStatusDto;
import app.server.phone_shop.api.analysis.dto.SummaryDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/analysis")
@RequiredArgsConstructor
public class AnalysisController {
    private final AnalysisService analysisService;

    @GetMapping("/products/count-all")
    public ResponseEntity<Integer> countAllProduct() {
        return ResponseEntity.ok(analysisService.countAllProduct());
    }

    @GetMapping("/users/count-all")
    public ResponseEntity<Integer> countAllUser() {
        return ResponseEntity.ok(analysisService.countAllUser());
    }

    @GetMapping("/customers/count-all")
    public ResponseEntity<Integer> countAllCustomer() {
        return ResponseEntity.ok(analysisService.countAllCustomer());
    }

    @GetMapping("/orders/count-all")
    public ResponseEntity<Integer> countAllOrder() {
        return ResponseEntity.ok(analysisService.countAllOrder());
    }

    @GetMapping("/products/count-by-status")
    public ResponseEntity<List<CountByStatusDto>> countProductByStatus() {
        return ResponseEntity.ok(analysisService.getProductCountByStatus());
    }

    @GetMapping("/orders/count-by-status")
    public ResponseEntity<List<CountByStatusDto>> countOrderByStatus() {
        return ResponseEntity.ok(analysisService.getOrderCountByStatus());
    }

    @GetMapping("/entries/summary")
    public ResponseEntity<List<SummaryDto>> getEntrySummary(@RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate) {
        return ResponseEntity.ok(analysisService.getEntrySummaries(startDate, endDate));
    }

    @GetMapping("/orders/summary")
    public ResponseEntity<List<SummaryDto>> getOrderSummary(@RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate) {
        return ResponseEntity.ok(analysisService.getOrderSummaries(startDate, endDate));
    }
}
