from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel

from app.database.database import get_db
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/workspace", tags=["Workspace"])

class InitRequest(BaseModel):
    device_id: str
    device_name: str = "Unknown Device"
    platform: str = "Unknown"

class JoinRequest(BaseModel):
    token_id: str
    device_id: str
    device_name: str = "Unknown Device"
    platform: str = "Unknown"

class RenameRequest(BaseModel):
    new_name: str

@router.post("/init", response_model=dict)
def init_workspace(req: InitRequest, db: Session = Depends(get_db)):
    ws_service = WorkspaceService(db)
    workspace_id = ws_service.init_device(req.device_id, req.device_name, req.platform)
    return {"workspace_id": workspace_id}

@router.post("/pairing/generate", response_model=dict)
def generate_pairing_token(
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    if not x_workspace_id:
        raise HTTPException(status_code=400, detail="Workspace ID is required")
    ws_service = WorkspaceService(db)
    token_info = ws_service.generate_token(x_workspace_id)
    return token_info

@router.post("/pairing/join", response_model=dict)
def join_workspace(req: JoinRequest, db: Session = Depends(get_db)):
    ws_service = WorkspaceService(db)
    try:
        workspace_id = ws_service.join_workspace(req.token_id, req.device_id, req.device_name, req.platform)
        return {"workspace_id": workspace_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/devices", response_model=List[dict])
def list_devices(
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    if not x_workspace_id:
        return []
    ws_service = WorkspaceService(db)
    return ws_service.list_devices(x_workspace_id)

@router.put("/devices/{device_id}", response_model=dict)
def rename_device(
    device_id: str,
    req: RenameRequest,
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    if not x_workspace_id:
        raise HTTPException(status_code=400, detail="Workspace ID is required")
    ws_service = WorkspaceService(db)
    success = ws_service.rename_device(x_workspace_id, device_id, req.new_name)
    if not success:
        raise HTTPException(status_code=404, detail="Device not found in workspace")
    return {"success": True}

@router.delete("/devices/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_device(
    device_id: str,
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    if not x_workspace_id:
        raise HTTPException(status_code=400, detail="Workspace ID is required")
    ws_service = WorkspaceService(db)
    success = ws_service.remove_device(x_workspace_id, device_id)
    if not success:
        raise HTTPException(status_code=404, detail="Device not found in workspace")
    return None
