import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

if not GOOGLE_API_KEY:
    raise ValueError("A chave da API do Google não foi encontrada. Defina 'GOOGLE_API_KEY' no arquivo .env.")

# Configura a API do Google Generative AI
genai.configure(api_key=GOOGLE_API_KEY)

# Inicializa o modelo
model = genai.GenerativeModel("gemini-1.5-pro-latest")
