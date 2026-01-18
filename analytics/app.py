from fastapi import FastAPI
from routes.user_stats import router as stats_router
from routes.productivity import router as prod_router

app = FastAPI(title="Analytics Service")

app.include_router(stats_router)
app.include_router(prod_router)
