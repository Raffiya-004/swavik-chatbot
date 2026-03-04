from google import genai

client = genai.Client(api_key="AIzaSy_PASTE_YOUR_NEW_KEY_HERE")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Say hello in one word"
)

print("SUCCESS:", response.text)