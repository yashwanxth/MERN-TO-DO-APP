from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_stats import router as stats_router
from routes.productivity import router as productivity_router

app = FastAPI(title="QuickTask Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(stats_router)
app.include_router(productivity_router)
