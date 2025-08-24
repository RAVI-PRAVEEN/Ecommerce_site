import os
import tornado.ioloop
import tornado.web
import json
from decimal import Decimal
from db import get_connection

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "http://localhost:5173")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()

class MainHandler(BaseHandler):
    def get(self):
        self.write("Hello, Tornado with MySQL!")

class ProductsHandler(BaseHandler):
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
            category = self.get_body_argument("category")  # mandatory

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

    def delete(self):
        try:
            product_id = self.get_argument("id")
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
            conn.commit()
            cursor.close()
            conn.close()
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps({"message": f"Product {product_id} deleted"}))
        except Exception as e:
            self.set_status(400)
            self.write(json.dumps({"error": str(e)}))

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/api/products", ProductsHandler),
        (r"/uploads/(.*)", tornado.web.StaticFileHandler, {"path": UPLOAD_DIR}),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server running at http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
