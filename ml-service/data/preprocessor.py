import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

class DataPreprocessor:
    
    def __init__(self):
        self.scaler = StandardScaler()
        
    def prepare_for_clustering(self, df):
        if df.empty:
            return None, None
        
        feature_columns = [
            'total_sessions',
            'avg_duration',
            'total_interactions',
            'bounce_rate',
            'conversion_rate',
            'days_since_last_session'
        ]
        
        available_features = [col for col in feature_columns if col in df.columns]
        
        user_ids = df['userId'].values
        
        X = df[available_features].values
        
        X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
        
        X_normalized = self.scaler.fit_transform(X)
        
        return X_normalized, user_ids