# app.py
import os
import tornado.ioloop
import tornado.web
from handlers.order_handler import OrderHandler
from handlers.productshandler import ProductsHandler  # <- import here

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PUT")

    def options(self, *args, **kwargs):
        self.set_status(204)
        self.finish()

class MainHandler(BaseHandler):
    def get(self):
        self.write("Hello, Tornado with MySQL!")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/api/products", ProductsHandler),
        (r"/uploads/(.*)", tornado.web.StaticFileHandler, {"path": UPLOAD_DIR}),
        (r"/api/orders", OrderHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server running at http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
