import os
import json
import tempfile
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

_app = None


def get_db():
    global _app
    if _app is None:
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        cred_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            _app = firebase_admin.initialize_app(cred, {"projectId": project_id})
        elif cred_json:
            # Load from env variable (for cloud deployment)
            service_info = json.loads(cred_json)
            cred = credentials.Certificate(service_info)
            _app = firebase_admin.initialize_app(cred, {"projectId": project_id})
        else:
            # Uses Application Default Credentials (gcloud auth)
            _app = firebase_admin.initialize_app(options={"projectId": project_id})

    return firestore.client()
