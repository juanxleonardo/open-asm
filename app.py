from flask import Flask, request, render_template, jsonify
from models import db, User
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///noairdrop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    user_id = data['id']
    user = User.query.filter_by(telegram_id=user_id).first()
    if not user:
        user = User(
            telegram_id=user_id,
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            username=data.get('username'),
            usdt_balance=0.0,
            referral_count=0
        )
        db.session.add(user)
        db.session.commit()
    return jsonify({'status': 'ok'})

# Additional routes will be added later
@app.route('/click', methods=['POST'])
def click():
    data = request.json
    user_id = data['id']
    user = User.query.filter_by(telegram_id=user_id).first()
    if user:
        user.usdt_balance += 0.00001
        db.session.commit()
        return jsonify({'status': 'ok'})
    else:
        return jsonify({'status': 'error', 'message': 'User not found'})

@app.route('/get_balance', methods=['POST'])
def get_balance():
    data = request.json
    user_id = data['id']
    user = User.query.filter_by(telegram_id=user_id).first()
    if user:
        return jsonify({'usdt_balance': user.usdt_balance})
    else:
        return jsonify({'usdt_balance': 0.0})

@app.route('/get_profile', methods=['POST'])
def get_profile():
    data = request.json
    user_id = data['id']
    user = User.query.filter_by(telegram_id=user_id).first()
    if user:
        name = f"{user.first_name} {user.last_name or ''}".strip()
        return jsonify({
            'name': name,
            'usdt_balance': user.usdt_balance
        })
    else:
        return jsonify({'status': 'error', 'message': 'User not found'})

if __name__ == '__main__':
    app.run(debug=True)
