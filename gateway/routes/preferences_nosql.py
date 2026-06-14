from fastapi import APIRouter, Request, Body
from services.http_client import forward_node_request

router = APIRouter(prefix="/api/preferences-nosql", tags=["Preferences NoSQL"])

@router.get("/{userId}")
async def get_preferences(userId: int, request: Request):
    return await forward_node_request("GET", f"/api/preferences-nosql/{userId}", request)

@router.put("/{userId}")
async def update_preferences(userId: int, request: Request, body: dict = Body(...)):
    return await forward_node_request("PUT", f"/api/preferences-nosql/{userId}", request, body)
