from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot.chatbot import gerar_resposta_informada

app = Flask(__name__)
CORS(app)


def validar_dados(data):
    prompt = data.get('prompt')
    usuario_id = data.get('usuario_id')

    if not prompt:
        return None, None, "O campo 'prompt' é obrigatório."

    if prompt.lower() == "inicio" and not usuario_id:
        return None, None, "O campo 'usuario_id' é obrigatório quando o prompt é 'inicio'."

    if not usuario_id:
        return prompt, "anonymous", None

    return prompt, usuario_id, None


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()

        prompt, usuario_id, error = validar_dados(data)

        if error:
            return jsonify({"error": error}), 400

        resposta = gerar_resposta_informada(prompt, usuario_id)

        return jsonify({"response": resposta})

    except Exception as e:
        print(f"Erro no endpoint /chat: {e}")
        return jsonify({"error": "Ocorreu um erro no servidor. Tente novamente mais tarde."}), 500


if __name__ == '__main__':
    print("ChatBot está rodando")
    app.run()
