from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag_engine import ingest_docs, get_response
from datetime import datetime
import shutil
import os
import uvicorn

app = FastAPI(title="Swavik HR AI System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(DATA_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = ingest_docs()
        return {
            "message": "Upload successful",
            "filename": file.filename,
            "index_result": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        ingest_docs()
        return {"message": f"{filename} deleted successfully"}
    raise HTTPException(status_code=404, detail="File not found")


@app.get("/files")
async def list_files():
    file_list = []
    if os.path.exists(DATA_DIR):
        for filename in os.listdir(DATA_DIR):
            if filename.startswith("."):
                continue
            path = os.path.join(DATA_DIR, filename)
            if os.path.isfile(path):
                stats = os.stat(path)
                file_list.append(
                    {
                        "name": filename,
                        "size": f"{round(stats.st_size / 1024, 2)} KB",
                        "date": datetime.fromtimestamp(stats.st_mtime).strftime(
                            "%Y-%m-%d %H:%M"
                        ),
                    }
                )
    file_list.sort(key=lambda x: x["date"], reverse=True)
    return file_list


@app.post("/chat")
async def chat(data: dict):
    user_text = data.get("text")
    if not user_text:
        return {"answer": "Please ask a question!", "sources": []}

    result = get_response(user_text)
    return result


@app.get("/stats")
async def get_stats():
    num_files = (
        len(
            [
                f
                for f in os.listdir(DATA_DIR)
                if os.path.isfile(os.path.join(DATA_DIR, f))
                and not f.startswith(".")
            ]
        )
        if os.path.exists(DATA_DIR)
        else 0
    )
    return {
        "total_docs": num_files,
        "queries": 2342,
        "accuracy": 98,
        "chart_data": [
            {"name": "Mon", "queries": 400},
            {"name": "Tue", "queries": 300},
            {"name": "Wed", "queries": 600},
            {"name": "Thu", "queries": 800},
            {"name": "Fri", "queries": 500},
            {"name": "Sat", "queries": 200},
            {"name": "Sun", "queries": 100},
        ],
    }


@app.get("/")
async def health_check():
    return {"status": "Online", "system": "Swavik HR RAG"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)