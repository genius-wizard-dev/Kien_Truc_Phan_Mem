# Microservices Architecture with Kafka

## Overview

This project demonstrates a microservices architecture using Apache Kafka as the message broker. The system consists of multiple services that communicate with each other through Kafka topics.

## Project Structure

- `docker-compose.yml`: Configuration for all containers
- `IndentifyService/`: Authentication and user identification service
- `ProfileService/`: User profile management service

## Services

- **Kafka**: Message broker service running on ports 9092 (internal) and 9094 (external)
- **IdentifyService**: Authentication service running on port 8080
- **ProfileService**: User profile service running on port 8088

## Prerequisites

- Docker and Docker Compose
- Java 17+ (for local development)

## Setup Instructions

### Running with Docker

1. Make sure Docker and Docker Compose are installed
2. Start the services:
   ```bash
   docker-compose up -d
   ```
3. To stop the services:
   ```bash
   docker-compose down
   ```

### Accessing Kafka

- Internal access (from containers): `kafka:9092`
- External access (from host): `localhost:9094`

## Service Configuration

Each service connects to Kafka with the following environment variable:

```
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

## Healthcheck

The Kafka service includes a healthcheck that verifies the broker is operational before dependent services start.

## Current Status

The base Kafka infrastructure is set up and running. The microservices (IndentifyService and ProfileService) are currently commented out in the docker-compose.yml file and need to be implemented.

## Next Steps

1. Implement the IndentifyService
2. Implement the ProfileService
3. Uncomment the services in docker-compose.yml
4. Test the communication between services using Kafka topics
