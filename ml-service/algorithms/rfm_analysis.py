
import pandas as pd
import numpy as np
from datetime import datetime

class RFMAnalyzer:
    
    def __init__(self):
        pass
    
    def calculate_rfm(self, df):

        df = df.copy()
        
        if 'days_since_last_session' not in df.columns:
            df['days_since_last_session'] = 0
        if 'total_sessions' not in df.columns:
            df['total_sessions'] = 0
        if 'conversion_count' not in df.columns:
            df['conversion_count'] = 0
        
        df['recency'] = df['days_since_last_session']  
        df['frequency'] = df['total_sessions']         
        df['monetary'] = df['conversion_count']        
        
        try:
            df['r_score'] = pd.qcut(df['recency'], q=5, labels=[5,4,3,2,1], duplicates='drop')
        except ValueError:
            df['r_score'] = self._simple_score(df['recency'], reverse=True)
        
        try:
            df['f_score'] = pd.qcut(df['frequency'], q=5, labels=[1,2,3,4,5], duplicates='drop')
        except ValueError:
            df['f_score'] = self._simple_score(df['frequency'], reverse=False)
        
        try:
            df['m_score'] = pd.qcut(df['monetary'], q=5, labels=[1,2,3,4,5], duplicates='drop')
        except ValueError:
            df['m_score'] = self._simple_score(df['monetary'], reverse=False)
        
        df['r_score'] = df['r_score'].astype(int)
        df['f_score'] = df['f_score'].astype(int)
        df['m_score'] = df['m_score'].astype(int)
        
        df['rfm_score'] = (
            df['r_score'].astype(str) + 
            df['f_score'].astype(str) + 
            df['m_score'].astype(str)
        )
        
        df['rfm_total'] = df['r_score'] + df['f_score'] + df['m_score']
        
        df['segment'] = df.apply(self._assign_segment, axis=1)
        
        result_df = df[[
            'userId', 
            'recency', 
            'frequency', 
            'monetary', 
            'r_score', 
            'f_score', 
            'm_score', 
            'rfm_score', 
            'rfm_total', 
            'segment'
        ]]
        
        return result_df
    
    def _simple_score(self, series, reverse=False):
        
        percentiles = series.rank(pct=True)
        
        if reverse:
            percentiles = 1 - percentiles
        
        scores = pd.cut(
            percentiles, 
            bins=5, 
            labels=[1, 2, 3, 4, 5],
            include_lowest=True
        )
        
        return scores.astype(int)
    
    def _assign_segment(self, row):
        
        r, f, m = row['r_score'], row['f_score'], row['m_score']
        
        if r >= 4 and f >= 4 and m >= 4:
            return "Champions"
        
        elif r >= 3 and f >= 3:
            return "Loyal Customers"
        
        elif r >= 4:
            return "Recent Customers"
        
        elif m >= 4:
            return "Big Spenders"
        
        elif r >= 3 and f >= 2:
            return "Potential Loyalists"
        
        elif r <= 2:
            return "At Risk"
        
        elif r <= 2 and f <= 2:
            return "Lost Customers"
        
        else:
            return "Other"
    
    def get_segment_summary(self, rfm_df):
        
        summary = rfm_df.groupby('segment').agg({
            'userId': 'count',
            'recency': 'mean',
            'frequency': 'mean',
            'monetary': 'mean',
            'rfm_total': 'mean'
        }).round(2)
        
        summary.columns = [
            'count', 
            'avg_recency', 
            'avg_frequency', 
            'avg_monetary',
            'avg_rfm_total'
        ]
        
        summary = summary.reset_index()
        summary = summary.sort_values('count', ascending=False)
        
        return summary.to_dict('records')
    
    def get_user_segment(self, user_id, rfm_df):
        
        user_data = rfm_df[rfm_df['userId'] == user_id]
        
        if user_data.empty:
            return {
                'success': False,
                'message': 'User not found'
            }
        
        user_data = user_data.iloc[0]
        
        return {
            'success': True,
            'user_id': user_id,
            'segment': user_data['segment'],
            'rfm_score': user_data['rfm_score'],
            'rfm_total': int(user_data['rfm_total']),
            'scores': {
                'recency': int(user_data['r_score']),
                'frequency': int(user_data['f_score']),
                'monetary': int(user_data['m_score'])
            },
            'values': {
                'days_since_last': int(user_data['recency']),
                'total_sessions': int(user_data['frequency']),
                'total_conversions': int(user_data['monetary'])
            }
        }