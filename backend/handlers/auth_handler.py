import tornado.web
import json
import bcrypt
from db import get_connection

class AuthHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()

    def post(self, action):
        try:
            data = json.loads(self.request.body)
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            if action == "signup":
                username = data.get("username")
                email = data.get("email")
                password = data.get("password")
                password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

                cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                               (username, email, password_hash))
                conn.commit()
                self.write({"message": "User registered successfully"})

            elif action == "login":
                email = data.get("email")
                password = data.get("password")

                cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
                user = cursor.fetchone()
                if user and bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
                    # For simplicity, return user info (in real apps, return JWT)
                    self.write({
                        "message": "Login successful",
                        "user": {
                            "id": user["id"],
                            "username": user["username"],
                            "email": user["email"],
                            "role": user["role"]
                        }
                    })
                else:
                    self.set_status(401)
                    self.write({"error": "Invalid credentials"})

            else:
                self.set_status(400)
                self.write({"error": "Invalid action"})

            cursor.close()
            conn.close()

        except Exception as e:
            self.set_status(400)
            self.write({"error": str(e)})