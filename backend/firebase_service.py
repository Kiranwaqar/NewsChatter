import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from typing import Dict, Any

class FirebaseService:
    def __init__(self, cred_path='firebase_adminsdk.json'):
        # Initialize Firebase Admin SDK
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        self.db = firestore.client()
        self.collection = 'news_broadcasts'

    def save_broadcast(self, broadcast_data: Dict[str, Any]):
        """Save a new broadcast to Firebase with enhanced data"""
        # Add timestamp if not present
        if 'timestamp' not in broadcast_data:
            broadcast_data['timestamp'] = datetime.now().isoformat()
        
        # Add a new document with auto-generated ID
        doc_ref = self.db.collection(self.collection).add(broadcast_data)
        return doc_ref[1].id

    def get_latest_broadcast(self):
        """Get the most recent broadcast from Firebase"""
        broadcasts = self.db.collection(self.collection)\
            .order_by('timestamp', direction=firestore.Query.DESCENDING)\
            .limit(1)\
            .stream()
        
        for broadcast in broadcasts:
            return broadcast.to_dict()
        
        return None

    def cleanup_old_broadcasts(self, keep_count=5):
        """Remove old broadcasts, keeping only the specified number of recent ones"""
        broadcasts = self.db.collection(self.collection)\
            .order_by('timestamp', direction=firestore.Query.DESCENDING)\
            .stream()
        
        # Get all broadcast IDs
        broadcast_ids = [doc.id for doc in broadcasts]
        
        # Delete all but the most recent broadcasts
        for broadcast_id in broadcast_ids[keep_count:]:
            self.db.collection(self.collection).document(broadcast_id).delete() 