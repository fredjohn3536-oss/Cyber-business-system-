from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI App
app = FastAPI(title="Cyber Business System API")

# Configure CORS so the React app can talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cyber Business System API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
