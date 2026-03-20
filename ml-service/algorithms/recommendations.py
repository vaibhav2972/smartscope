import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from config import config

class CollaborativeRecommender:
    
    def __init__(self):
        self.user_item_matrix = None
        self.user_similarity = None
        self.item_names = {}
    
    def create_user_item_matrix(self, interactions_df, entity_type='product'):

        filtered = interactions_df[
            interactions_df['entityData.entityType'] == entity_type
        ].copy()
        
        if filtered.empty:
            return None
        
        # Count interactions per user-item pair
        interaction_counts = filtered.groupby(
            ['userId', 'entityData.entityId']
        ).size().reset_index(name='count')
        
        # Create pivot table (user-item matrix)
        matrix = interaction_counts.pivot_table(
            index='userId',
            columns='entityData.entityId',
            values='count',
            fill_value=0
        )
        
        # Convert to binary (1 if interacted, 0 if not)
        matrix = (matrix > 0).astype(int)
        
        self.user_item_matrix = matrix
        
        # Store item names for reference
        item_names = filtered.groupby('entityData.entityId')[
            'entityData.entityName'
        ].first().to_dict()
        self.item_names = item_names
        
        return matrix
    
    def calculate_user_similarity(self):
    
        if self.user_item_matrix is None:
            raise ValueError("Create user-item matrix first")
        
        # Calculate cosine similarity between users
        similarity_matrix = cosine_similarity(self.user_item_matrix)
        
        # Convert to DataFrame
        self.user_similarity = pd.DataFrame(
            similarity_matrix,
            index=self.user_item_matrix.index,
            columns=self.user_item_matrix.index
        )
        
        return self.user_similarity
    
    def get_recommendations(self, user_id, top_n=5):
        
        if self.user_similarity is None:
            raise ValueError("Calculate user similarity first")
        
        
        if user_id not in self.user_similarity.index:
            return {
                'success': False,
                'message': 'User not found or has no interactions'
            }
        
    
        similar_users = self.user_similarity[user_id].sort_values(ascending=False)
        similar_users = similar_users[similar_users.index != user_id]
        

        top_similar_users = similar_users.head(config.TOP_N_SIMILAR_USERS)
        
        if len(top_similar_users) == 0:
            return {
                'success': False,
                'message': 'No similar users found'
            }
        
        # Get items the target user has already interacted with
        user_items = self.user_item_matrix.loc[user_id]
        interacted_items = user_items[user_items > 0].index.tolist()
        
        # Get items from similar users
        recommendations = {}
        
        for similar_user, similarity_score in top_similar_users.items():
            # Get items this similar user has interacted with
            similar_user_items = self.user_item_matrix.loc[similar_user]
            similar_user_items = similar_user_items[similar_user_items > 0].index.tolist()
            
            # Add items user hasn't seen yet
            for item in similar_user_items:
                if item not in interacted_items:
                    if item not in recommendations:
                        recommendations[item] = 0
                    # Weight by similarity score
                    recommendations[item] += similarity_score
        
        # Sort by score and get top N
        sorted_recommendations = sorted(
            recommendations.items(),
            key=lambda x: x[1],
            reverse=True
        )[:top_n]
        
        
        result_list = []
        for item_id, score in sorted_recommendations:
            result_list.append({
                'item_id': str(item_id),
                'item_name': self.item_names.get(item_id, 'Unknown'),
                'score': round(float(score), 3),
                'reason': f'Users similar to you liked this'
            })
        
        return {
            'success': True,
            'user_id': user_id,
            'recommendations': result_list,
            'based_on_users': len(top_similar_users)
        }
    
    def get_similar_users(self, user_id, top_n=5):
    
        if self.user_similarity is None:
            raise ValueError("Calculate user similarity first")
        
        if user_id not in self.user_similarity.index:
            return []
        
    
        similar = self.user_similarity[user_id].sort_values(ascending=False)
        similar = similar[similar.index != user_id].head(top_n)
        
        result = []
        for similar_user, score in similar.items():
            result.append({
                'user_id': similar_user,
                'similarity_score': round(float(score), 3)
            })
        
        return result



def get_recommendations(interactions_df, user_id, entity_type='product', top_n=5):

    recommender = CollaborativeRecommender()
    
    
    matrix = recommender.create_user_item_matrix(interactions_df, entity_type)
    
    if matrix is None or matrix.empty:
        return {
            'success': False,
            'message': 'Not enough interaction data'
        }
    
    recommender.calculate_user_similarity()
    
    recommendations = recommender.get_recommendations(user_id, top_n)
    
    return recommendations
