
import pandas as pd
from datetime import datetime

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

        days_inactive = int(user.get('days_since_last_session', 0))
        total_sessions = int(user.get('total_sessions', 0))
        avg_duration = float(user.get('avg_duration', 0) or 0)

        # 1. CHURNED (hard cutoff)
        if days_inactive >= 45:
            return {
                'stage': 'Churned',
                'trend': 'Declined',
                'action': 'Win-back campaign with strong incentive'
            }

        # 2. POWER USER (protect high value users even if slightly inactive)
        if total_sessions >= 25 and avg_duration > 300 and days_inactive <= 30:
            return {
                'stage': 'Power User',
                'trend': 'Growing',
                'action': 'VIP treatment, loyalty rewards, beta access'
            }

        # 3. DECLINING USER (needs behavioral drop detection)
        if 10 <= total_sessions < 25 and 15 < days_inactive <= 40:
            return {
                'stage': 'Declining User',
                'trend': 'Declining',
                'action': 'Reactivation + feature highlights'
            }

        # 4. ACTIVE USER
        if total_sessions >= 5 and days_inactive <= 10:
            return {
                'stage': 'Active User',
                'trend': 'Stable',
                'action': 'Maintain engagement, upsell opportunities'
            }

        # 5. NEW USER
        if total_sessions < 5:
            return {
                'stage': 'New User',
                'trend': 'Onboarding',
                'action': 'Onboarding flow, feature education'
            }

        # 6. CASUAL USER
        if 5 <= total_sessions < 15 and days_inactive <= 30:
            return {
                'stage': 'Casual User',
                'trend': 'Stable',
                'action': 'Encourage more frequent usage'
            }

        # 7. ONLY NOW fallback to At Risk
        return {
            'stage': 'At Risk',
            'trend': 'Warning',
            'action': 'Re-engagement campaign, personalized offers'
        }

    def _calculate_days_since_signup(self, user):
        
        if 'createdAt' in user and pd.notna(user['createdAt']):
            created_at = pd.to_datetime(user['createdAt'])
            days = (datetime.now() - created_at).days
            return max(0, days)
        return 0