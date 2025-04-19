package com.vutran0943.order_service.controllers;

import com.vutran0943.order_service.dto.request.OrderCreationRequest;
import com.vutran0943.order_service.dto.response.ApiResponse;
import com.vutran0943.order_service.dto.response.InventoryStockResponse;
import com.vutran0943.order_service.dto.response.OrderResponse;
import com.vutran0943.order_service.serivces.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderResponse> placeOrder(@RequestBody OrderCreationRequest request) throws Exception {
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Place Order successful");
        apiResponse.setData(orderService.createOrder(request));

        return apiResponse;
    }

    @GetMapping("/{orderNumber}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<OrderResponse> getOrderByOrderNumber(@PathVariable String orderNumber) {
        ApiResponse<OrderResponse> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Get Order By Order Number");
        apiResponse.setData(orderService.getOrder(orderNumber));

        return apiResponse;
    }
}
