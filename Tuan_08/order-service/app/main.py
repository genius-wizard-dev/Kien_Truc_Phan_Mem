import os
import httpx
import json
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database
from typing import List
import pika
from fastapi.background import BackgroundTasks

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Order Service")

# Service URLs from environment variables
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8001")
CUSTOMER_SERVICE_URL = os.getenv("CUSTOMER_SERVICE_URL", "http://customer-service:8003")

# RabbitMQ setup
def get_rabbitmq_connection():
    rabbitmq_host = os.getenv("RABBITMQ_HOST", "rabbitmq")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
    channel = connection.channel()
    channel.exchange_declare(exchange='order_events', exchange_type='fanout')
    return connection, channel

async def verify_customer(customer_id: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{CUSTOMER_SERVICE_URL}/customers/{customer_id}")
            if response.status_code == 200:
                return True
            return False
    except Exception as e:
        print(f"Error verifying customer: {e}")
        return False

async def check_product_stock(product_id: int, quantity: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{PRODUCT_SERVICE_URL}/products/{product_id}/check-stock")
            if response.status_code == 200:
                stock_info = response.json()
                return stock_info["stock"] >= quantity
            return False
    except Exception as e:
        print(f"Error checking product stock: {e}")
        return False

async def update_product_stock(product_id: int, delta: int):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{PRODUCT_SERVICE_URL}/products/{product_id}/update-stock",
                params={"delta": delta}
            )
            return response.status_code == 200
    except Exception as e:
        print(f"Error updating product stock: {e}")
        return False

def publish_order_event(order_id: int, action: str, order_data: dict = None):
    try:
        connection, channel = get_rabbitmq_connection()
        message = {
            "action": action,
            "order_id": order_id
        }
        if order_data:
            message["order"] = order_data

        channel.basic_publish(
            exchange='order_events',
            routing_key='',
            body=json.dumps(message)
        )
        connection.close()
    except Exception as e:
        print(f"Error publishing to RabbitMQ: {e}")

# API endpoints
@app.get("/")
def read_root():
    return {"service": "Order Service"}

@app.get("/orders", response_model=List[models.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    orders = db.query(models.OrderDB).offset(skip).limit(limit).all()
    return orders

@app.get("/orders/{order_id}", response_model=models.Order)
def read_order(order_id: int, db: Session = Depends(database.get_db)):
    order = db.query(models.OrderDB).filter(models.OrderDB.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.post("/orders", response_model=models.Order)
async def create_order(order: models.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    # Verify customer exists
    customer_exists = await verify_customer(order.customer_id)
    if not customer_exists:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Check if products are in stock
    for item in order.items:
        has_stock = await check_product_stock(item.product_id, item.quantity)
        if not has_stock:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {item.product_id}")

    # Calculate total amount
    total_amount = sum(item.price * item.quantity for item in order.items)

    # Create order
    db_order = models.OrderDB(
        customer_id=order.customer_id,
        total_amount=total_amount,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    for item in order.items:
        db_item = models.OrderItemDB(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)

        # Update product stock in background
        background_tasks.add_task(update_product_stock, item.product_id, -item.quantity)

    db.commit()
    db.refresh(db_order)

    # Publish order created event
    order_data = {
        "id": db_order.id,
        "customer_id": db_order.customer_id,
        "total_amount": db_order.total_amount,
        "status": db_order.status,
        "items": [
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price
            } for item in db_order.items
        ]
    }
    background_tasks.add_task(publish_order_event, db_order.id, "create", order_data)

    return db_order

@app.put("/orders/{order_id}", response_model=models.Order)
def update_order_status(order_id: int, status: str, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    db_order = db.query(models.OrderDB).filter(models.OrderDB.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.status = status
    db.commit()
    db.refresh(db_order)

    # Publish order status updated event
    background_tasks.add_task(publish_order_event, order_id, "update", {"status": status})

    return db_order

@app.delete("/orders/{order_id}")
async def cancel_order(order_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    db_order = db.query(models.OrderDB).filter(models.OrderDB.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    if db_order.status != "pending":
        raise HTTPException(status_code=400, detail="Can only cancel pending orders")

    db_order.status = "cancelled"
    db.commit()

    # Return stock for each item
    for item in db_order.items:
        background_tasks.add_task(update_product_stock, item.product_id, item.quantity)

    # Publish order cancelled event
    background_tasks.add_task(publish_order_event, order_id, "cancel")

    return {"message": f"Order {order_id} cancelled successfully"}

@app.get("/orders/customer/{customer_id}", response_model=List[models.Order])
def get_customer_orders(customer_id: int, db: Session = Depends(database.get_db)):
    orders = db.query(models.OrderDB).filter(models.OrderDB.customer_id == customer_id).all()
    return orders
