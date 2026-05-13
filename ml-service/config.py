
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DB_NAME = os.getenv('DB_NAME', 'smartscope')
    
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    PORT = int(os.getenv('PORT', 5000))
    
    MIN_USERS_FOR_CLUSTERING = int(os.getenv('MIN_USERS_FOR_CLUSTERING', 4))
    N_CLUSTERS = int(os.getenv('N_CLUSTERS', 4))
    RANDOM_STATE = int(os.getenv('RANDOM_STATE', 42))
    CHURN_DAYS_THRESHOLD = int(os.getenv('CHURN_DAYS_THRESHOLD', 30))
    CHURN_MIN_SESSIONS = int(os.getenv('CHURN_MIN_SESSIONS', 2))
    
    ENGAGEMENT_WEIGHTS = {
        'sessions': 5,
        'interactions': 0.5,
        'duration': 0.1,
        'pages': 1,
        'conversions': 20,
        'bounce_penalty': -5
    }
    
    TOP_N_SIMILAR_USERS = 10
    TOP_N_RECOMMENDATIONS = 5

config = Config()