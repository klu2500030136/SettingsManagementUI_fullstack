from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.post("")
async def create_setting(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/api/settings", request, body)

@router.put("/{id}")
async def update_setting(id: int, request: Request, body: dict = Body(...)):
    return await forward_request("PUT", f"/api/settings/{id}", request, body)

@router.delete("/{id}")
async def delete_setting(id: int, request: Request):
    return await forward_request("DELETE", f"/api/settings/{id}", request)

@router.get("")
async def get_all_settings(request: Request):
    return await forward_request("GET", "/api/settings", request)

@router.get("/{id}")
async def get_setting_by_id(id: int, request: Request):
    return await forward_request("GET", f"/api/settings/{id}", request)
