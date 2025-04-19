package com.vutran0943.order_service.exceptions;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    INVALID_QUANTITY_ERROR(1001, 400, "Invalid quantity"),
    UNCATEGORIZED_ERROR(1002, 500, "Uncategorized quantity"),
    OUT_OF_STOCK(1003, 400, "Out of stock");

    int code;
    int status;
    String message;

    ErrorCode(int code, int status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }
}
