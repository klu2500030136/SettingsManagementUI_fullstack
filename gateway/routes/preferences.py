from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/api/preferences", tags=["Preferences"])

@router.get("")
async def get_preferences(request: Request):
    return await forward_request("GET", "/api/preferences", request)

@router.put("")
async def update_preferences(request: Request, body: dict = Body(...)):
    return await forward_request("PUT", "/api/preferences", request, body)

@router.post("")
async def save_preferences(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/api/preferences", request, body)
