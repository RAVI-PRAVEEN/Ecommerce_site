import json
import tornado.web
from db import get_connection

class OrderHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()

    async def post(self):
        try:
            data = json.loads(self.request.body.decode("utf-8"))
            items = data.get("items", [])
            total_price = data.get("total_price", 0)

            if not items:
                self.set_status(400)
                self.write({"error": "Cart is empty"})
                return

            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            # Deduct stock
            for item in items:
                product_id = item.get("id")
                quantity = item.get("quantity", 1)

                cursor.execute("SELECT stock FROM products WHERE id=%s", (product_id,))
                product = cursor.fetchone()

                if not product:
                    conn.rollback()
                    cursor.close()
                    conn.close()
                    self.set_status(400)
                    self.write({"error": f"Product {product_id} not found"})
                    return

                if product["stock"] < quantity:
                    conn.rollback()
                    cursor.close()
                    conn.close()
                    self.set_status(400)
                    self.write({"error": f"Not enough stock for product {product_id}"})
                    return

                cursor.execute(
                    "UPDATE products SET stock = stock - %s WHERE id=%s",
                    (quantity, product_id),
                )

            # Insert order
            cursor.execute(
                "INSERT INTO orders (items, total_price) VALUES (%s, %s)",
                (json.dumps(items), total_price),
            )
            conn.commit()

            cursor.close()
            conn.close()

            self.set_status(201)
            self.write({"message": "Order placed successfully!"})

        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})

    async def get(self):
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
            rows = cursor.fetchall()

            cursor.close()
            conn.close()

            for row in rows:
                row["items"] = json.loads(row["items"])

            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(rows, default=str))

        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})
