
from sklearn.cluster import KMeans
from config import config

class UserSegmentation:
    
    def __init__(self, n_clusters=4):

        self.n_clusters = n_clusters
        self.model = None
        self.cluster_centers = None
        
    def train(self, X, user_ids, df):
        
        self.model = KMeans(
            n_clusters=self.n_clusters,
            random_state=config.RANDOM_STATE,
            n_init=10,
            max_iter=300
        )
        
        cluster_labels = self.model.fit_predict(X)
        
        self.cluster_centers = self.model.cluster_centers_
        
        clusters = []
        for cluster_id in range(self.n_clusters):
            
            cluster_mask = (cluster_labels == cluster_id)
            cluster_users = user_ids[cluster_mask]
            cluster_data = df[df['userId'].isin(cluster_users)]
            
            
            cluster_info = {
                'cluster_id': int(cluster_id),
                'label': self._get_label(cluster_data),
                'size': len(cluster_data),
                'percentage': round((len(cluster_data) / len(df)) * 100, 2),
                'avg_sessions': round(cluster_data['total_sessions'].mean(), 2),
                'avg_interactions': round(cluster_data['total_interactions'].mean(), 2),
                'avg_duration': round(cluster_data['avg_duration'].mean(), 2),
                'avg_bounce_rate': round(cluster_data['bounce_rate'].mean(), 2),
                'avg_conversion_rate': round(cluster_data['conversion_rate'].mean(), 2),
                'sample_users': cluster_users[:5].tolist()
            }
            
            clusters.append(cluster_info)
        
        
        clusters = sorted(clusters, key=lambda x: x['avg_sessions'], reverse=True)
        
        return {
            'success': True,
            'total_users': len(df),
            'n_clusters': self.n_clusters,
            'clusters': clusters
        }
    
    def _get_label(self, cluster_data):
        
        avg_sessions = cluster_data['total_sessions'].mean()
        avg_interactions = cluster_data['total_interactions'].mean()
        avg_duration = cluster_data['avg_duration'].mean()
        bounce_rate = cluster_data['bounce_rate'].mean()
        
        
        if bounce_rate > 70 and avg_duration < 60:
            return "High Bounce Users"
        
        if avg_sessions > 10 and avg_interactions > 80:
            return "Power Users"
        
        if avg_sessions > 5 and avg_duration > 200:
            return "Active Users"
        
        if avg_sessions > 2:
            return "Casual Browsers"
        
        return "Inactive Users"
    
    def predict_cluster(self, X):
        
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
        
        return self.model.predict(X)
    
    def get_user_cluster(self, user_id, X, user_ids, df):
        
        if self.model is None:
            return {'success': False, 'message': 'Model not trained'}
        
        try:
            user_index = list(user_ids).index(user_id)
        except ValueError:
            return {'success': False, 'message': 'User not found'}
        
        
        user_features = X[user_index].reshape(1, -1)
        cluster_label = self.model.predict(user_features)[0]
        
        
        all_labels = self.model.predict(X)
        cluster_users = user_ids[all_labels == cluster_label]
        cluster_data = df[df['userId'].isin(cluster_users)]
        
        return {
            'success': True,
            'user_id': user_id,
            'cluster_id': int(cluster_label),
            'cluster_label': self._get_label(cluster_data),
            'cluster_size': len(cluster_data),
            'cluster_avg_sessions': round(cluster_data['total_sessions'].mean(), 2),
            'cluster_avg_interactions': round(cluster_data['total_interactions'].mean(), 2)
        }