import os
from dotenv import load_dotenv

# 1. CORE LANGCHAIN IMPORTS
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

# --- CONFIGURATION ---
DATA_PATH = "data/"
DB_PATH = "vector_store/faiss_index"

# 1. Initialize FREE local embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 2. Initialize Groq LLM with Clean Key
raw_key = os.getenv("GROQ_API_KEY")
clean_key = raw_key.strip() if raw_key else None

llm = ChatGroq(
    temperature=0.2, # Slightly increased for more natural, detailed flow
    groq_api_key=clean_key,
    model_name="llama-3.3-70b-versatile"
)

def ingest_docs():
    """Reads CSVs and builds the searchable vector database."""
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        return "Data folder created. Please add CSV files."

    # Using CSVLoader directly for better row preservation
    loader = DirectoryLoader(DATA_PATH, glob="*.csv", loader_cls=CSVLoader)
    documents = loader.load()

    if not documents:
        return "No CSV files found to index."

    # Increased chunk size for richer context per chunk
    text_splitter = RecursiveCharacterCharacterSplitter(chunk_size=1200, chunk_overlap=150)
    texts = text_splitter.split_documents(documents)

    vectorstore = FAISS.from_documents(texts, embeddings)
    os.makedirs("vector_store", exist_ok=True)
    vectorstore.save_local(DB_PATH)

    return f"Success! Indexed {len(documents)} rows."

def get_response(query: str):
    """Retrieves context and generates a DETAILED AI answer."""
    if not os.path.exists(DB_PATH):
        return {"answer": "Knowledge base empty. Please upload documents.", "sources": []}

    vectorstore = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)
    
    # INCREASED k to 10 for more detailed source material
    docs = vectorstore.as_retriever(search_kwargs={"k": 10}).invoke(query)
    
    if not docs:
        return {"answer": "I couldn't find information on that in our records.", "sources": []}

    context = "\n\n".join([doc.page_content for doc in docs])

    # ENHANCED PROMPT FOR LONGER ANSWERS
    prompt = f"""
    You are the Senior HR Assistant for Swavik. Your goal is to provide comprehensive, professional, and detailed answers.
    
    INSTRUCTIONS:
    - Use the context below to answer the question thoroughly.
    - If the policy contains multiple rules or steps, use bullet points.
    - Provide a "Summary" and a "Detailed Breakdown" if applicable.
    - If the answer is not in the context, say 'I do not have information on this policy in my current database.'
    
    Context:
    {context}
    
    User Question: {query}
    
    Detailed HR Response:"""

    response = llm.invoke(prompt)
    sources = list(set([os.path.basename(doc.metadata.get("source", "Unknown")) for doc in docs]))

    return {"answer": response.content, "sources": sources}