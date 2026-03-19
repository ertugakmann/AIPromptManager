from pydantic import BaseModel

class PromptCreate(BaseModel):
    title: str
    content: str

class PromptResponse(BaseModel):
    id: int
    title: str
    content: str

    class Config:
       from_attributes = True