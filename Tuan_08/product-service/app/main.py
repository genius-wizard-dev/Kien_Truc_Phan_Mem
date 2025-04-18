import os
import pika
import json
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database
from typing import List

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Product Service")

# RabbitMQ setup
def get_rabbitmq_connection():
    rabbitmq_host = os.getenv("RABBITMQ_HOST", "rabbitmq")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
    channel = connection.channel()
    channel.exchange_declare(exchange='product_events', exchange_type='fanout')
    return connection, channel

@app.on_event("startup")
async def startup_event():
    app.state.db = database.SessionLocal()
    try:
        # Create some sample products
        if app.state.db.query(models.ProductDB).count() == 0:
            products = [
                models.ProductDB(name="Laptop", price=1299.99, description="High-performance laptop", stock=10),
                models.ProductDB(name="Smartphone", price=799.99, description="Latest smartphone", stock=20),
                models.ProductDB(name="Headphones", price=199.99, description="Noise-cancelling headphones", stock=15)
            ]
            app.state.db.add_all(products)
            app.state.db.commit()
    except Exception as e:
        print(f"Error creating sample data: {e}")
    finally:
        app.state.db.close()

# API endpoints
@app.get("/")
def read_root():
    return {"service": "Product Service"}

@app.get("/products", response_model=List[models.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    products = db.query(models.ProductDB).offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=models.Product)
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.ProductDB).filter(models.ProductDB.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", response_model=models.Product)
def create_product(product: models.ProductCreate, db: Session = Depends(database.get_db)):
    db_product = models.ProductDB(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    # Publish event to RabbitMQ
    try:
        connection, channel = get_rabbitmq_connection()
        channel.basic_publish(
            exchange='product_events',
            routing_key='',
            body=json.dumps({
                "action": "create",
                "product": {
                    "id": db_product.id,
                    "name": db_product.name,
                    "price": db_product.price,
                    "stock": db_product.stock
                }
            })
        )
        connection.close()
    except Exception as e:
        print(f"Error publishing to RabbitMQ: {e}")

    return db_product

@app.put("/products/{product_id}", response_model=models.Product)
def update_product(product_id: int, product: models.ProductCreate, db: Session = Depends(database.get_db)):
    db_product = db.query(models.ProductDB).filter(models.ProductDB.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product.model_dump().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    # Publish event to RabbitMQ
    try:
        connection, channel = get_rabbitmq_connection()
        channel.basic_publish(
            exchange='product_events',
            routing_key='',
            body=json.dumps({
                "action": "update",
                "product": {
                    "id": db_product.id,
                    "name": db_product.name,
                    "price": db_product.price,
                    "stock": db_product.stock
                }
            })
        )
        connection.close()
    except Exception as e:
        print(f"Error publishing to RabbitMQ: {e}")

    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(database.get_db)):
    db_product = db.query(models.ProductDB).filter(models.ProductDB.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()

    # Publish event to RabbitMQ
    try:
        connection, channel = get_rabbitmq_connection()
        channel.basic_publish(
            exchange='product_events',
            routing_key='',
            body=json.dumps({
                "action": "delete",
                "product_id": product_id
            })
        )
        connection.close()
    except Exception as e:
        print(f"Error publishing to RabbitMQ: {e}")

    return {"message": f"Product {product_id} deleted successfully"}

@app.get("/products/{product_id}/check-stock")
def check_product_stock(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.ProductDB).filter(models.ProductDB.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product_id": product_id, "stock": product.stock}

@app.put("/products/{product_id}/update-stock")
def update_product_stock(product_id: int, delta: int, db: Session = Depends(database.get_db)):
    product = db.query(models.ProductDB).filter(models.ProductDB.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.stock + delta < 0:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    product.stock += delta
    db.commit()

    return {"product_id": product_id, "new_stock": product.stock}
