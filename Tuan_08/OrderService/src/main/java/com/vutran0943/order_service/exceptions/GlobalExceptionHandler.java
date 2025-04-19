package com.vutran0943.order_service.exceptions;

import com.vutran0943.order_service.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiResponse> exception(Exception e) {
//        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_ERROR;
//        ApiResponse apiResponse = new ApiResponse();
//
//        apiResponse.setMessage(errorCode.getMessage());
//        apiResponse.setCode(errorCode.getCode());
//
//
//        return ResponseEntity.status(errorCode.getStatus()).body(apiResponse);
//    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse> appException(AppException e) {
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setMessage(e.getMessage());
        apiResponse.setCode(e.getCode());

        return ResponseEntity.status(e.getStatus()).body(apiResponse);
    }
}
