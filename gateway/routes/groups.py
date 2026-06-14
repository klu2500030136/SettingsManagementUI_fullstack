from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/api/groups", tags=["Groups"])

@router.post("")
async def create_group(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/api/groups", request, body)

@router.put("/{id}")
async def update_group(id: int, request: Request, body: dict = Body(...)):
    return await forward_request("PUT", f"/api/groups/{id}", request, body)

@router.delete("/{id}")
async def delete_group(id: int, request: Request):
    return await forward_request("DELETE", f"/api/groups/{id}", request)

@router.get("")
async def get_all_groups(request: Request):
    return await forward_request("GET", "/api/groups", request)

@router.get("/{id}")
async def get_group_by_id(id: int, request: Request):
    return await forward_request("GET", f"/api/groups/{id}", request)
