package com.vutran0943.order_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "orders")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @Column(name = "order_number", nullable = false, unique = true)
    String orderNumber;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    List<OrderLineItem> orderLineItemList;
    @Column(name="total_price", nullable = false)
    double totalPrice;
}
