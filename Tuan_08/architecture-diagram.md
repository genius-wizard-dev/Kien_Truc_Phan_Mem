# Microservices Architecture Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Client App    │         │    API Gateway   │         │    RabbitMQ     │
│                 │ ───────▶│                 │         │  Message Broker │
└─────────────────┘         └────────┬────────┘         └────────┬────────┘
                                     │                           │
                                     │                           │
                                     ▼                           │
┌──────────────────────────────────────────────────────────────┐│
│                                                              ││
│  ┌─────────────────┐    ┌─────────────────┐    ┌────────────▼──┐
│  │ Product Service │    │  Order Service  │    │Customer Service│
│  │                 │◀───│                 │───▶│                │
│  └────────┬────────┘    └────────┬────────┘    └────────┬───────┘
│           │                      │                       │        │
│  ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼───────┐│
│  │   Product DB    │    │    Order DB     │    │   Customer DB  ││
│  └─────────────────┘    └─────────────────┘    └────────────────┘│
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Service Interaction Flow

1. **Creating an Order**:
   - Client sends request to API Gateway
   - API Gateway forwards to Order Service
   - Order Service validates with Customer Service
   - Order Service checks inventory with Product Service
   - Order Service creates order and publishes event via RabbitMQ
   - Product Service updates inventory based on the order

2. **Updating Product Inventory**:
   - Product Service updates its database
   - Product Service publishes event via RabbitMQ
   - Order Service can subscribe to these events to stay updated

3. **Customer Management**:
   - Customer Service manages customer data
   - Customer Service publishes events for customer updates
   - Order Service can validate customers before creating orders

## Communication Methods

- **Synchronous**: REST API calls between services
- **Asynchronous**: RabbitMQ message broker for event-driven communication

## Data Consistency Strategy

- Each service has its own database
- Event-driven architecture ensures eventual consistency
- Compensating transactions handle failures (e.g., returning inventory if order fails)
