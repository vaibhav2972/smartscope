
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from config import config

class ChurnPredictor:
    
    def __init__(self):
        self.model = None
        self.feature_importance = None
        self.feature_names = None
        
    def prepare_churn_data(self, df):

        df = df.copy()
        
        df['is_churned'] = (
            (df['days_since_last_session'] > config.CHURN_DAYS_THRESHOLD) &
            (df['total_sessions'] >= config.CHURN_MIN_SESSIONS)
        ).astype(int)
        
        return df
    
    def train(self, X, y, feature_names=None):

        self.feature_names = feature_names
        
    
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=config.RANDOM_STATE,
            class_weight='balanced' 
        )
        
        self.model.fit(X, y)
        
        self.feature_importance = self.model.feature_importances_
        
        train_accuracy = self.model.score(X, y)
        
        return {
            'success': True,
            'train_accuracy': round(train_accuracy, 3),
            'n_features': X.shape[1],
            'n_samples': X.shape[0]
        }
    
    def predict(self, X):
        
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
        
        probabilities = self.model.predict_proba(X)[:, 1]
        
        return probabilities
    
    def get_churn_risk(self, df):
        
        df_with_churn = self.prepare_churn_data(df)
        
        from data.preprocessor import DataPreprocessor
        preprocessor = DataPreprocessor()
        
        X, y, user_ids = preprocessor.prepare_for_classification(
            df_with_churn, 
            'is_churned'
        )
        
        if X is None:
            return {
                'success': False,
                'message': 'Not enough data for churn prediction'
            }
        
        feature_names = [
            'total_sessions',
            'avg_duration',
            'total_interactions',
            'bounce_rate',
            'conversion_rate',
            'days_since_last_session'
        ]
        
        self.train(X, y, feature_names)
        
        churn_probs = self.predict(X)
        
        results = []
        for i, user_id in enumerate(user_ids):
            prob = churn_probs[i]
            
            if prob > 0.7:
                risk_level = 'High'
            elif prob > 0.4:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
            
            user_data = df_with_churn[df_with_churn['userId'] == user_id].iloc[0]
            
            results.append({
                'user_id': user_id,
                'churn_probability': round(float(prob), 3),
                'risk_level': risk_level,
                'days_inactive': int(user_data['days_since_last_session']),
                'total_sessions': int(user_data['total_sessions']),
                'is_churned': bool(user_data['is_churned'])
            })
        
        results = sorted(results, key=lambda x: x['churn_probability'], reverse=True)
        
        return {
            'success': True,
            'total_users': len(results),
            'high_risk_count': sum(1 for r in results if r['risk_level'] == 'High'),
            'medium_risk_count': sum(1 for r in results if r['risk_level'] == 'Medium'),
            'low_risk_count': sum(1 for r in results if r['risk_level'] == 'Low'),
            'predictions': results
        }
    
    def get_feature_importance(self):
        
        if self.model is None or self.feature_importance is None:
            return []
        
        if self.feature_names is None:
            self.feature_names = [f'feature_{i}' for i in range(len(self.feature_importance))]
        
        importance_list = []
        for name, importance in zip(self.feature_names, self.feature_importance):
            importance_list.append({
                'feature': name,
                'importance': round(float(importance), 3)
            })
        
        importance_list = sorted(importance_list, key=lambda x: x['importance'], reverse=True)
        
        return importance_list