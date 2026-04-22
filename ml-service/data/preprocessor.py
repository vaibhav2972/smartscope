
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
        
        if not available_features:
            return None, None
        
        user_ids = df['userId'].values
        
        X = df[available_features].values
        
        X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
        
        X_normalized = self.scaler.fit_transform(X)
        
        return X_normalized, user_ids
    
    def prepare_for_classification(self, df, target_column):
        
        if df.empty or target_column not in df.columns:
            return None, None, None
        
        feature_columns = [
            'total_sessions',
            'avg_duration',
            'total_interactions',
            'bounce_rate',
            'conversion_rate',
            'days_since_last_session'
        ]
        
        available_features = [col for col in feature_columns if col in df.columns]
        
        if not available_features:
            return None, None, None
        
        user_ids = df['userId'].values
        X = df[available_features].values
        y = df[target_column].values
        
        X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
        
        X_normalized = self.scaler.fit_transform(X)
        
        return X_normalized, y, user_ids
    
    def clean_dataframe(self, df):
        
        df = df.copy()
        
        df = df.replace([np.inf, -np.inf], np.nan)
        
        df = df.fillna(0)
        
        return df