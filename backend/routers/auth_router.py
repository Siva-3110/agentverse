from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.db_models import User, UserSession, SystemLog
from backend.services.auth_service import hash_password, verify_password, create_access_token, require_auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Pydantic Request Schemas
class SignUpRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    phone: Optional[str] = None
    country: Optional[str] = "India"
    state: Optional[str] = "Tamil Nadu"
    city: Optional[str] = "Chennai"
    organization: Optional[str] = "PatentScout AI"
    department: Optional[str] = "Deep Tech R&D"
    role: str = "Researcher" # Researcher or Admin
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    department: Optional[str] = None
    profile_image: Optional[str] = None

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest, request: Request, db: Session = Depends(get_db)):
    # Check existing email
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    # Check existing username
    existing_username = db.query(User).filter(User.username == payload.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username is already taken.")

    role = payload.role if payload.role in ["Researcher", "Admin"] else "Researcher"

    new_user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        username=payload.username,
        email=payload.email,
        phone=payload.phone,
        country=payload.country,
        state=payload.state,
        city=payload.city,
        organization=payload.organization,
        department=payload.department,
        role=role,
        password_hash=hash_password(payload.password),
        is_verified=True,
        is_active=True,
        last_login=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})

    # Record User Session
    user_agent = request.headers.get("User-Agent", "Unknown Device")
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_record = UserSession(
        user_id=new_user.id,
        jwt_token=token,
        ip_address=client_ip,
        device=user_agent[:90],
        browser="Browser"
    )
    db.add(session_record)

    # Log System Event
    db.add(SystemLog(category="Auth", level="INFO", message=f"New user registered: {new_user.email} as {new_user.role}"))
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "username": new_user.username,
            "email": new_user.email,
            "phone": new_user.phone,
            "role": new_user.role,
            "organization": new_user.organization,
            "department": new_user.department
        }
    }

@router.post("/login")
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    clean_email = str(payload.email).strip().lower()
    
    # Auto-seed the primary Admin user balansivaganesh@gmail.com if logging in
    if clean_email == "balansivaganesh@gmail.com" and payload.password == "123456":
        admin_user = db.query(User).filter(User.email == clean_email).first()
        if not admin_user:
            admin_user = User(
                first_name="Balan",
                last_name="Sivaganesh",
                username="balansivaganesh",
                email=clean_email,
                role="Admin",
                password_hash=hash_password("123456"),
                is_verified=True,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        user = admin_user
    else:
        user = db.query(User).filter(User.email == clean_email, User.is_active == True).first()
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password.")

    user.last_login = datetime.utcnow()
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})

    client_ip = request.client.host if request.client else "127.0.0.1"
    db.add(UserSession(
        user_id=user.id,
        jwt_token=token,
        ip_address=client_ip,
        device=request.headers.get("User-Agent", "Unknown")[:90]
    ))
    db.add(SystemLog(category="Auth", level="INFO", message=f"User logged in: {user.email} as {user.role}"))
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "organization": user.organization,
            "department": user.department
        }
    }

@router.post("/logout")
def logout(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    db.add(SystemLog(category="Auth", level="INFO", message=f"User logged out: {current_user.email}"))
    db.commit()
    return {"message": "Successfully logged out."}

@router.post("/verify-email")
def verify_email(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    current_user.is_verified = True
    db.commit()
    return {"message": "Email verified successfully."}

@router.get("/me")
def get_profile(current_user: User = Depends(require_auth)):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "username": current_user.username,
        "email": current_user.email,
        "phone": current_user.phone,
        "country": current_user.country,
        "state": current_user.state,
        "city": current_user.city,
        "organization": current_user.organization,
        "department": current_user.department,
        "role": current_user.role,
        "profile_image": current_user.profile_image,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at
    }

@router.put("/me")
def update_profile(payload: UpdateProfileRequest, current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    if payload.first_name: current_user.first_name = payload.first_name
    if payload.last_name: current_user.last_name = payload.last_name
    if payload.phone: current_user.phone = payload.phone
    if payload.organization: current_user.organization = payload.organization
    if payload.department: current_user.department = payload.department
    if payload.profile_image: current_user.profile_image = payload.profile_image

    current_user.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Profile updated successfully.", "user": get_profile(current_user)}

@router.delete("/me")
def delete_account(current_user: User = Depends(require_auth), db: Session = Depends(get_db)):
    current_user.is_active = False
    db.commit()
    return {"message": "Account deactivated successfully."}
