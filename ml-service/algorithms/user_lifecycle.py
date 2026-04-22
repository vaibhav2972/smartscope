
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class UserLifecycleAnalyzer:
    
    def __init__(self):
        pass
    
    def analyze_lifecycle(self, df):
        
        if df.empty:
            return {
                'success': False,
                'message': 'No user data'
            }
        
        results = []
        
        for _, user in df.iterrows():
            stage = self._determine_stage(user)
            
            results.append({
                'user_id': user['userId'],
                'lifecycle_stage': stage['stage'],
                'days_since_signup': self._calculate_days_since_signup(user),
                'days_since_last_session': int(user.get('days_since_last_session', 0)),
                'total_sessions': int(user.get('total_sessions', 0)),
                'engagement_trend': stage['trend'],
                'recommended_action': stage['action']
            })
        
        stage_distribution = pd.DataFrame(results)['lifecycle_stage'].value_counts().to_dict()
        
        return {
            'success': True,
            'total_users': len(results),
            'stage_distribution': stage_distribution,
            'users': results
        }
    
    def _determine_stage(self, user):
        
        days_inactive = user.get('days_since_last_session', 0)
        total_sessions = user.get('total_sessions', 0)
        avg_duration = user.get('avg_duration', 0)
        
        if days_inactive > 30:
            return {
                'stage': 'Churned',
                'trend': 'Declined',
                'action': 'Win-back campaign with strong incentive'
            }
        
        elif days_inactive > 15:
            return {
                'stage': 'At Risk',
                'trend': 'Declining',
                'action': 'Re-engagement campaign, personalized offers'
            }
        
        elif total_sessions > 20 and avg_duration > 300:
            return {
                'stage': 'Power User',
                'trend': 'Growing',
                'action': 'VIP treatment, loyalty rewards, beta access'
            }
        
        elif total_sessions >= 5 and days_inactive <= 7:
            return {
                'stage': 'Active User',
                'trend': 'Stable',
                'action': 'Maintain engagement, upsell opportunities'
            }
        
        elif total_sessions < 3:
            return {
                'stage': 'New User',
                'trend': 'Onboarding',
                'action': 'Onboarding flow, feature education'
            }
        
        elif total_sessions >= 5 and days_inactive > 7:
            return {
                'stage': 'Declining User',
                'trend': 'Declining',
                'action': 'Identify pain points, provide support'
            }
        
        else:
            return {
                'stage': 'Casual User',
                'trend': 'Stable',
                'action': 'Encourage more frequent usage'
            }
    
    def _calculate_days_since_signup(self, user):
        
        if 'createdAt' in user and pd.notna(user['createdAt']):
            created_at = pd.to_datetime(user['createdAt'])
            days = (datetime.now() - created_at).days
            return max(0, days)
        return 0