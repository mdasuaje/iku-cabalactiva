from flask import Flask, request, jsonify
# En una implementación real, la lógica de Google Sheets estaría aquí.
# Por ahora, simularemos la base de datos en memoria.

app = Flask(__name__)
db = set() # Usamos un set para simular emails únicos.

@app.route('/users/exists-by-email', methods=['POST'])
def exists_by_email():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'email es requerido'}), 400
    
    user_exists = email in db
    return jsonify({'exists': user_exists})

@app.route('/users/save', methods=['POST'])
def save_user():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'email es requerido'}), 400
    
    if email in db:
        return jsonify({'error': 'El usuario ya existe'}), 409 # Conflict

    db.add(email)
    print(f"Base de datos simulada: {db}")
    return jsonify({'success': True, 'email_saved': email})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8082)