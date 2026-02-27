import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader

load_dotenv()

DATA_PATH = "data/"
DB_PATH = "vector_store/faiss_index"

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

raw_key = os.getenv("GOOGLE_API_KEY")
clean_key = raw_key.strip() if raw_key else None

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", # Note: Updated to 2.0-flash as it is the current generation
    temperature=0.0,
    google_api_key=clean_key
)


def ingest_docs():
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        return "Data folder created."

    all_documents = []

    for filename in os.listdir(DATA_PATH):
        if filename.endswith(".csv"):
            filepath = os.path.join(DATA_PATH, filename)
            for encoding in ["utf-8", "latin-1", "cp1252"]:
                try:
                    loader = CSVLoader(
                        file_path=filepath,
                        encoding=encoding,
                        csv_args={"delimiter": ",", "quotechar": '"'},
                    )
                    docs = loader.load()
                    all_documents.extend(docs)
                    print(f"✅ Loaded {filename} ({len(docs)} rows)")
                    break
                except Exception:
                    continue

    if not all_documents:
        return "No CSV files found."

    # FIX 1: Removed the RecursiveCharacterTextSplitter. 
    # For CSVs, keeping 1 row = 1 document preserves the context perfectly.

    # Format the documents with their source
    for doc in all_documents:
        source_file = os.path.basename(
            doc.metadata.get("source", "Unknown")
        )
        doc.page_content = f"[Source: {source_file}]\n{doc.page_content}"

    # Ingest the full rows directly into FAISS
    vectorstore = FAISS.from_documents(all_documents, embeddings)
    os.makedirs("vector_store", exist_ok=True)
    vectorstore.save_local(DB_PATH)

    return f"Indexed {len(all_documents)} complete rows."


def get_response(query: str):
    if not os.path.exists(DB_PATH):
        return {
            "answer": "Knowledge base empty. Upload documents first.",
            "sources": [],
        }

    vectorstore = FAISS.load_local(
        DB_PATH, embeddings, allow_dangerous_deserialization=True
    )

    # FIX 2: Changed to similarity search and increased 'k' to 30.
    # This ensures the DB pulls up to 30 rows, easily covering your 20 policies.
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 30}
    )

    docs = retriever.invoke(query)

    if not docs:
        return {
            "answer": "No relevant information found.",
            "sources": [],
        }

    context_parts = []
    for i, doc in enumerate(docs):
        source = os.path.basename(doc.metadata.get("source", "Unknown"))
        row_num = doc.metadata.get("row", "N/A")
        context_parts.append(
            f"--- Document {i+1} (Source: {source}, Row: {row_num}) ---\n"
            f"{doc.page_content}\n"
        )

    context = "\n".join(context_parts)

    prompt = f"""You are the Senior HR Assistant for Swavik.

RULES:
1. Answer ONLY using the Context below.
2. If context has relevant data, extract and present it clearly.
3. If partial info exists, share what you found.
4. If NOT in context: "This information is not in the uploaded documents. Please contact HR."
5. Do NOT hallucinate or make up data.
6. Format CSV data as tables or bullet points.
7. Mention source files.

CONTEXT:
{context}

QUESTION: {query}

RESPONSE (use Summary + Details + Source format):"""

    response = llm.invoke(prompt)
    
    sources = list(
        set(
            os.path.basename(doc.metadata.get("source", "Unknown"))
            for doc in docs
        )
    )

    return {"answer": response.content, "sources": sources}