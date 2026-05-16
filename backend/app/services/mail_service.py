import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()

class MailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME", "admin@clima-cast.com"),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "password"),
            MAIL_FROM=os.getenv("MAIL_FROM", "admin@clima-cast.com"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
            MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
            MAIL_FROM_NAME="Clima-Cast Atmospheric Intelligence",
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )
        self.fm = FastMail(self.conf)

    async def send_reset_password_email(self, email_to: str, token: str):
        message = MessageSchema(
            subject="Reset Your Atmospheric Intelligence Access",
            recipients=[email_to],
            body=f"""
            <html>
                <body style="font-family: 'Inter', sans-serif; color: #1d1b20; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e6e0e9; border-radius: 12px; background-color: #fdf7ff;">
                        <h2 style="color: #6750a4; margin-bottom: 24px;">Security Alert: Password Reset</h2>
                        <p>We received a request to reset the password for your Clima-Cast account.</p>
                        <p>If you didn't make this request, you can safely ignore this email. Your atmospheric data remains secure.</p>
                        <div style="margin: 32px 0;">
                            <a href="http://localhost:5173/reset-password?token={token}" 
                               style="background-color: #6750a4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                               Reset Password
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #494551;">This link will expire in 30 minutes.</p>
                        <hr style="border: 0; border-top: 1px solid #e6e0e9; margin: 32px 0;">
                        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Clima-Cast © 2026 — Intelligence Dashboard</p>
                    </div>
                </body>
            </html>
            """,
            subtype=MessageType.html
        )
        await self.fm.send_message(message)

mail_service = MailService()
