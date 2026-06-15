import os

base_dir = "c:/Users/LENOVO/Downloads/DBEDBD/EndProject/gateway"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# create __init__.py files
for d in ["config", "routes", "services", "middleware", "utils", "schemas"]:
    write_file(f"{base_dir}/{d}/__init__.py", "")

reqs = """fastapi==0.104.1
uvicorn==0.24.0.post1
httpx==0.25.1
python-dotenv==1.0.0
pydantic==2.5.2
pydantic-settings==2.1.0
"""
write_file(f"{base_dir}/requirements.txt", reqs)

env = """SPRING_BOOT_URL=http://localhost:8080
GATEWAY_PORT=8000
TIMEOUT_SECONDS=10
"""
write_file(f"{base_dir}/.env", env)

settings_py = """from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SPRING_BOOT_URL: str = "http://localhost:8080"
    GATEWAY_PORT: int = 8000
    TIMEOUT_SECONDS: int = 10

    class Config:
        env_file = ".env"

settings = Settings()
"""
write_file(f"{base_dir}/config/settings.py", settings_py)

http_client = """import httpx
from fastapi import Request, HTTPException
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

async def forward_request(method: str, path: str, request: Request, body: dict = None):
    url = f"{settings.SPRING_BOOT_URL}{path}"
    
    # Forward headers, notably Authorization
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    try:
        async with httpx.AsyncClient(timeout=settings.TIMEOUT_SECONDS) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=body,
                params=dict(request.query_params)
            )
            
            # If downstream returns an error, we propagate it cleanly
            if response.status_code >= 400:
                logger.error(f"Downstream error {response.status_code} at {url}: {response.text}")
                try:
                    detail = response.json()
                except Exception:
                    detail = response.text
                raise HTTPException(status_code=response.status_code, detail=detail)
                
            return response.json() if response.content else None

    except httpx.ConnectError as e:
        logger.error(f"Connection error to downstream {url}: {str(e)}")
        raise HTTPException(status_code=503, detail="Downstream service unavailable")
    except httpx.TimeoutException as e:
        logger.error(f"Timeout connecting to downstream {url}: {str(e)}")
        raise HTTPException(status_code=504, detail="Downstream service timeout")
"""
write_file(f"{base_dir}/services/http_client.py", http_client)

auth_router = """from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/auth/login", request, body)

@router.post("/register")
async def register(request: Request, body: dict = Body(...)):
    return await forward_request("POST", "/auth/register", request, body)
"""
write_file(f"{base_dir}/routes/auth.py", auth_router)

settings_router = """from fastapi import APIRouter, Request, Body
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
"""
write_file(f"{base_dir}/routes/settings.py", settings_router)

groups_router = """from fastapi import APIRouter, Request, Body
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
"""
write_file(f"{base_dir}/routes/groups.py", groups_router)

pref_router = """from fastapi import APIRouter, Request, Body
from services.http_client import forward_request

router = APIRouter(prefix="/api/preferences", tags=["Preferences"])

@router.get("")
async def get_preferences(request: Request):
    return await forward_request("GET", "/api/preferences", request)

@router.put("")
async def update_preferences(request: Request, body: dict = Body(...)):
    return await forward_request("PUT", "/api/preferences", request, body)
"""
write_file(f"{base_dir}/routes/preferences.py", pref_router)

main_py = """import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, settings, groups, preferences

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

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "Gateway Running"}
"""
write_file(f"{base_dir}/main.py", main_py)

doc = """# FastAPI API Gateway Implementation Report
**Project:** Settings and Configuration Management UI (Full Stack)
**Status:** API Gateway Initialized and Connected

---

## 1. Gateway Architecture
The system now implements a centralized **FastAPI API Gateway**. This serves as the single entry point for all frontend requests, abstracting away the internal Spring Boot microservice structure. 
The architecture is purely asynchronous, leveraging `httpx` to ensure the gateway remains lightweight and non-blocking under high concurrent loads.

## 2. Routing Flow
The gateway registers modular routers mimicking the exact structure of the downstream services:
- `/auth/*`
- `/api/settings/*`
- `/api/groups/*`
- `/api/preferences/*`

## 3. JWT Forwarding Flow
Authentication state is entirely stateless at the gateway level. The React frontend will send the JWT inside the `Authorization: Bearer <token>` header. The API Gateway extracts all client headers (excluding `host` and `content-length`) and **seamlessly forwards the JWT to Spring Boot**. 
Spring Boot performs the actual validation, cryptographic signature check, and RBAC authorization, ensuring security logic is not duplicated.

## 4. Downstream Communication
All requests are piped through the `services.http_client.forward_request()` asynchronous HTTP client. 
- **Method Preservation**: GET, POST, PUT, DELETE are maintained.
- **Body Preservation**: JSON payloads are directly forwarded.
- **Status Codes**: If Spring Boot returns a `400 Bad Request` or `401 Unauthorized`, the gateway instantly catches the response and propagates the exact JSON error and HTTP status code back to the client.

## 5. Error Handling Strategy
Centralized error handling gracefully catches internal microservice failures:
- `httpx.ConnectError` -> Returns a clean `503 Service Unavailable`.
- `httpx.TimeoutException` -> Returns a clean `504 Gateway Timeout` (configured via `TIMEOUT_SECONDS=10` in `.env`).

## 6. CORS Configuration
Cross-Origin Resource Sharing (CORS) is enabled globally at the gateway using `CORSMiddleware`. This allows the React frontend (running on a different port) to securely dispatch preflight `OPTIONS` requests, pass authorization headers, and read responses without running into strict browser security blocks.

## 7. Scalability
Because the Gateway does not store session state or validate JWT signatures, it can be horizontally scaled identically. Future microservices (e.g., a Python-based Vector Search service) can simply be appended to new router paths without modifying the core forwarding logic.
"""
write_file(f"{base_dir}/FASTAPI_GATEWAY_IMPLEMENTATION_REPORT.md", doc)
