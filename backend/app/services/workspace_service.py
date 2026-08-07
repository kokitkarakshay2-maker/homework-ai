from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.models.homework import Workspace, WorkspaceDevice, PairingToken, HomeworkHistory
import uuid

class WorkspaceService:
    def __init__(self, db: Session):
        self.db = db

    def init_device(self, device_id: str, device_name: str = "Unknown Device", platform: str = "Unknown") -> str:
        """
        Ensures a device belongs to a workspace.
        If the device is already in a workspace, return the workspace_id.
        Otherwise, create a new workspace and add the device to it.
        Also backfill any old history from this device_id to the new workspace.
        """
        device = self.db.query(WorkspaceDevice).filter(WorkspaceDevice.device_id == device_id).first()
        if device:
            device.last_active = datetime.now(timezone.utc)
            if device_name and device_name != "Unknown Device":
                device.device_name = device_name
            if platform and platform != "Unknown":
                device.platform = platform
            self.db.commit()
            return device.workspace_id

        # Create new workspace
        workspace = Workspace()
        self.db.add(workspace)
        self.db.flush()

        new_device = WorkspaceDevice(
            workspace_id=workspace.id,
            device_id=device_id,
            device_name=device_name,
            platform=platform
        )
        self.db.add(new_device)

        # Backfill history
        histories = self.db.query(HomeworkHistory).filter(
            HomeworkHistory.device_id == device_id,
            HomeworkHistory.workspace_id == None
        ).all()
        for h in histories:
            h.workspace_id = workspace.id

        self.db.commit()
        return workspace.id

    def generate_token(self, workspace_id: str) -> dict:
        """
        Generate a pairing token valid for 5 minutes.
        """
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
        token = PairingToken(workspace_id=workspace_id, expires_at=expires_at)
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return {"token_id": token.id, "expires_at": token.expires_at.isoformat()}

    def join_workspace(self, token_id: str, device_id: str, device_name: str, platform: str) -> str:
        """
        Validate token and join device to workspace.
        Returns the workspace_id if successful.
        """
        token = self.db.query(PairingToken).filter(
            PairingToken.id == token_id,
            PairingToken.used == False,
            PairingToken.expires_at > datetime.now(timezone.utc)
        ).first()

        if not token:
            raise ValueError("Invalid or expired pairing token")

        workspace_id = token.workspace_id
        token.used = True

        # Check if device already exists
        device = self.db.query(WorkspaceDevice).filter(WorkspaceDevice.device_id == device_id).first()
        if device:
            # Move device to new workspace
            device.workspace_id = workspace_id
            device.device_name = device_name
            device.platform = platform
            device.last_active = datetime.now(timezone.utc)
        else:
            new_device = WorkspaceDevice(
                workspace_id=workspace_id,
                device_id=device_id,
                device_name=device_name,
                platform=platform
            )
            self.db.add(new_device)

        # Backfill history for this device to new workspace
        histories = self.db.query(HomeworkHistory).filter(
            HomeworkHistory.device_id == device_id
        ).all()
        for h in histories:
            h.workspace_id = workspace_id

        # Optional: delete expired tokens to clean up
        self.db.query(PairingToken).filter(
            PairingToken.expires_at < datetime.now(timezone.utc)
        ).delete()

        self.db.commit()
        return workspace_id

    def list_devices(self, workspace_id: str):
        devices = self.db.query(WorkspaceDevice).filter(WorkspaceDevice.workspace_id == workspace_id).all()
        return [{
            "id": d.id,
            "device_id": d.device_id,
            "device_name": d.device_name,
            "platform": d.platform,
            "last_active": d.last_active.isoformat() if d.last_active else None
        } for d in devices]

    def rename_device(self, workspace_id: str, device_id: str, new_name: str) -> bool:
        device = self.db.query(WorkspaceDevice).filter(
            WorkspaceDevice.workspace_id == workspace_id,
            WorkspaceDevice.device_id == device_id
        ).first()
        if not device:
            return False
        
        device.device_name = new_name
        self.db.commit()
        return True

    def remove_device(self, workspace_id: str, device_id: str) -> bool:
        device = self.db.query(WorkspaceDevice).filter(
            WorkspaceDevice.workspace_id == workspace_id,
            WorkspaceDevice.device_id == device_id
        ).first()
        if not device:
            return False
        
        self.db.delete(device)
        self.db.commit()
        return True
