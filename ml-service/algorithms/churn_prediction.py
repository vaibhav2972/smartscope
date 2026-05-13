import numpy as np
from sklearn.ensemble import RandomForestClassifier
from data.preprocessor import DataPreprocessor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)
from config import config

class ChurnPredictor:
    
    def __init__(self):
        self.model = None
        self.feature_importance = None
        self.feature_names = None
        
    def prepare_churn_data(self, df):

        df = df.copy()
        
        df['is_churned'] = (df['days_since_last_session'] > config.CHURN_DAYS_THRESHOLD).astype(int)
        
        return df
    
    def train(self, X, y, feature_names=None):

        self.feature_names = feature_names
        
    
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_leaf=5,
            random_state=42,
            class_weight='balanced',
            n_jobs=1
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
        df_with_churn = df_with_churn.sort_values(by='userId').reset_index(drop=True)
        
        preprocessor = DataPreprocessor()

        feature_columns = [
            'avg_duration',
            'total_interactions',
            'bounce_rate',
            'conversion_rate',
            'total_sessions',
        ]

        X, y, user_ids = preprocessor.prepare_for_classification(
            df_with_churn,
            'is_churned',
            feature_columns
        )
        
        if X is None:
            return {
                'success': False,
                'message': 'Not enough data for churn prediction'
            }
        
        feature_names = [
            'avg_duration',
            'total_interactions',
            'bounce_rate',
            'conversion_rate',
            'total_sessions',
        ]


        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=config.RANDOM_STATE,
            stratify=y
        )
        
        self.train(X_train, y_train, feature_names)

        # Evaluate on test set
        test_probs = self.predict(X_test)
        threshold = np.percentile(test_probs, 85)
        test_preds = (test_probs >= threshold).astype(int)

        evaluation = {
            'accuracy': round(float(accuracy_score(y_test, test_preds)), 3),
            'precision': round(float(precision_score(y_test, test_preds, zero_division=0)), 3),
            'recall': round(float(recall_score(y_test, test_preds, zero_division=0)), 3),
            'f1_score': round(float(f1_score(y_test, test_preds, zero_division=0)), 3),
            'roc_auc': round(float(roc_auc_score(y_test, test_probs)), 3)
        }

        # Predict for all users
        churn_probs = self.predict(X)
        
        results = []
        high_threshold = np.percentile(churn_probs, 80)
        medium_threshold = np.percentile(churn_probs, 50)

        for i, user_id in enumerate(user_ids):
            prob = churn_probs[i]

            user_data = df_with_churn[df_with_churn['userId'] == user_id].iloc[0]
            days_inactive = user_data['days_since_last_session']

            if prob >= high_threshold:
                risk_level = 'High'
                interpretation = f"High risk of leaving ({days_inactive} inactive days, {prob:.0%} churn probability)"
            elif prob >= medium_threshold:
                risk_level = 'Medium'
                interpretation = f"Some warning signs ({days_inactive} inactive days, monitor closely)"
            else:
                risk_level = 'Low'
                interpretation = "User appears stable (active engagement pattern)"

            results.append({
                'user_id': user_id,
                'churn_probability': round(float(prob), 3),
                'risk_level': risk_level,
                'interpretation': interpretation,
                'is_churned': bool(user_data['is_churned'])
            })
        
        results = sorted(results, key=lambda x: x['churn_probability'], reverse=True)
        
        return {
            'success': True,
            'total_users': len(results),
            'high_risk_count': sum(1 for r in results if r['risk_level'] == 'High'),
            'medium_risk_count': sum(1 for r in results if r['risk_level'] == 'Medium'),
            'low_risk_count': sum(1 for r in results if r['risk_level'] == 'Low'),
            'predictions': results,
            'evaluation': evaluation
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