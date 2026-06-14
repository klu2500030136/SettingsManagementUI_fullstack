import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import admin, auth, settings, groups, preferences, logs, preferences_nosql, embeddings, search, dashboard


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

app = FastAPI(title="Settings API Gateway", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Configure for frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(settings.router)
app.include_router(groups.router)
app.include_router(preferences.router)
app.include_router(logs.router)
app.include_router(preferences_nosql.router)
app.include_router(embeddings.router)
app.include_router(search.router)
app.include_router(dashboard.router)
app.include_router(dashboard.dashboard_router)
app.include_router(admin.router)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "Gateway Running"}
