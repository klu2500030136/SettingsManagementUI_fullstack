from fastapi import APIRouter, Request
from services.http_client import forward_request

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])
dashboard_router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(request: Request):
    return await forward_request("GET", "/api/dashboard/stats", request)

@dashboard_router.get("/stats")
async def get_dashboard_stats_alias(request: Request):
    return await forward_request("GET", "/api/dashboard/stats", request)
