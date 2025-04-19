package com.vutran0943.order_service.serivces;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vutran0943.order_service.client.InventoryClient;
import com.vutran0943.order_service.dto.request.OrderCreationRequest;
import com.vutran0943.order_service.dto.request.OrderLineItemRequest;
import com.vutran0943.order_service.dto.response.*;
import com.vutran0943.order_service.entities.Order;
import com.vutran0943.order_service.entities.OrderLineItem;
import com.vutran0943.order_service.exceptions.AppException;
import com.vutran0943.order_service.exceptions.ErrorCode;
import com.vutran0943.order_service.kafka.events.InventorySubtractionEvent;
import com.vutran0943.order_service.repository.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.*;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OrderService {
    OrderRepository orderRepository;
    InventoryClient inventoryClient;
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderResponse createOrder(OrderCreationRequest request) throws Exception {
        Order order = new Order();
        double totalPrice = 0;
        order.setOrderNumber(UUID.randomUUID().toString());

        MultiValueMap<String, String> quantityPerProductId = new LinkedMultiValueMap<>();

        List<OrderLineItem> orderLineItemList = request
                .getOrderLineItemList().stream().map((oLItem -> {
                    quantityPerProductId.add(oLItem.getProductId(), String.valueOf(oLItem.getQuantity()));
                    OrderLineItem orderLineItem = mapToOrderLineItem(oLItem);
                    orderLineItem.setOrder(order);
                    return orderLineItem;
                })).toList();

        for(OrderLineItem orderLineItem : orderLineItemList) {
            totalPrice += orderLineItem.getPrice();
        }

        order.setOrderLineItemList(orderLineItemList);
        order.setTotalPrice(totalPrice);

        ApiResponse<List<InventoryStockResponse>> res = inventoryClient.isInStock(quantityPerProductId);
        List<InventoryStockResponse> inventoryStockLists = res.getData();

        boolean isInStock = inventoryStockLists.stream().allMatch(InventoryStockResponse::isInStock);

        if(isInStock) {
            for (OrderLineItem item : order.getOrderLineItemList()) {
                InventorySubtractionEvent event = new InventorySubtractionEvent(item.getProductId(), item.getQuantity());
                kafkaTemplate.send("subtract-inventory-topic", objectMapper.writeValueAsString(event));
            }

            orderRepository.save(order);
            List<OrderLineItemResponse> orderLineItemsResponses = order
                    .getOrderLineItemList()
                    .stream()
                    .map(this::mapToOrderLineItemsResponse)
                    .toList();

            return OrderResponse.builder()
                    .orderNumber(order.getOrderNumber())
                    .orderLineItemsList(orderLineItemsResponses)
                    .build();
        } else throw new AppException(ErrorCode.OUT_OF_STOCK);
    }

    public OrderResponse getOrder(String orderNumber) {
        Order order = orderRepository.findOrderByOrderNumber(orderNumber);

        List<OrderLineItemResponse> orderLineItemsResponseList = order
                .getOrderLineItemList()
                .stream()
                .map(this::mapToOrderLineItemsResponse).toList();

        return OrderResponse.builder()
                .orderNumber(order.getOrderNumber())
                .orderLineItemsList(orderLineItemsResponseList)
                .build();
    }

    private OrderLineItem mapToOrderLineItem(OrderLineItemRequest orderLineItemRequest) {
        return OrderLineItem.builder()
                .price(orderLineItemRequest.getPrice())
                .quantity(orderLineItemRequest.getQuantity())
                .productId(orderLineItemRequest.getProductId())
                .build();
    }

    private OrderLineItemResponse mapToOrderLineItemsResponse(OrderLineItem orderLineItem) {
        return OrderLineItemResponse.builder()
                .price(orderLineItem.getPrice())
                .quantity(orderLineItem.getQuantity())
                .productId(orderLineItem.getProductId())
                .build();
    }
}


