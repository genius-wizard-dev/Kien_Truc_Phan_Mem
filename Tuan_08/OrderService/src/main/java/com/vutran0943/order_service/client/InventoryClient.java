package com.vutran0943.order_service.client;

import com.vutran0943.order_service.dto.response.ApiResponse;
import com.vutran0943.order_service.dto.response.InventoryStockResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "inventory-service", url = "${other.inventory-service-url}")
public interface  InventoryClient {
    @GetMapping("/api/inventories/check-stock")
    public ApiResponse<List<InventoryStockResponse>> isInStock(@RequestParam MultiValueMap<String, String> params);
}
