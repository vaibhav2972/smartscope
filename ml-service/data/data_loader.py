from pymongo import MongoClient
from datetime import datetime, timedelta
import pandas as pd
from config import config
from bson import ObjectId

class DataLoader:
    def __init__(self):
        self.client = MongoClient(config.MONGODB_URI)
        self.db = self.client[config.DB_NAME]
    
    @staticmethod
    def convert_objectid(data):
        if isinstance(data, ObjectId):
            return str(data)
        return data
        
    def get_all_users(self):
        users = list(self.db.users.find(
            {},
            {'_id': 1, 'username': 1, 'email': 1, 'role': 1, 'createdAt': 1, 'verified': 1}
        ))
        
        for user in users:
            if '_id' in user:
                user['_id'] = str(user['_id'])
        
        return users
    
    def get_user_sessions(self, user_id=None, days=None):
        
        query = {}
        
        if user_id:
            query['userId'] = user_id
            
        if days:
            start_date = datetime.now() - timedelta(days=days)
            query['sessionStart'] = {'$gte': start_date}
        
        sessions = list(self.db.sessions.find(query))
        
        for session in sessions:
            if '_id' in session:
                session['_id'] = str(session['_id'])
            if 'userId' in session:
                session['userId'] = str(session['userId'])
        
        return sessions
    
    def get_user_interactions(self, user_id=None, session_id=None):
        
        query = {}
        
        if user_id:
            query['userId'] = user_id
            
        if session_id:
            query['sessionId'] = session_id
        
        interactions = list(self.db.interactions.find(query))
        
        for interaction in interactions:
            if '_id' in interaction:
                interaction['_id'] = str(interaction['_id'])
            if 'userId' in interaction:
                interaction['userId'] = str(interaction['userId'])
            if 'sessionId' in interaction:
                interaction['sessionId'] = str(interaction['sessionId'])
        
        return interactions
    
    def get_user_behavior_data(self):
        
        pipeline = [
            {
                '$group': {
                    '_id': '$userId',
                    'total_sessions': {'$sum': 1},
                    'total_duration': {'$sum': '$duration'},
                    'avg_duration': {'$avg': '$duration'},
                    'total_interactions': {'$sum': '$totalInteractions'},
                    'total_clicks': {'$sum': '$totalClicks'},
                    'total_scrolls': {'$sum': '$totalScrolls'},
                    'avg_pages': {'$avg': '$pagesVisited'},
                    'bounce_count': {
                        '$sum': {'$cond': ['$bounceRate', 1, 0]}
                    },
                    'conversion_count': {
                        '$sum': {'$cond': ['$hasConversion', 1, 0]}
                    },
                    'last_session': {'$max': '$sessionStart'}
                }
            }
        ]
        
        result = list(self.db.sessions.aggregate(pipeline))
        
        if not result:
            return pd.DataFrame()
        
        df = pd.DataFrame(result)
        df.rename(columns={'_id': 'userId'}, inplace=True)
        
        df['userId'] = df['userId'].astype(str)
        
        df['bounce_rate'] = (df['bounce_count'] / df['total_sessions']) * 100
        df['conversion_rate'] = (df['conversion_count'] / df['total_sessions']) * 100
        
        df['days_since_last_session'] = (
            datetime.now() - pd.to_datetime(df['last_session'])
        ).dt.days
        
        df = df.fillna(0)
        
        return df
    
    def get_user_rfm_data(self):
        df = self.get_user_behavior_data()
        
        if df.empty:
            return pd.DataFrame()
        
        df['recency'] = df['days_since_last_session']  
        df['frequency'] = df['total_sessions']         
        df['monetary'] = df['conversion_count']        
        
        return df[['userId', 'recency', 'frequency', 'monetary']]
    
    def close(self):
        if self.client:
            self.client.close()



def load_user_data():
    loader = DataLoader()
    df = loader.get_user_behavior_data()
    loader.close()
    return df

def load_interactions():
    loader = DataLoader()
    interactions = loader.get_user_interactions()
    loader.close()
    return interactions