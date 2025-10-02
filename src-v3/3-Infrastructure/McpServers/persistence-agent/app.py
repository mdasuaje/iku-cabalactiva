from flask import Flask, request, jsonify
import logging
import json
import sys
from datetime import datetime

# Configuración de logging estructurado JSON para Google Cloud Logging
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'severity': record.levelname,
            'message': record.getMessage(),
            'component': 'persistence-agent',
            'service': 'iku-persistence-agent'
        }
        
        # Añadir información extra si está disponible
        if hasattr(record, 'email'):
            log_entry['email'] = record.email
        if hasattr(record, 'operation'):
            log_entry['operation'] = record.operation
        if hasattr(record, 'db_size'):
            log_entry['db_size'] = record.db_size
            
        return json.dumps(log_entry)

# Configurar el logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Handler para stdout (compatible con Google Cloud Logging)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)

app = Flask(__name__)
db = set() # Usamos un set para simular emails únicos.

@app.route('/users/exists-by-email', methods=['POST'])
def exists_by_email():
    data = request.get_json()
    email = data.get('email')
    if not email:
        logger.error('Email validation failed - missing email parameter', 
                    extra={'operation': 'exists_by_email', 'error': 'missing_email'})
        return jsonify({'error': 'email es requerido'}), 400
    
    user_exists = email in db
    logger.info(f'Email existence check completed', 
               extra={'operation': 'exists_by_email', 'email': email, 'exists': user_exists, 'db_size': len(db)})
    
    return jsonify({'exists': user_exists})

@app.route('/users/save', methods=['POST'])
def save_user():
    data = request.get_json()
    email = data.get('email')
    if not email:
        logger.error('User save failed - missing email parameter', 
                    extra={'operation': 'save_user', 'error': 'missing_email'})
        return jsonify({'error': 'email es requerido'}), 400
    
    if email in db:
        logger.warning('User save failed - email already exists', 
                      extra={'operation': 'save_user', 'email': email, 'error': 'duplicate_email', 'db_size': len(db)})
        return jsonify({'error': 'El usuario ya existe'}), 409 # Conflict

    db.add(email)
    logger.info('User saved successfully', 
               extra={'operation': 'save_user', 'email': email, 'db_size': len(db)})
    
    return jsonify({'success': True, 'email_saved': email})

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de salud del servicio"""
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'service': 'iku-persistence-agent',
        'version': '1.0.0',
        'database': {
            'status': 'up',
            'users_count': len(db)
        }
    }
    
    logger.info('Health check performed', 
               extra={'operation': 'health_check', 'db_size': len(db), 'status': 'healthy'})
    
    return jsonify(health_status)

if __name__ == '__main__':
    logger.info('Starting IKU Persistence Agent', 
               extra={'operation': 'startup', 'port': 8082, 'version': '1.0'})
    app.run(host='0.0.0.0', port=8082)