import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import Base, engine
from app.routers import translate_router, history_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("hinglishflow")

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info(f"{settings.app_name} v{settings.version} started successfully.")
    yield
    logger.info("Shutting down HinglishFlow...")

app = FastAPI(
    title="HinglishFlow API",
    description="High-performance Hindi ↔ English Code-Mixed (Hinglish) Translation Engine",
    version=settings.version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.debug else settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(translate_router)
app.include_router(history_router)

@app.get("/api/v1/health", tags=["system"])
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "version": settings.version,
        "app_name": settings.app_name
    }

@app.get("/", tags=["system"])
async def root():
    return {
        "message": "Welcome to HinglishFlow Translation API",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "An internal server error occurred",
            "code": "INTERNAL_SERVER_ERROR"
        }
    )
