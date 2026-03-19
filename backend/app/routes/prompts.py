from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.prompt import Prompt
from app.models.user import User
from app.schemas.prompt import PromptCreate, PromptResponse


router = APIRouter(prefix="/prompts", tags=["prompts"])

@router.post("/", response_model=PromptResponse)
def create_prompt(
    prompt: PromptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    new_prompt = Prompt(
        title=prompt.title,
        content=prompt.content,
        user_id=current_user.id,
    )

    db.add(new_prompt)
    db.commit()
    db.refresh(new_prompt)

    return new_prompt

@router.get("/", response_model=list[PromptResponse])
def get_prompts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prompts = db.query(Prompt).filter(Prompt.user_id == current_user.id).all()
    return prompts