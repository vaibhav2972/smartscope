
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
        
        
        interaction_counts = filtered.groupby(
            ['userId', 'entityData.entityId']
        ).size().reset_index(name='count')
        
       
        matrix = interaction_counts.pivot_table(
            index='userId',
            columns='entityData.entityId',
            values='count',
            fill_value=0
        )
        
        matrix = np.log1p(matrix)
        
        self.user_item_matrix = matrix
        
        item_names = filtered.groupby('entityData.entityId')[
            'entityData.entityName'
        ].first().to_dict()
        self.item_names = item_names
        
        return matrix
    
    def calculate_user_similarity(self):
        
        if self.user_item_matrix is None:
            raise ValueError("Create user-item matrix first")
        
        
        similarity_matrix = cosine_similarity(self.user_item_matrix)
        
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
        
        user_items = self.user_item_matrix.loc[user_id]
        interacted_items = user_items[user_items > 0].index.tolist()
        
        recommendations = {}
        
        for similar_user, similarity_score in top_similar_users.items():
            similar_user_items = self.user_item_matrix.loc[similar_user]
            similar_user_items = similar_user_items[similar_user_items > 0].index.tolist()
            
            for item in similar_user_items:
                if item not in interacted_items:
                    if item not in recommendations:
                        recommendations[item] = 0
                    recommendations[item] += similarity_score
        
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
                'reason': 'Users similar to you liked this'
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


def generate_recommendations(
    interactions_df,
    user_id,
    entity_type='product',
    top_n=5,
    include_evaluation=False
):

    recommender = CollaborativeRecommender()

    matrix = recommender.create_user_item_matrix(
        interactions_df,
        entity_type
    )

    if matrix is None or matrix.empty:
        return {
            'success': False,
            'message': 'Not enough interaction data'
        }

    recommender.calculate_user_similarity()

    recommendations = recommender.get_recommendations(
        user_id,
        top_n
    )

    if include_evaluation:

        recommendations['evaluation'] = evaluate_recommender(
            interactions_df,
            entity_type,
            top_n
        )

    return recommendations


def evaluate_recommender(interactions_df, entity_type='product', top_n=5):

    hits = 0
    total = 0

    users = interactions_df['userId'].unique()

    for user_id in users:

        user_data = interactions_df[
            (interactions_df['userId'] == user_id) &
            (interactions_df['entityData.entityType'] == entity_type)
        ]

        # Need at least 2 interactions
        if len(user_data) < 2:
            continue

        # Hide last interaction
        test_row = user_data.iloc[-1]
        test_item = test_row['entityData.entityId']

        # Remaining interactions for training
        train_user_data = user_data.iloc[:-1]

        # Combine with all other users
        other_data = interactions_df[
            interactions_df['userId'] != user_id
        ]

        train_df = pd.concat([other_data, train_user_data])

        # Train recommender
        recommender = CollaborativeRecommender()

        matrix = recommender.create_user_item_matrix(
            train_df,
            entity_type
        )

        if matrix is None or user_id not in matrix.index:
            continue

        recommender.calculate_user_similarity()

        recs = recommender.get_recommendations(
            user_id,
            top_n
        )

        if recs['success']:

            recommended_items = [
                r['item_id']
                for r in recs['recommendations']
            ]

            # Check if hidden item was recommended
            if str(test_item) in recommended_items:
                hits += 1

            total += 1

    hit_rate = hits / total if total > 0 else 0

    return {
        'success': True,
        'users_evaluated': total,
        'hits': hits,
        'hit_rate': round(hit_rate, 4)
    }