import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    
    
    MONGODB_URI = os.getenv('MONGODB_URI')
    DB_NAME = os.getenv('DB_NAME')
    
    
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    PORT = int(os.getenv('PORT', 5000))
    
    
    MIN_USERS_FOR_CLUSTERING = int(os.getenv('MIN_USERS_FOR_CLUSTERING', 10))
    N_CLUSTERS = int(os.getenv('N_CLUSTERS', 4))
    RANDOM_STATE = int(os.getenv('RANDOM_STATE', 42))
    
    
    MODEL_DIR = os.getenv('MODEL_DIR', './models')
    
    
    CLUSTER_LABELS = {
        0: "Power Users",
        1: "Active Users",
        2: "Casual Browsers",
        3: "Inactive Users"
    }
    
 
    ENGAGEMENT_WEIGHTS = {
        'sessions': 5,
        'interactions': 0.5,
        'unique_interactions': 2,
        'duration': 0.1,  
        'pages': 1,
        'conversions': 20,
        'bounce_penalty': -10
    }
    
   
    TOP_N_SIMILAR_USERS = 10
    TOP_N_RECOMMENDATIONS = 5

config = Config()