package com.vutran0943.order_service.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "order_line_item")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderLineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    @Column(nullable = false)
    String productId;
    @Column(nullable = false)
    int quantity;
    @Column(nullable = false)
    Double price;
    @ManyToOne
    @JoinColumn(name="order_number", nullable = false)
    private Order order;
}
