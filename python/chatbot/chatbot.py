from chatbot.config import model
from chatbot.database import obter_informacoes_usuario

# Armazena o histórico de cada conversa, indexado por usuario_id
conversations = {}

def gerar_resposta_informada(prompt, usuario_id):
    try:
        # Inicializa o histórico de conversa para o usuário, se não existir
        if usuario_id not in conversations:
            conversations[usuario_id] = []

        # Se for o início da conversa, adiciona uma saudação personalizada
        if prompt.lower() == "inicio":
            info_usuario = "Nicole"
           # info_usuario = obter_informacoes_usuario(usuario_id)
            saudacao = f"Olá {info_usuario}, eu sou o FluxBot, seu assistente de suporte técnico! Como posso ajudar hoje?"
            # Adiciona a saudação ao histórico como uma mensagem do modelo
            conversations[usuario_id].append({
                "role": "model",
                "parts": [{"text": saudacao}]
            })
            return saudacao

        # Adiciona a entrada do usuário ao histórico
        conversations[usuario_id].append({
            "role": "user",
            "parts": [{"text": prompt}]
        })

        # Gera a resposta usando o modelo do Google
        chat = model.start_chat(history=conversations[usuario_id])
        resposta_modelo = chat.send_message({"parts": [{"text": prompt}]})

        # Adiciona a resposta ao histórico
        conversations[usuario_id].append({
            "role": "model",
            "parts": [{"text": resposta_modelo.text}]
        })

        return resposta_modelo.text

    except Exception as e:
        print(f"Erro ao gerar resposta: {e}")
        return "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde."
