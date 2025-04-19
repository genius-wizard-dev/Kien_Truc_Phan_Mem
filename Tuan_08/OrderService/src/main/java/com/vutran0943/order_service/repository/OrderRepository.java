package com.vutran0943.order_service.repository;

import com.vutran0943.order_service.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findOrderByOrderNumber(String orderNumber);
}
