
from app.database import Base, engine
from app.routes import prompts
from app.routes import auth
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


app.include_router(prompts.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API is running"}