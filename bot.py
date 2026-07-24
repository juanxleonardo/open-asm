from telegram.ext import Updater, CommandHandler
from models import db, User
from app import app

TOKEN = '7835569666:asdasd'  # Replace with your bot token

def start(update, context):
    args = context.args
    referral_id = None
    if args:
        if args[0].startswith('ref'):
            referral_id = args[0][3:]
            with app.app_context():
                inviter = User.query.filter_by(telegram_id=referral_id).first()
                if inviter:
                    inviter.referral_count += 1
                    inviter.usdt_balance += 0.1  # Add 0.1 USDT to inviter
                    db.session.commit()
    update.message.reply_text("Welcome to NoAirDrop! Click 'Play Game' to start.")

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler('start', start))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
