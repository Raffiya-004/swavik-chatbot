from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse 
from rag_engine import ingest_docs, get_response
from datetime import datetime
import pandas as pd
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

        # rag_engine will now handle .csv, .xls, and .xlsx automatically
        result = ingest_docs()
        return {
            "message": "Upload successful",
            "filename": file.filename,
            "index_result": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/view/{filename}")
async def view_file(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/preview/{filename}")
async def preview_file(filename: str):
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        if filename.lower().endswith(".csv"):
            for enc in ["utf-8", "latin-1", "cp1252"]:
                try:
                    df = pd.read_csv(file_path, encoding=enc)
                    break
                except Exception:
                    continue
            else:
                raise HTTPException(status_code=400, detail="Could not read CSV file")
        elif filename.lower().endswith((".xlsx", ".xls")):
            df = pd.read_excel(file_path, sheet_name=0)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        df = df.fillna("")
        preview_rows = df.head(100).to_dict(orient="records")
        return {
            "filename": filename,
            "columns": list(df.columns),
            "rows": preview_rows,
            "total_rows": len(df),
        }
    except HTTPException:
        raise
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
    chat_history = data.get("history", []) 
    
    if not user_text:
        return {"answer": "Please ask a question!", "sources": []}

    result = get_response(user_text, chat_history=chat_history)
    return result

@app.get("/stats")
async def get_stats():
    # UPDATED: Count all supported document types for the dashboard
    valid_extensions = ('.csv', '.xlsx', '.xls')
    num_files = 0
    if os.path.exists(DATA_DIR):
        num_files = len([
            f for f in os.listdir(DATA_DIR) 
            if f.lower().endswith(valid_extensions) and not f.startswith(".")
        ])
        
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