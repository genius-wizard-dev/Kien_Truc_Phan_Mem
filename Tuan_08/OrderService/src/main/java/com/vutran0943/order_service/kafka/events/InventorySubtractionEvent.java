package com.vutran0943.order_service.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventorySubtractionEvent {
    private String productId;
    private int quantity;
}
