from flask import Flask, request, jsonify
from flask_cors import CORS

from data.data_loader import DataLoader
from data.preprocessor import DataPreprocessor
from algorithms.clustering import UserSegmentation
from algorithms.scoring import EngagementScorer
from algorithms.recommendations import CollaborativeRecommender

app = Flask(__name__)
CORS(app)

data_loader = DataLoader()


@app.route('/', methods=['GET'])
def home():
    """Health check"""
    return jsonify({
        'service': 'SmartScope ML Service',
        'status': 'running'
    })


@app.route('/api/ml/segment-users', methods=['POST'])
def segment_users():
    """Segment users"""
    try:
        
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty or len(user_df) < 4:
            return jsonify({
                'success': False,
                'message': 'Need at least 4 users with sessions'
            }), 400
        
        
        preprocessor = DataPreprocessor()
        X, user_ids = preprocessor.prepare_for_clustering(user_df)
        
        if X is None:
            return jsonify({
                'success': False,
                'message': 'Preprocessing failed'
            }), 400
        
        
        segmenter = UserSegmentation(n_clusters=4)
        results = segmenter.train(X, user_ids, user_df)
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ml/engagement-score', methods=['POST'])
def calculate_scores():
    """Calculate engagement scores"""
    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No user data'
            }), 400
        
        scorer = EngagementScorer()
        scores_df = scorer.calculate_score(user_df)
        leaderboard = scorer.get_leaderboard(scores_df, top_n=10)
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ml/recommend', methods=['POST'])
def get_recommendations():
    """Get recommendations"""
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({
                'success': False,
                'message': 'user_id required'
            }), 400
        
        user_id = data['user_id']
        entity_type = data.get('entity_type', 'product')
        
        
        interactions = data_loader.get_user_interactions()
        
        if not interactions:
            return jsonify({
                'success': False,
                'message': 'No interaction data'
            }), 400
        
        import pandas as pd
        interactions_df = pd.DataFrame(interactions)

        
        interactions_df['userId'] = interactions_df['userId'].astype(str)

        
        interactions_df['entityData.entityType'] = interactions_df['entityData'].apply(
            lambda x: x.get('entityType') if isinstance(x, dict) else None
        )
        
        interactions_df['entityData.entityId'] = interactions_df['entityData'].apply(
            lambda x: x.get('entityId') if isinstance(x, dict) else None
        )
        interactions_df['entityData.entityName'] = interactions_df['entityData'].apply(
            lambda x: x.get('entityName') if isinstance(x, dict) else None
        )
        
        
        recommender = CollaborativeRecommender()
        matrix = recommender.create_user_item_matrix(interactions_df, entity_type)
        
        if matrix is None or matrix.empty:
            return jsonify({
                'success': False,
                'message': 'Not enough data'
            }), 400
        
        recommender.calculate_user_similarity()
        result = recommender.get_recommendations(user_id, top_n=5)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("🚀 SmartScope ML Service")
    print("📍 Running on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)