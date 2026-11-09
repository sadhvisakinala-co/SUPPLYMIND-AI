"""
SUPPLYMIND AI — Main FastAPI Application
Autonomous Supply Chain Intelligence & PayPal-Powered Procurement
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.seed import seed_database

# Import routers
from app.routes.auth import router as auth_router
from app.routes.inventory import router as inventory_router
from app.routes.suppliers import router as suppliers_router
from app.routes.forecasting import router as forecasting_router
from app.routes.negotiations import router as negotiations_router
from app.routes.procurement import router as procurement_router
from app.routes.payments import router as payments_router
from app.routes.paypal_routes import router as paypal_router
from app.routes.audit import router as audit_router
from app.routes.settings_routes import router as settings_router

app = FastAPI(
    title="SUPPLYMIND AI API",
    description="Autonomous Supply Chain Intelligence & PayPal-Powered Procurement Engine",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
# Add common local development origins
origins.extend([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
])
origins = list(set(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during dev/demo to prevent CORS issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route handlers
app.include_router(auth_router)
app.include_router(inventory_router)
app.include_router(suppliers_router)
app.include_router(forecasting_router)
app.include_router(negotiations_router)
app.include_router(procurement_router)
app.include_router(payments_router)
app.include_router(paypal_router)
app.include_router(audit_router)
app.include_router(settings_router)


@app.on_event("startup")
def startup_event():
    """Ensure database schema exists and seed demo data on initial launch."""
    print("Initializing SUPPLYMIND AI backend tables...")
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")


@app.get("/api/health", tags=["System"])
def health_check():
    """Health check endpoint for container probes and dashboard status."""
    return {
        "status": "healthy",
        "service": "SUPPLYMIND AI Core API",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
        "paypal_sandbox_active": settings.PAYPAL_SANDBOX_MODE
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

