package com.vutran0943.order_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderResponse {
    String orderNumber;
    List<OrderLineItemResponse> orderLineItemsList;
}
