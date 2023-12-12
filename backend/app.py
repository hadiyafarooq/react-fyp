from flask import Flask, request, jsonify, json
from flask_cors import CORS
import supabase
from rdflib import Graph
import random
app = Flask(__name__)
CORS(app)

# Replace with your Supabase project URL and API key
supabase_url = "https://ihfogxstivbgpxjxrxex.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZm9neHN0aXZiZ3B4anhyeGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzMzMwNzUsImV4cCI6MjAxNzkwOTA3NX0.7kgGD988sh__a9UHNAFL3UIpsBaPpsbXF9tvtbvUepU"
supabase_client = supabase.Client(supabase_url, supabase_key)

def get_questions_from_ontology():
    # Load the ontology
    ontology_file = "newpython.n3"
    g = Graph()
    g.parse(ontology_file, format="n3")

    # Define a list of question templates
    question_templates = [
        "Describe {} of Python?",
        "Enlist {} in Python.",
        "Explain {} in Python.",
    ]

    def improve_question(question, predicate_name):
        # Remove underscores and convert to title case for readability
        readable_predicate = predicate_name.replace("_", " ").title()

        if "{}" in question:
            # Replace "{}" with the readable predicate
            question = question.format(readable_predicate)
        else:
            # If "{}" is not found in the question, append the readable predicate
            question = f"{question} {readable_predicate} in Python?"

        return question

    # Function to extract human-readable answers from URIs
    def extract_readable_answer(uri):
        # Convert the URI to a string and split by "/" to get the last part
        parts = uri.split("/")
        return parts[-1]

    # Dictionary to keep track of used answers for each predicate
    used_answers = {}
    questions = []

    # Generate questions and retrieve answers
    for predicate in g.predicates():
        predicate_name = predicate.split("/")[-1]

        # Randomly select a question template
        template = random.choice(question_templates)

        question = improve_question(template, predicate_name)

        # Check if there are unused answers for this predicate
        if predicate_name not in used_answers:
            # Create a SPARQL query to retrieve answers
            query = f"""
            SELECT ?answer
            WHERE {{
                <http://dbpedia.org/resource/Python> dbo:{predicate_name} ?answer.
            }}
            """

            # Execute the query
            answers = g.query(query)

            # Store the answers for this predicate
            used_answers[predicate_name] = [str(row[0]) for row in answers]

        # Check if there are unused answers for this predicate
        if used_answers[predicate_name]:
            # take an answer from the list
            answer_uri = used_answers[predicate_name].pop()
            answer = extract_readable_answer(answer_uri)

            # Append the question and answer to the list
            #questions.append({'question': question, 'answer': answer})
            questions.append({'question': question})

    return questions

@app.route('/Login', methods=['POST'])
def login():
    try:
        
        request_data = request.get_json()
        # Now request_data contains the JSON data sent in the request body
        # You can access username and password like this:
        username = request_data.get('username')
        password = request_data.get('password')

        # Your authentication logic goes here
        # Perform a SELECT query to get all rows from the specified table
        response = supabase_client.table('Users').select(
            'username', 'password').execute()
        response_data_str = response.json()
        response_data = json.loads(response_data_str)
        data = response_data.get('data', [])

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


@app.route('/Questions', methods=['POST'])
def get_questions():
    try:
        questions = get_questions_from_ontology()
        print(questions)
        return jsonify({'success': True, 'questions': questions}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
