from flask import Flask, request, jsonify, json
from flask_cors import CORS
import supabase

app = Flask(__name__)
CORS(app)

# Replace with your Supabase project URL and API key
supabase_url = "https://ihfogxstivbgpxjxrxex.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZm9neHN0aXZiZ3B4anhyeGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzMzMwNzUsImV4cCI6MjAxNzkwOTA3NX0.7kgGD988sh__a9UHNAFL3UIpsBaPpsbXF9tvtbvUepU"
supabase_client = supabase.Client(supabase_url, supabase_key)

@app.route('/Login', methods=['POST'])
def login():
    try:
        # Replace 'your_table' with the actual table name
        table_name = "Users"

        # Access email and password from the request data
        request_data = request.get_json()
        username = request_data.get('username', '')
        password = request_data.get('password', '')

        # Perform a SELECT query to get all rows from the specified table
        response = supabase_client.table(table_name).select('username', 'password').execute()
        data = response['data', []]

        # Perform authentication logic here
        if any(entry['username'] == username and entry['password'] == password for entry in data):
            print("correct username or password")
            return jsonify({'success': True}), 200
        else:
            print("Incorrect username or password")
            return jsonify({'success': False, 'error': 'Incorrect username or password'}), 401

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)