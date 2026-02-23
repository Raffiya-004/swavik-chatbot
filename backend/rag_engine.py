import os
from dotenv import load_dotenv

# CORE LANGCHAIN IMPORTS
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter # Fixed typo here

load_dotenv()

DATA_PATH = "data/"
DB_PATH = "vector_store/faiss_index"

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

raw_key = os.getenv("GROQ_API_KEY")
clean_key = raw_key.strip() if raw_key else None

llm = ChatGroq(
    temperature=0.0, # Reduced to 0 for strict factual accuracy
    groq_api_key=clean_key,
    model_name="llama-3.3-70b-versatile"
)

def ingest_docs():
    """Reads CSVs and builds the searchable vector database."""
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        return "Data folder created."

    # Load CSVs
    loader = DirectoryLoader(DATA_PATH, glob="*.csv", loader_cls=CSVLoader)
    documents = loader.load()

    if not documents:
        return "No CSV files found."

    # Optimized splitting: Smaller chunks with more overlap keeps rows together better
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=25)
    texts = text_splitter.split_documents(documents)

    vectorstore = FAISS.from_documents(texts, embeddings)
    os.makedirs("vector_store", exist_ok=True)
    vectorstore.save_local(DB_PATH)

    return f"Success! Indexed {len(documents)} rows."

def get_response(query: str):
    """Retrieves context and generates a STRICT HR answer."""
    if not os.path.exists(DB_PATH):
        return {"answer": "Knowledge base empty. Please upload documents.", "sources": []}

    vectorstore = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)
    
    # Retrieve top 5 most relevant snippets
    docs = vectorstore.as_retriever(search_kwargs={"k": 20}).invoke(query)
    
    if not docs:
        return {"answer": "I couldn't find information on that in our records.", "sources": []}

    context = "\n\n".join([doc.page_content for doc in docs])

    # REFINED PROMPT: Forcing the AI to use ONLY the provided context
    prompt = f"""
    You are the Senior HR Assistant for Swavik. 
    
    STRICT RULES:
    1. Answer ONLY using the provided Context below.
    2. If the answer (like specific working days) is NOT in the context, state: "I do not have information on the specific number of working days in my database. Please contact HR."
    3. Do NOT provide general calendar information or "typical" month data.
    4. Format with a 'Summary' and 'Detailed Breakdown'.

    Context:
    {context}
    
    User Question: {query}
    
    Detailed HR Response:"""

    response = llm.invoke(prompt)
    sources = list(set([os.path.basename(doc.metadata.get("source", "Unknown")) for doc in docs]))

    return {"answer": response.content, "sources": sources}