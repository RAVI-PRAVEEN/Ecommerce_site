def post(self, action):
    try:
        data = json.loads(self.request.body.decode("utf-8"))  # decode body first
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        if action == "signup":
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            # Optional: check if email already exists
            cursor.execute("SELECT id FROM users WHERE email=%s OR username=%s", (email, username))
            if cursor.fetchone():
                self.set_status(400)
                self.write({"error": "Email or username already exists"})
                return

            password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
            cursor.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                (username, email, password_hash)
            )
            conn.commit()
            self.write({"message": "User registered successfully"})

        elif action == "login":
            email = data.get("email")
            password = data.get("password")
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            user = cursor.fetchone()
            if user and bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
                self.write({"message": "Login successful", "user": {"id": user["id"], "username": user["username"], "email": user["email"]}})
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
