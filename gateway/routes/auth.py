from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/auth/login", request, body)

@router.post("/register")
async def register(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/auth/register", request, body)
