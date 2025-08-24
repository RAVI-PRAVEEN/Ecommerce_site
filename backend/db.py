import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",         # change if your MySQL username is different
        password="Pravi@12",  # change to your MySQL password
        database="ecommerce"     # change to your DB name
    )
    return connection
