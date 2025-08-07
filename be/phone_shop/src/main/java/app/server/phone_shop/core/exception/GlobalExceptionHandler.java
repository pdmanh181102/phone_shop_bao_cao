package app.server.phone_shop.core.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private CustomErrorResponse buildError(HttpStatus status, String error, String message,
                        HttpServletRequest request) {
                return CustomErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .status(status.value())
                                .error(error)
                                .message(message)
                                .path(request.getRequestURI())
                                .build();
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<CustomErrorResponse> handleDataIntegrityViolation(
                        DataIntegrityViolationException ex, HttpServletRequest request) {

                String message = ex.getCause() instanceof ConstraintViolationException
                                ? "Giá trị đã tồn tại (vi phạm ràng buộc duy nhất)"
                                : "Lỗi ràng buộc dữ liệu: " + ex.getMessage();

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(buildError(HttpStatus.BAD_REQUEST, "Data Integrity Violation", message, request));
        }

        @ExceptionHandler(EntityNotFoundException.class)
        public ResponseEntity<CustomErrorResponse> handleEntityNotFound(
                        EntityNotFoundException ex, HttpServletRequest request) {
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(buildError(HttpStatus.NOT_FOUND, "Entity Not Found", ex.getMessage(), request));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<CustomErrorResponse> handleValidationException(
                        MethodArgumentNotValidException ex, HttpServletRequest request) {
                String message = ex.getBindingResult().getFieldErrors().stream()
                                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                                .collect(Collectors.joining("; "));
                return ResponseEntity
                                .badRequest()
                                .body(buildError(HttpStatus.BAD_REQUEST, "Validation Failed", message, request));
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<CustomErrorResponse> handleUnreadableMessage(
                        HttpMessageNotReadableException ex, HttpServletRequest request) {
                return ResponseEntity
                                .badRequest()
                                .body(buildError(HttpStatus.BAD_REQUEST, "Malformed JSON or Invalid Format",
                                                ex.getMostSpecificCause().getMessage(), request));
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<CustomErrorResponse> handleConstraintViolation(
                        ConstraintViolationException ex, HttpServletRequest request) {
                String message = ex.getConstraintViolations().stream()
                                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                                .collect(Collectors.joining("; "));
                return ResponseEntity
                                .badRequest()
                                .body(buildError(HttpStatus.BAD_REQUEST, "Constraint Violation", message, request));
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<CustomErrorResponse> handleArgumentTypeMismatch(
                        MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
                String message = String.format("Tham số '%s' không đúng định dạng. Giá trị không hợp lệ: %s",
                                ex.getName(), ex.getValue());
                return ResponseEntity
                                .badRequest()
                                .body(buildError(HttpStatus.BAD_REQUEST, "Invalid Parameter Type", message, request));
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<CustomErrorResponse> handleGenericException(
                        Exception ex, HttpServletRequest request) {
                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                                                ex.getMessage(), request));
        }
}
