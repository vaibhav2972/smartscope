
import pandas as pd
import numpy as np
from config import config

class EngagementScorer:
    
    def __init__(self):
        self.weights = config.ENGAGEMENT_WEIGHTS
    
    def calculate_score(self, user_data):
        df = user_data.copy()
        
        session_score = df['total_sessions'] * self.weights['sessions']
        
        interaction_score = df['total_interactions'] * self.weights['interactions']
        
        duration_score = df['total_duration'] * self.weights['duration']
        
        page_score = df.get('avg_pages', pd.Series([0] * len(df))) * self.weights['pages']
        
        conversion_score = df.get('conversion_count', pd.Series([0] * len(df))) * self.weights['conversions']
        
        bounce_penalty = (df['bounce_rate'] / 100) * self.weights['bounce_penalty']
        
        total_score = (
            session_score +
            interaction_score +
            duration_score +
            page_score +
            conversion_score +
            bounce_penalty
        )
        
        if total_score.max() > 0:
            normalized_score = (total_score / total_score.max()) * 100
        else:
            normalized_score = pd.Series([0] * len(df))
        
        normalized_score = normalized_score.clip(0, 100)
        
        results = pd.DataFrame({
            'userId': df['userId'],
            'engagement_score': normalized_score.round(2),
            'session_score': session_score.round(2),
            'interaction_score': interaction_score.round(2),
            'duration_score': duration_score.round(2),
            'conversion_score': conversion_score.round(2)
        })
        
        results['grade'] = results['engagement_score'].apply(self._assign_grade)
        
        results['rank'] = results['engagement_score'].rank(ascending=False, method='min').astype(int)
        
        results['percentile'] = results['engagement_score'].rank(pct=True) * 100
        results['percentile'] = results['percentile'].round(2)
        
        results = results.sort_values('engagement_score', ascending=False).reset_index(drop=True)
        
        return results
    
    def _assign_grade(self, score):
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def get_user_score(self, user_id, scores_df):
        
        user_score = scores_df[scores_df['userId'] == user_id]
        
        if user_score.empty:
            return {
                'success': False,
                'message': 'User not found'
            }
        
        user_score = user_score.iloc[0]
        
        return {
            'success': True,
            'user_id': user_id,
            'engagement_score': float(user_score['engagement_score']),
            'grade': user_score['grade'],
            'rank': int(user_score['rank']),
            'percentile': float(user_score['percentile']),
            'breakdown': {
                'session_score': float(user_score['session_score']),
                'interaction_score': float(user_score['interaction_score']),
                'duration_score': float(user_score['duration_score']),
                'conversion_score': float(user_score['conversion_score'])
            }
        }
    
    def get_leaderboard(self, scores_df, top_n=10):
        
        top_users = scores_df.head(top_n)
        
        leaderboard = []
        for _, user in top_users.iterrows():
            leaderboard.append({
                'user_id': user['userId'],
                'score': float(user['engagement_score']),
                'grade': user['grade'],
                'rank': int(user['rank']),
                'percentile': float(user['percentile'])
            })
        
        return leaderboard
    
    def get_score_distribution(self, scores_df):
        
        return {
            'total_users': len(scores_df),
            'average_score': float(scores_df['engagement_score'].mean().round(2)),
            'median_score': float(scores_df['engagement_score'].median().round(2)),
            'min_score': float(scores_df['engagement_score'].min().round(2)),
            'max_score': float(scores_df['engagement_score'].max().round(2)),
            'std_deviation': float(scores_df['engagement_score'].std().round(2)),
            'grade_distribution': scores_df['grade'].value_counts().to_dict()
        }


def calculate_engagement_scores(user_df):
    
    scorer = EngagementScorer()
    scores = scorer.calculate_score(user_df)
    return scores