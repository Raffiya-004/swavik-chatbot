import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GOOGLE_API_KEY")
print(f"Key loaded: {key[:10]}...{key[-5:]}" if key else "NO KEY FOUND!")
print(f"Key length: {len(key) if key else 0}")
print(f".env file exists: {os.path.exists('.env')}")

# Read .env directly to compare
with open(".env", "r") as f:
    print(f"\n--- Raw .env contents ---")
    print(f.read())