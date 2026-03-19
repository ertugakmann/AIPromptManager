from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse
from app.utils.security import create_access_token, hash_password, verify_password
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me", response_model=UserResponse, status_code=200)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # check if user already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User already exists")
    
    email = user.email.strip().lower()
    hashed_password = hash_password(user.password)
    new_user = User(email=email, hashed_password=hashed_password)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=TokenResponse, status_code=200)
def login(user: UserLogin, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    password = user.password
    
    # check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # verify password
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # generate access token
    access_token = create_access_token({"user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
