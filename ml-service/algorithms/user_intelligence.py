
import pandas as pd
from .clustering import UserSegmentation
from .scoring import EngagementScorer
from .churn_prediction import ChurnPredictor
from .rfm_analysis import RFMAnalyzer
from .user_lifecycle import UserLifecycleAnalyzer
from data.preprocessor import DataPreprocessor

class UserIntelligenceEngine:

    def __init__(self):
        self.segmenter = UserSegmentation()
        self.scorer = EngagementScorer()
        self.churn_predictor = ChurnPredictor()
        self.rfm_analyzer = RFMAnalyzer()
        self.lifecycle_analyzer = UserLifecycleAnalyzer()
        
    def get_user_profile(self, user_id, df):
        
        user_data = df[df['userId'] == user_id]
        
        if user_data.empty:
            return {
                'success': False,
                'message': 'User not found'
            }
        
        user_data = user_data.iloc[0]
        
        segment_info = self._get_segment_info(user_id, df)
        engagement_info = self._get_engagement_info(user_id, df)
        churn_info = self._get_churn_info(user_id, df)
        rfm_info = self._get_rfm_info(user_id, df)
        lifecycle_info = self._get_lifecycle_info(user_id, df)
        
        profile = {
            'success': True,
            'user_id': user_id,
            
            'summary': self._generate_summary(
                lifecycle_info, engagement_info, churn_info
            ),
            
            'behavior': {
                'engagement_level': engagement_info.get('level', 'Unknown'),
                'activity_status': lifecycle_info.get('stage', 'Unknown'),
                'user_type': segment_info.get('label', 'Unknown'),
                'value_segment': rfm_info.get('segment', 'Unknown')
            },
            
            'metrics': {
                'total_sessions': int(user_data['total_sessions']),
                'days_since_last_visit': int(user_data['days_since_last_session']),
                'average_session_time': f"{int(user_data['avg_duration'])} seconds",
                'total_interactions': int(user_data['total_interactions'])
            },
            
            'insights': self._generate_insights(
                user_data, engagement_info, churn_info, lifecycle_info
            ),
            
            'risk': {
                'level': churn_info.get('risk_level', 'Unknown'),
                'churn_probability': churn_info.get('probability', 0),
                'status': self._get_risk_status(churn_info.get('probability', 0))
            },
            
            'recommendations': self._generate_recommendations(
                lifecycle_info, churn_info, engagement_info
            ),
            
            'model_details': {
                'segment': segment_info,
                'engagement': engagement_info,
                'churn': churn_info,
                'rfm': rfm_info,
                'lifecycle': lifecycle_info
            }
        }
        
        return profile
    
    def _get_segment_info(self, user_id, df):
        try:
            preprocessor = DataPreprocessor()
            X, user_ids = preprocessor.prepare_for_clustering(df)
            
            if X is None:
                return {'label': 'Unknown'}
            
            self.segmenter.train(X, user_ids, df)
            result = self.segmenter.get_user_cluster(user_id, X, user_ids, df)
            
            return {
                'label': result.get('cluster_label', 'Unknown'),
                'cluster_id': result.get('cluster_id', -1)
            }
        except:
            return {'label': 'Unknown'}
    
    def _get_engagement_info(self, user_id, df):
        """Get engagement score info"""
        try:
            scores_df = self.scorer.calculate_score(df)
            result = self.scorer.get_user_score(user_id, scores_df)
            
            if not result.get('success'):
                return {'level': 'Unknown', 'score': 0}
            
            score = result['engagement_score']
            
            if score >= 80:
                level = 'Very High'
            elif score >= 60:
                level = 'High'
            elif score >= 40:
                level = 'Medium'
            elif score >= 20:
                level = 'Low'
            else:
                level = 'Very Low'
            
            return {
                'level': level,
                'score': score,
                'grade': result.get('grade', 'F'),
                'rank': result.get('rank', 0)
            }
        except:
            return {'level': 'Unknown', 'score': 0}
    
    def _get_churn_info(self, user_id, df):
        try:
            result = self.churn_predictor.get_churn_risk(df)
            
            if not result.get('success'):
                return {'risk_level': 'Unknown', 'probability': 0}
            
            user_pred = next(
                (p for p in result['predictions'] if p['user_id'] == user_id),
                None
            )
            
            if not user_pred:
                return {'risk_level': 'Unknown', 'probability': 0}
            
            return {
                'risk_level': user_pred['risk_level'],
                'probability': user_pred['churn_probability'],
                'days_inactive': user_pred['days_inactive']
            }
        except:
            return {'risk_level': 'Unknown', 'probability': 0}
    
    def _get_rfm_info(self, user_id, df):
        try:
            rfm_df = self.rfm_analyzer.calculate_rfm(df)
            result = self.rfm_analyzer.get_user_segment(user_id, rfm_df)
            
            if not result.get('success'):
                return {'segment': 'Unknown'}
            
            return {
                'segment': result['segment'],
                'rfm_score': result['rfm_score']
            }
        except:
            return {'segment': 'Unknown'}
    
    def _get_lifecycle_info(self, user_id, df):
        try:
            result = self.lifecycle_analyzer.analyze_lifecycle(df)
            
            if not result.get('success'):
                return {'stage': 'Unknown'}
            
            user_lifecycle = next(
                (u for u in result['users'] if u['user_id'] == user_id),
                None
            )
            
            if not user_lifecycle:
                return {'stage': 'Unknown'}
            
            return {
                'stage': user_lifecycle['lifecycle_stage'],
                'trend': user_lifecycle['engagement_trend'],
                'action': user_lifecycle['recommended_action']
            }
        except:
            return {'stage': 'Unknown'}
    
    def _generate_summary(self, lifecycle, engagement, churn):
        stage = lifecycle.get('stage', 'User')
        eng_level = engagement.get('level', 'moderate')
        risk = churn.get('risk_level', 'Unknown')
        
        if risk == 'High':
            return f"{stage} with {eng_level.lower()} engagement, at high risk of leaving"
        elif risk == 'Medium':
            return f"{stage} with {eng_level.lower()} engagement, showing some warning signs"
        else:
            return f"{stage} with {eng_level.lower()} engagement, currently stable"
    
    def _generate_insights(self, user_data, engagement, churn, lifecycle):
        
        insights = []
        
        
        days_inactive = int(user_data['days_since_last_session'])
        if days_inactive > 15:
            insights.append(f"User has not visited in {days_inactive} days")
        elif days_inactive > 7:
            insights.append(f"User last active {days_inactive} days ago")
        else:
            insights.append("User recently active")
        
        
        eng_level = engagement.get('level', 'Unknown')
        if eng_level in ['Very High', 'High']:
            insights.append("Shows strong engagement with platform")
        elif eng_level == 'Medium':
            insights.append("Moderate engagement level")
        else:
            insights.append("Low engagement, needs attention")
        
        
        trend = lifecycle.get('trend', '')
        if trend == 'Declining':
            insights.append("Engagement is declining over time")
        elif trend == 'Growing':
            insights.append("Engagement is increasing")
        elif trend == 'Stable':
            insights.append("Consistent behavior pattern")
        
       
        total_sessions = int(user_data['total_sessions'])
        if total_sessions > 20:
            insights.append("Highly experienced user")
        elif total_sessions > 5:
            insights.append("Regular user of the platform")
        else:
            insights.append("Relatively new to the platform")
        
        return insights[:4]  
    
    def _get_risk_status(self, probability):
        if probability > 0.7:
            return "User likely to churn soon"
        elif probability > 0.4:
            return "Some risk of churn"
        else:
            return "User appears stable"
    
    def _generate_recommendations(self, lifecycle, churn, engagement):
        
        recommendations = []
        
        action = lifecycle.get('action', '')
        if action:
            recommendations.append(action)
        
        risk = churn.get('risk_level', '')
        if risk == 'High':
            recommendations.append("Send re-engagement campaign immediately")
            recommendations.append("Offer personalized incentive or discount")
        elif risk == 'Medium':
            recommendations.append("Monitor user activity closely")
            recommendations.append("Send personalized content recommendations")
        
        eng_level = engagement.get('level', '')
        if eng_level in ['Low', 'Very Low']:
            recommendations.append("Simplify user experience")
            recommendations.append("Provide onboarding or tutorial content")
        elif eng_level in ['Very High', 'High']:
            recommendations.append("Consider for VIP program or rewards")
            recommendations.append("Ask for feedback or testimonial")
        
        return recommendations[:3]  