import os
import pika
import json
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database
from typing import List
from fastapi.background import BackgroundTasks

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Customer Service")

# RabbitMQ setup
def get_rabbitmq_connection():
    rabbitmq_host = os.getenv("RABBITMQ_HOST", "rabbitmq")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
    channel = connection.channel()
    channel.exchange_declare(exchange='customer_events', exchange_type='fanout')
    return connection, channel

def publish_customer_event(customer_id: int, action: str, customer_data: dict = None):
    try:
        connection, channel = get_rabbitmq_connection()
        message = {
            "action": action,
            "customer_id": customer_id
        }
        if customer_data:
            message["customer"] = customer_data

        channel.basic_publish(
            exchange='customer_events',
            routing_key='',
            body=json.dumps(message)
        )
        connection.close()
    except Exception as e:
        print(f"Error publishing to RabbitMQ: {e}")

@app.on_event("startup")
async def startup_event():
    app.state.db = database.SessionLocal()
    try:
        # Create some sample customers
        if app.state.db.query(models.CustomerDB).count() == 0:
            customers = [
                models.CustomerDB(name="John Doe", email="john@example.com", phone="123-456-7890", address="123 Main St"),
                models.CustomerDB(name="Jane Smith", email="jane@example.com", phone="987-654-3210", address="456 Oak Ave"),
                models.CustomerDB(name="Bob Johnson", email="bob@example.com", phone="555-123-4567", address="789 Pine Blvd")
            ]
            app.state.db.add_all(customers)
            app.state.db.commit()
    except Exception as e:
        print(f"Error creating sample data: {e}")
    finally:
        app.state.db.close()

# API endpoints
@app.get("/")
def read_root():
    return {"service": "Customer Service"}

@app.get("/customers", response_model=List[models.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    customers = db.query(models.CustomerDB).offset(skip).limit(limit).all()
    return customers

@app.get("/customers/{customer_id}", response_model=models.Customer)
def read_customer(customer_id: int, db: Session = Depends(database.get_db)):
    customer = db.query(models.CustomerDB).filter(models.CustomerDB.id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.post("/customers", response_model=models.Customer)
def create_customer(customer: models.CustomerCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    # Check if email already exists
    db_customer = db.query(models.CustomerDB).filter(models.CustomerDB.email == customer.email).first()
    if db_customer:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_customer = models.CustomerDB(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    # Publish customer created event
    customer_data = {
        "id": db_customer.id,
        "name": db_customer.name,
        "email": db_customer.email
    }
    background_tasks.add_task(publish_customer_event, db_customer.id, "create", customer_data)

    return db_customer

@app.put("/customers/{customer_id}", response_model=models.Customer)
def update_customer(customer_id: int, customer: models.CustomerCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    db_customer = db.query(models.CustomerDB).filter(models.CustomerDB.id == customer_id).first()
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Check if updating to an email that already exists
    if customer.email != db_customer.email:
        existing_email = db.query(models.CustomerDB).filter(models.CustomerDB.email == customer.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    for key, value in customer.model_dump().items():
        setattr(db_customer, key, value)

    db.commit()
    db.refresh(db_customer)

    # Publish customer updated event
    customer_data = {
        "id": db_customer.id,
        "name": db_customer.name,
        "email": db_customer.email
    }
    background_tasks.add_task(publish_customer_event, customer_id, "update", customer_data)

    return db_customer

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    db_customer = db.query(models.CustomerDB).filter(models.CustomerDB.id == customer_id).first()
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(db_customer)
    db.commit()

    # Publish customer deleted event
    background_tasks.add_task(publish_customer_event, customer_id, "delete")

    return {"message": f"Customer {customer_id} deleted successfully"}
