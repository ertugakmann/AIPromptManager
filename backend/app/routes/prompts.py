from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.prompt import Prompt
from app.schemas.prompt import PromptCreate, PromptResponse


router = APIRouter(prefix="/prompts", tags=["prompts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PromptResponse)
def create_prompt(prompt: PromptCreate, db: Session = Depends(get_db)):

    new_prompt = Prompt(
        title=prompt.title,
        content=prompt.content,
        user_id=1
    )

    db.add(new_prompt)
    db.commit()
    db.refresh(new_prompt)

    return new_prompt
