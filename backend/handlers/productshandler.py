# productshandler.py
import os
import json
from decimal import Decimal
import tornado.web
from db import get_connection

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ProductsHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PUT")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()

    def get(self):
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products ORDER BY category, id")
        products = cursor.fetchall()
        cursor.close()
        conn.close()

        def default_serializer(obj):
            if isinstance(obj, Decimal):
                return float(obj)
            return str(obj)

        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(products, default=default_serializer))

    def post(self):
        try:
            name = self.get_body_argument("name")
            description = self.get_body_argument("description", None)
            price = self.get_body_argument("price")
            stock = self.get_body_argument("stock")
            category = self.get_body_argument("category")

            image_url = None
            if "image" in self.request.files:
                fileinfo = self.request.files["image"][0]
                filename = fileinfo["filename"]
                filepath = os.path.join(UPLOAD_DIR, filename)
                with open(filepath, "wb") as f:
                    f.write(fileinfo["body"])
                image_url = f"uploads/{filename}"

            if not category:
                raise ValueError("Category is required")

            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO products (name, description, price, stock, image_url, category) VALUES (%s, %s, %s, %s, %s, %s)",
                (name, description, price, stock, image_url, category)
            )
            conn.commit()
            product_id = cursor.lastrowid
            cursor.close()
            conn.close()

            self.set_header("Content-Type", "application/json")
            self.write(json.dumps({"message": "Product added", "id": product_id}))

        except Exception as e:
            self.set_status(400)
            self.write(json.dumps({"error": str(e)}))