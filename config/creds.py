import firebase_admin
from firebase_admin import credentials, firestore
import os

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Path to your service account key file (relative to the script location)
cred_path = os.path.join(current_dir, 'firebase-adminsdk.json')

# Initialize the Firebase app
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Now you can interact with Firebase services
