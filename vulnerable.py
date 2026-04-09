import os
import sqlite3

def login(user, password):
    query = f"SELECT * FROM users WHERE user='{user}' AND pass='{password}'"
    return query

def run_command(cmd):
    os.system(cmd)

admin_password = 'secret123'
