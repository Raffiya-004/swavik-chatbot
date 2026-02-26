import os
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

DATA_PATH = "data/"
DB_PATH = "vector_store/faiss_index"

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

raw_key = os.getenv("GROQ_API_KEY")
clean_key = raw_key.strip() if raw_key else None

llm = ChatGroq(
    temperature=0.0,
    groq_api_key=clean_key,
    model_name="llama-3.3-70b-versatile"
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

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        separators=["\n\n", "\n", ",", " "],
    )
    texts = text_splitter.split_documents(all_documents)

    for text in texts:
        source_file = os.path.basename(
            text.metadata.get("source", "Unknown")
        )
        text.page_content = f"[Source: {source_file}]\n{text.page_content}"

    vectorstore = FAISS.from_documents(texts, embeddings)
    os.makedirs("vector_store", exist_ok=True)
    vectorstore.save_local(DB_PATH)

    return f"Indexed {len(all_documents)} rows into {len(texts)} chunks."


def get_response(query: str):
    if not os.path.exists(DB_PATH):
        return {
            "answer": "Knowledge base empty. Upload documents first.",
            "sources": [],
        }

    vectorstore = FAISS.load_local(
        DB_PATH, embeddings, allow_dangerous_deserialization=True
    )

    retriever = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 20, "fetch_k": 25, "lambda_mult": 0.7},
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
            f"--- Chunk {i+1} (Source: {source}, Row: {row_num}) ---\n"
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