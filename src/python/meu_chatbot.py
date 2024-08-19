from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from flask import Flask, request, jsonify

# Criação do ChatBot
chatbot = ChatBot('Meu ChatBot')

# Treinador
trainer = ChatterBotCorpusTrainer(chatbot)

# Treinamento em português
trainer.train('chatterbot.corpus.portuguese')

# Criação da aplicação Flask
app = Flask(__name__)

# Rota para interação com o chatbot
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    bot_response = chatbot.get_response(user_input)
    return jsonify({'response': str(bot_response)})

# Rota de teste
@app.route('/', methods=['GET'])
def index():
    return "API do ChatBot está rodando!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



    # from chatterbot import ChatBot
# from chatterbot.trainers import ChatterBotCorpusTrainer
# from flask import Flask, request, jsonify

# # Criação
# chatbot = ChatBot('Meu ChatBot')

# # Treinador
# trainer = ChatterBotCorpusTrainer(chatbot)

# # Treinamento em português
# trainer.train('chatterbot.corpus.portuguese')


# # Interação com o chatbot
# while True:
#     try:
#         user_input = input("Você: ")
#         bot_response = chatbot.get_response(user_input)
#         print(f"Bot: {bot_response}")
#     except (KeyboardInterrupt, EOFError, SystemExit):
#         break
