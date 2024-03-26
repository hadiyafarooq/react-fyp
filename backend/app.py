from flask import Flask, request, jsonify, json
from flask_cors import CORS
import supabase
from rdflib import Graph, Namespace
from rdflib import Graph
import random
import subprocess
import os
import joblib
import numpy as np
import VideoFE # THIS IS THE PY FILE FOR VIDEO ANALYSIS FUCNTIONALITY

from rdflib.plugins.parsers.notation3 import BadSyntax
from difflib import SequenceMatcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity



app = Flask(__name__)
CORS(app)

# Replace with your Supabase project URL and API key
supabase_url = "https://ihfogxstivbgpxjxrxex.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZm9neHN0aXZiZ3B4anhyeGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzMzMwNzUsImV4cCI6MjAxNzkwOTA3NX0.7kgGD988sh__a9UHNAFL3UIpsBaPpsbXF9tvtbvUepU"
supabase_client = supabase.Client(supabase_url, supabase_key)
ns1 = Namespace("http://programminglanguages.org/ontology#")
g = Graph()
g.parse("datatype.rdf", format="xml")

user_language = "C"
start_node = ns1[user_language]
wrong_answer = 0

def get_child_nodes(language_node):
    children = []
    for child_node in g.objects(language_node, ns1.hasChild):
        children.append(child_node)
    return children

def get_sibling_nodes(current_node):
    parent_node = get_parent_node(current_node)
    if parent_node:
        sibling_nodes = [child for child in g.objects(parent_node, ns1.hasChild) if child != current_node]
        return sibling_nodes
    else:
        return []

def get_parent_node(node):
    for s, p, o in g.triples((None, ns1.hasChild, node)):
        return s
    return None

def get_mutability_and_description(node):
    mutability = list(g.objects(node, ns1.hasMutability))
    description = list(g.objects(node, ns1.hasDescription))
    return mutability, description


def calculate_similarity(str1, str2):
    # Extract keywords from both strings
    keywords1 = extract_keywords(str1)
    keywords2 = extract_keywords(str2)

    # Calculate the number of common keywords
    common_keywords = set(keywords1) & set(keywords2)
    num_common_keywords = len(common_keywords)

    # Calculate similarity based on the presence of common keywords
    similarity = num_common_keywords / max(len(keywords1), len(keywords2))

    return similarity

def extract_keywords(text):
    #TF-IDF for keyword extraction
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()

    # Sort feature names by TF-IDF score
    sorted_indices = tfidf_matrix.toarray().argsort()[:, ::-1]
    keywords = [feature_names[idx] for idx in sorted_indices[0][:5]]  # Extract top 5 keywords

    return keywords

visited_nodes = set()
overall_similarity_scores = []

def generate_questions(language_node):
    questions = []
    mutability, description = get_mutability_and_description(language_node)
    if mutability and description:
        description_question = {"question": f"Can you describe {language_node.split('#')[-1]}?"}
        questions.extend([description_question])
    return questions

def ask_question(question):
    print(question['question'])
    return input("Your answer: ")




def traverse(language_node):
    child_nodes = get_child_nodes(language_node)

    if not child_nodes:
        mutability, description = get_mutability_and_description(language_node)

        if mutability or description:
            questions = generate_questions(language_node)
            for question in questions:
                answer = ask_question(question)
                description_similarity = calculate_similarity(answer, description[0])
                print(f"Description similarity: {description_similarity}")

                if description_similarity < 0.6:
                    print("Similarity index is less than 0.6. Asking questions from different nodes.")
                    wrong_answer += 1
                    
                    if wrong_answer >= 3:
                        print("Consecutive wrong answers limit reached. Moving to the next branch.")
                        traverse(start_node)
                        overall_similarity_score = (description_similarity) / 2
                        overall_similarity_scores.append(overall_similarity_score)
                        return True
                else:
                    print("Similarity index is greater than or equal to 0.6. Backtracking to programming language node.")
                    traverse(start_node)
                    overall_similarity_score = description_similarity / 2
                    overall_similarity_scores.append(overall_similarity_score)
                    return True

    else:
        all_child_nodes_visited = True
        for child_node in child_nodes:
            if child_node not in visited_nodes:
                visited_nodes.add(child_node)
                all_child_nodes_visited = False
                if traverse(child_node):
                    return True

        if all_child_nodes_visited:
            print("All child nodes of the programming language node have been visited.")
            return True




