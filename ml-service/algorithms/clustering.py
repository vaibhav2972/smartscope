import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from config import config

class UserSegmentation:
    
    def __init__(self, n_clusters=4):
        self.n_clusters = n_clusters
        self.model = None
        
    def train(self, X, user_ids, df):

        self.model = KMeans(
            n_clusters=self.n_clusters,
            random_state=config.RANDOM_STATE,
            n_init=10
        )
        
        cluster_labels = self.model.fit_predict(X)
        
        clusters = []
        for cluster_id in range(self.n_clusters):
            cluster_users = user_ids[cluster_labels == cluster_id]
            cluster_data = df[df['userId'].isin(cluster_users)]
            
            clusters.append({
                'cluster_id': int(cluster_id),
                'label': self._get_label(cluster_data),
                'size': len(cluster_data),
                'avg_sessions': round(cluster_data['total_sessions'].mean(), 2),
                'avg_interactions': round(cluster_data['total_interactions'].mean(), 2),
                'sample_users': cluster_users[:5].tolist()
            })
        
        return {
            'success': True,
            'total_users': len(df),
            'clusters': clusters
        }
    
    def _get_label(self, cluster_data):
        avg_sessions = cluster_data['total_sessions'].mean()
        
        if avg_sessions > 10:
            return "Power Users"
        elif avg_sessions > 5:
            return "Active Users"
        elif avg_sessions > 2:
            return "Casual Browsers"
        else:
            return "Inactive Users"