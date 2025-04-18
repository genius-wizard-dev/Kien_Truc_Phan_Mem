import os
from fastapi import FastAPI, Request, HTTPException, Response
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs from environment variables - corrected to match docker-compose port mappings
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8000")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://order-service:8000")
CUSTOMER_SERVICE_URL = os.getenv("CUSTOMER_SERVICE_URL", "http://customer-service:8000")

@app.get("/")
async def root():
    return {"message": "API Gateway for Sales Management System"}

# Product Service Proxy Routes
@app.api_route("/products", methods=["GET", "POST"])
@app.api_route("/products/{product_id}", methods=["GET", "PUT", "DELETE"])
async def product_service_proxy(request: Request):
    return await proxy_request(request, PRODUCT_SERVICE_URL)

# Order Service Proxy Routes
@app.api_route("/orders", methods=["GET", "POST"])
@app.api_route("/orders/{order_id}", methods=["GET", "PUT", "DELETE"])
async def order_service_proxy(request: Request):
    return await proxy_request(request, ORDER_SERVICE_URL)

# Customer Service Proxy Routes
@app.api_route("/customers", methods=["GET", "POST"])
@app.api_route("/customers/{customer_id}", methods=["GET", "PUT", "DELETE"])
async def customer_service_proxy(request: Request):
    return await proxy_request(request, CUSTOMER_SERVICE_URL)

async def proxy_request(request: Request, service_url: str):
    # Get the original path and query parameters
    path = request.url.path
    query_params = request.url.query
    target_url = f"{service_url}{path}"
    if query_params:
        target_url = f"{target_url}?{query_params}"

    # Get headers and body from original request
    headers = {key: value for key, value in request.headers.items()
               if key.lower() not in ('host', 'content-length')}

    try:
        body = await request.body()
        method = request.method

        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=method,
                url=target_url,
                headers=headers,
                content=body,
                timeout=30.0  # Add a reasonable timeout
            )

            # Return a proper FastAPI response with the same status code and headers
            content_type = response.headers.get("content-type", "application/json")

            # Create a Response with the appropriate content
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=content_type
            )
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error proxying request: {str(e)}")
