from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/users")
async def get_users(request: Request):
    return await forward_request("GET", "/api/admin/users", request)

@router.get("/stats")
async def get_stats(request: Request):
    return await forward_request("GET", "/api/admin/stats", request)

@router.put("/users/{id}/role")
async def update_user_role(id: int, request: Request, body: dict = Body(...)):
    return await forward_request("PUT", f"/api/admin/users/{id}/role", request, body)

@router.delete("/users/{id}")
async def delete_user(id: int, request: Request):
    return await forward_request("DELETE", f"/api/admin/users/{id}", request)