def get_questions_from_ontology_python():
    # Load the ontology
    ontology_file = "newpython.n3"
    g = Graph()

    g.parse(ontology_file, format="n3")
    

    # Define a list of question templates
    question_templates_python = [
        "Describe {} of Python?",
        "Enlist {} in Python.",
        "Explain {} in Python.",
    ]

    def improve_question_python(question, predicate_name):
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
    def extract_readable_answer_python(uri):
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
        template = random.choice(question_templates_python)

        question = improve_question_python(template, predicate_name)

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
            answer = extract_readable_answer_python(answer_uri)

            questions.append({'question': question})

    return questions

def get_questions_from_ontology_C():

    # Load the ontology
    ontology_file2 = "cpm.n3"
    g2 = Graph()

    try:
        g2.parse(ontology_file2, format="n3")
    except BadSyntax as e:
        print(f"An error occurred while parsing the N3 file: {e}")

    # Define a list of question templates
    question_templates = [
        "Describe {} of C++?",
        "Enlist {} in C++.",
        "Explain {} in C++.",
    ]

    # Function to apply NLP techniques to make questions more coherent
    def improve_question(question, predicate_name):
        # Remove underscores and convert to title case for readability
        readable_predicate = predicate_name.replace("_", " ").title()

        # Apply NLP techniques to improve question formatting
        if "{}" in question:
            # Replace "{}" with the readable predicate
            question = question.format(readable_predicate)
        else:
            # If "{}" is not found in the question, append the readable predicate
            question = f"{question} {readable_predicate} in C++?"

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
    for predicate in g2.predicates():
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
                <http://dbpedia.org/resource/CPlusPlus> dbo:{predicate_name} ?answer.
            }}
            """

            # Execute the query
            answers = g2.query(query)

            # Store the answers for this predicate
            used_answers[predicate_name] = [str(row[0]) for row in answers]

        # Check if there are unused answers for this predicate
        if used_answers[predicate_name]:

            answer_uri = used_answers[predicate_name].pop()
            answer = extract_readable_answer(answer_uri)
            questions.append({'question': question})
    return questions

def get_questions_from_ontology_Java():


    # Load the ontology
    ontology_file3 = "java1.n3"
    g3 = Graph()

    try:
        g3.parse(ontology_file3, format="n3")
    except BadSyntax as e:
        print(f"An error occurred while parsing the N3 file: {e}")

    # Define a list of question templates
    question_templates = [
        "Describe {} of Java?",
        "Enlist {} in Java.",
        "Explain {} in Java.",
    ]
    def improve_question(question, predicate_name):

        readable_predicate = predicate_name.replace("_", " ").title()


        if "{}" in question:

            question = question.format(readable_predicate)
        else:

            question = f"{question} {readable_predicate} in Java?"

        return question


    def extract_readable_answer(uri):

        parts = uri.split("/")
        return parts[-1]

    # Dictionary to keep track of used answers for each predicate
    used_answers = {}
    questions = []
    # Generate questions and retrieve answers
    for predicate in g3.predicates():
        predicate_name = predicate.split("/")[-1]

        template = random.choice(question_templates)

        question = improve_question(template, predicate_name)


        # Check if there are unused answers for this predicate
        if predicate_name not in used_answers:
            # Create a SPARQL query to retrieve answers
            query = f"""
            SELECT ?answer
            WHERE {{
                <http://dbpedia.org/resource/Java> dbo:{predicate_name} ?answer.
            }}
            """

            # Execute the query
            answers = g3.query(query)

            # Store the answers for this predicate
            used_answers[predicate_name] = [str(row[0]) for row in answers]

        # Check if there are unused answers for this predicate
        if used_answers[predicate_name]:

            answer_uri = used_answers[predicate_name].pop()
            answer = extract_readable_answer(answer_uri)
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
            'username', 'password','role').execute()
        response_data_str = response.json()
        response_data = json.loads(response_data_str)
        data = response_data.get('data', [])


        matched_user = next(
        (entry for entry in data if entry['username'] == username and entry['password'] == password), None)

        if matched_user:
            role = matched_user.get('role', None)
            print("Correct username or password. Role:", role)
        # Return the role in the response
            return jsonify({'success': True, 'role': role}), 200
        else:
            print("Incorrect username or password")
            return jsonify({'success': False, 'error': 'Incorrect username or password'}), 401

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# @app.route('/Questions', methods=['POST'])
# def get_questions():
#     try:
#         questions_python = get_questions_from_ontology_python()
#         questions_c = get_questions_from_ontology_C()
#         questions_java = get_questions_from_ontology_Java()
#         questions_python.extend(questions_c)
#         questions_python.extend(questions_java)
#         print(questions_python)
#         return jsonify({'success': True, 'questions': questions_python}), 200

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/Questions', methods=['POST'])
def get_questions():
    try:
        
        user_language = "C"
        start_node = ns1[user_language]

        traverse(start_node)
        questions = generate_questions(start_node)

        return jsonify({'success': True, 'questions': questions}), 200


    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/InterviewData', methods=['GET'])
def interviewdata():
    try:
        response = supabase_client \
    .table('Users') \
    .select('Users.FullName', 'Users.email', 'interviews.status') \
    .eq('Users.uid', 'interviews.uid') \
    .execute()

        response_data_str = response.json()
        response_data = json.loads(response_data_str)
        data = response_data.get('data', [])
        print(data)
        return jsonify({'success': True, 'interviewdata': data}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
    

@app.route('/upload', methods=['POST'])
def upload_video():
    # Check if the POST request has a file part
    print("request.files",request.files)
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']
    print("video_file : ",video_file)

    # Check if the file is not empty
    if video_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded video to the server
    upload_folder = 'uploads'
    os.makedirs(upload_folder, exist_ok=True)
    video_path = os.path.join(upload_folder, video_file.filename)
    print("video_path : ",video_path)

    video_file.save(video_path)
    

    # Construct the command to run
    cmd = f'OpenFacee\FeatureExtraction.exe -f "{video_path}" -2Dfp -aus'
    # print("cmd : ", cmd)

    try:
        # Execute the command
        # result = subprocess.run(cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        result = subprocess.run(cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        video_FE()
        return jsonify({'message': 'Command executed successfully', 'output': result.stdout}), 200
    except subprocess.CalledProcessError as e:
        # Handle errors in command execution
        return jsonify({'error': 'Failed to execute command', 'details': e.stderr}), 500
    




# THIS IS THE FUNCTION THAT PERFORMS VIDEO ANALYSIS CLEANING

def video_FE():
    Vmodel = joblib.load('video_analysis.joblib')
    Input = VideoFE.take_avg(VideoFE.clean_data(VideoFE.load_data()))
    print("input values for prediction : ", Input)

    #Feature engineering of the file I have uploaded.
    # input = np.array([[ 0.047550,  0.169749,  0.063835,  0.094563,  0.295091 , 0.374149 , 0.083074]])

    y_pred = Vmodel.predict(Input)
    output = ["Engaged"	,"EyeContact" ,"Smiled", "Friendly", "NotStressed",	"Focused",	"Authentic", "NotAwkward"]
    print("Output : ", output)
    print("Predicted value : ", y_pred)


    

        


if __name__ == "__main__":
    app.run(port=5001, debug=True)
