import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

def conectar_banco():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_DATABASE'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT')
        )
        return connection
    except Error as e:
        print("Erro ao conectar ao MySQL:", e)
        return None

def obter_informacoes_usuario(usuario_id):
    connection = conectar_banco()
    if connection is None:
        return "Não foi possível conectar ao banco de dados."

    try:
        cursor = connection.cursor()
        consulta = "SELECT username FROM tb_user WHERE user_id = %s"
        cursor.execute(consulta, (usuario_id,))
        resultado = cursor.fetchone()

        if resultado is None:
            return f"Usuário com ID {usuario_id} não encontrado."
        else:
            return resultado[0]

    except Error as e:
        return f"Erro ao consultar o banco de dados: {e}"
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
