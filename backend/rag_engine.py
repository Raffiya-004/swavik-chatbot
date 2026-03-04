import os
import time
import pandas as pd
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader
from langchain_core.documents import Document

load_dotenv()

DATA_PATH = "data/"
DB_PATH = "vector_store/faiss_index"

# Load API key safely
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

print(f"Using API key: {GOOGLE_API_KEY[:10]}...")

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    google_api_key=GOOGLE_API_KEY
)

def ingest_docs():
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        return "Data folder created."

    all_documents = []

    for filename in os.listdir(DATA_PATH):
        filepath = os.path.join(DATA_PATH, filename)

        if filename.endswith(".csv"):
            loaded = False
            for encoding in ["utf-8", "latin-1", "cp1252"]:
                try:
                    loader = CSVLoader(
                        file_path=filepath,
                        encoding=encoding,
                        csv_args={"delimiter": ",", "quotechar": '"'},
                    )
                    docs = loader.load()
                    for doc in docs:
                        doc.metadata["source"] = filename
                    all_documents.extend(docs)
                    print(f"Loaded CSV: {filename}")
                    loaded = True
                    break
                except Exception:
                    continue
            if not loaded:
                print(f"Failed to load CSV: {filename}")

        elif filename.endswith((".xlsx", ".xls")):
            try:
                df_dict = pd.read_excel(filepath, sheet_name=None)
                for sheet_name, data in df_dict.items():
                    for index, row in data.iterrows():
                        row_data = row.dropna()
                        content = "\n".join(
                            [f"{col}: {val}" for col, val in row_data.items()]
                        )
                        doc = Document(
                            page_content=content,
                            metadata={
                                "source": filename,
                                "sheet": sheet_name,
                                "row": index,
                            },
                        )
                        all_documents.append(doc)
                print(f"Loaded Excel: {filename}")
            except Exception as e:
                print(f"Error loading Excel {filename}: {e}")

    if not all_documents:
        return "No supported files found."

    for doc in all_documents:
        source_file = doc.metadata.get("source", "Unknown")
        doc.page_content = f"[Source: {source_file}]\n{doc.page_content}"

    vectorstore = FAISS.from_documents(all_documents, embeddings)
    os.makedirs("vector_store", exist_ok=True)
    vectorstore.save_local(DB_PATH)

    return f"Indexed {len(all_documents)} total rows/entries."


def get_response(query, chat_history=None):
    if not os.path.exists(DB_PATH):
        return {
            "answer": "Knowledge base empty. Please upload files first.",
            "sources": [],
        }

    try:
        vectorstore = FAISS.load_local(
            DB_PATH, embeddings, allow_dangerous_deserialization=True
        )

        retriever = vectorstore.as_retriever(
            search_type="similarity", search_kwargs={"k": 30}
        )

        docs = retriever.invoke(query)

        context = "\n".join(
            [f"--- Document Content ---\n{d.page_content}" for d in docs]
        )

        history_text = ""
        if chat_history:
            history_text = "\n".join(
                [f"{m['role'].upper()}: {m['text']}" for m in chat_history[-6:]]
            )

        prompt = f"""You are the Senior HR Assistant for Swavik.

RULES:
1. If the user asks for a 'summary' or 'recap' of the chat, use the CONVERSATION HISTORY.
2. If the user asks a factual HR question, use the DOCUMENT CONTEXT.
3. If information is not in either, say: "This information is not in the uploaded documents. Please contact HR."
4. Use the conversation history to understand what 'it' or 'this' refers to.
5. Format responses clearly with bullet points.

CONVERSATION HISTORY:
{history_text}

DOCUMENT CONTEXT:
{context}

CURRENT QUESTION: {query}

RESPONSE:"""

        response = llm.invoke(prompt)
        sources = list(set([doc.metadata.get("source", "Unknown") for doc in docs]))
        return {"answer": response.content, "sources": sources}

    except Exception as e:
        error_msg = str(e)
        print(f"LLM Error: {error_msg}")

        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return {
                "answer": "API quota exceeded. Please try again in a few minutes or update your API key.",
                "sources": [],
            }
        else:
            return {
                "answer": f"An error occurred: {error_msg[:300]}",
                "sources": [],
            }