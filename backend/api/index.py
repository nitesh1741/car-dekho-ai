from mangum import Mangum

# Import the FastAPI app defined in backend/app/main.py
from backend.app.main import app as fastapi_app

# Vercel expects a callable named `handler`
handler = Mangum(fastapi_app)
