from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

from config import config
from data.data_loader import DataLoader
from data.preprocessor import DataPreprocessor
from algorithms.clustering import UserSegmentation
from algorithms.scoring import EngagementScorer
from algorithms.recommendations import CollaborativeRecommender, generate_recommendations
from algorithms.churn_prediction import ChurnPredictor
from algorithms.rfm_analysis import RFMAnalyzer
from algorithms.user_lifecycle import UserLifecycleAnalyzer
from algorithms.user_intelligence import UserIntelligenceEngine
from algorithms.behavior_importance import analyze_user_behavior_importance
from algorithms.feature_attribution import analyze_feature_attribution
from algorithms.website_intelligence import analyze_website_intelligence


app = Flask(__name__)
CORS(app)


data_loader = DataLoader()


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'service': 'SmartScope ML Service',
        'status': 'running',
        'version': '2.0.0',
        'description': 'User Behavior Intelligence System',
        'algorithms': [
            'User Segmentation',
            'Engagement Scoring',
            'Personalized Recommendations',
            'Churn Risk Prediction',
            'RFM Analysis',
            'Lifecycle Stage Detection',
            'Unified Intelligence Profile'
        ]
    }), 200



@app.route('/api/ml/user-intelligence/<user_id>', methods=['GET'])
def get_user_intelligence(user_id):
    try:
        
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No user data available'
            }), 400
        
        
        engine = UserIntelligenceEngine()
        profile = engine.get_user_profile(user_id, user_df)
        
        return jsonify(profile), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ml/segment-users', methods=['POST'])
def segment_users():
    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty or len(user_df) < config.MIN_USERS_FOR_CLUSTERING:
            return jsonify({
                'success': False,
                'message': f'Need at least {config.MIN_USERS_FOR_CLUSTERING} users'
            }), 400
        

        preprocessor = DataPreprocessor()
        X, user_ids = preprocessor.prepare_for_clustering(user_df)
        
        if X is None:
            return jsonify({
                'success': False,
                'message': 'Data preprocessing failed'
            }), 400
        
        segmenter = UserSegmentation(n_clusters=config.N_CLUSTERS)
        results = segmenter.train(X, user_ids, user_df)
        

        for cluster in results.get('clusters', []):
            cluster['interpretation'] = _interpret_cluster(cluster)
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _interpret_cluster(cluster):
    
    label = cluster.get('label', 'Unknown')
    size = cluster.get('size', 0)
    avg_sessions = cluster.get('avg_sessions', 0)
    
    if label == "Power Users":
        return f"Most engaged users ({size} users) with {avg_sessions:.1f} avg sessions"
    elif label == "Active Users":
        return f"Regular users ({size} users) actively using platform"
    elif label == "Casual Browsers":
        return f"Occasional users ({size} users) with light engagement"
    else:
        return f"Inactive users ({size} users) needing re-engagement"


@app.route('/api/ml/user-segment/<user_id>', methods=['GET'])
def get_user_segment(user_id):

    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No data available'
            }), 400
        
        preprocessor = DataPreprocessor()
        X, user_ids = preprocessor.prepare_for_clustering(user_df)
        
        if X is None:
            return jsonify({
                'success': False,
                'message': 'Preprocessing failed'
            }), 400
        
       
        segmenter = UserSegmentation(n_clusters=config.N_CLUSTERS)
        segmenter.train(X, user_ids, user_df)
        result = segmenter.get_user_cluster(user_id, X, user_ids, user_df)
        
        if result.get('success'):
            label = result.get('cluster_label', 'Unknown')
            result['interpretation'] = _interpret_user_segment(label)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _interpret_user_segment(label):
    interpretations = {
        "Power Users": "Highly engaged user with strong platform usage",
        "Active Users": "Regular user who frequently engages",
        "Casual Browsers": "Occasional user with light engagement",
        "Inactive Users": "User needs re-engagement efforts"
    }
    return interpretations.get(label, "User behavior pattern identified")



@app.route('/api/ml/engagement-score', methods=['POST'])
def calculate_engagement_scores():
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

        for user in leaderboard:
            user['level'] = _score_to_level(user['score'])
            user['interpretation'] = _interpret_engagement(user['score'])

        distribution = scorer.get_score_distribution(scores_df)
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard,
            'distribution': distribution
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _score_to_level(score):
    if score >= 80:
        return 'Very High'
    elif score >= 60:
        return 'High'
    elif score >= 40:
        return 'Medium'
    elif score >= 20:
        return 'Low'
    else:
        return 'Very Low'

def _interpret_engagement(score):
    if score >= 80:
        return "Highly engaged user, strong platform advocate"
    elif score >= 60:
        return "Good engagement, regular active user"
    elif score >= 40:
        return "Moderate engagement, room for improvement"
    elif score >= 20:
        return "Low engagement, needs attention"
    else:
        return "Very low engagement, at risk of leaving"


@app.route('/api/ml/engagement-score/<user_id>', methods=['GET'])
def get_user_engagement_score(user_id):

    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No user data'
            }), 400
        
        scorer = EngagementScorer()
        scores_df = scorer.calculate_score(user_df)
        result = scorer.get_user_score(user_id, scores_df)
        
        if result.get('success'):
            score = result['engagement_score']
            result['level'] = _score_to_level(score)
            result['interpretation'] = _interpret_engagement(score)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500



@app.route('/api/ml/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({
                'success': False,
                'message': 'user_id required'
            }), 400
        
        user_id = data['user_id']
        entity_type = data.get('entity_type', 'product')
        top_n = data.get('top_n', 5)
        
        
        interactions = data_loader.get_user_interactions()
        
        if not interactions:
            return jsonify({
                'success': False,
                'message': 'No interaction data available'
            }), 400
        
        
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
        
        result = generate_recommendations(interactions_df, user_id, entity_type=entity_type, top_n=top_n, include_evaluation=True)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ml/similar-users/<user_id>', methods=['GET'])
def get_similar_users(user_id):

    try:
        top_n = int(request.args.get('top_n', 5))
        entity_type = request.args.get('entity_type', 'product')
        
        interactions = data_loader.get_user_interactions()
        
        if not interactions:
            return jsonify({
                'success': False,
                'message': 'No interaction data'
            }), 400
        
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
        similar_users = recommender.get_similar_users(user_id, top_n=top_n)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'similar_users': similar_users,
            'interpretation': f"Found {len(similar_users)} users with similar behavior patterns"
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ml/churn-risk', methods=['POST'])
def predict_churn():

    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty or len(user_df) < 5:
            return jsonify({
                'success': False,
                'message': 'Need at least 5 users for churn prediction'
            }), 400
        
        predictor = ChurnPredictor()
        results = predictor.get_churn_risk(user_df)
        
        # if results.get('success'):
        #     for pred in results.get('predictions', []):
        #         pred['interpretation'] = _interpret_churn(pred)
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _interpret_churn(prediction):
    risk = prediction.get('risk_level', 'Unknown')
    days = prediction.get('days_inactive', 0)
    prob = prediction.get('churn_probability', 0)
    
    if risk == 'High':
        return f"High risk of leaving (inactive {days} days, {prob*100:.0f}% churn probability)"
    elif risk == 'Medium':
        return f"Some warning signs (inactive {days} days, monitor closely)"
    else:
        return f"User appears stable (active engagement pattern)"


@app.route('/api/ml/rfm-analysis', methods=['POST'])
def rfm_analysis():
    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No user data'
            }), 400
        
        analyzer = RFMAnalyzer()
        rfm_df = analyzer.calculate_rfm(user_df)
        
        summary = analyzer.get_segment_summary(rfm_df)
        
        for seg in summary:
            seg['interpretation'] = _interpret_rfm_segment(seg['segment'])
        
        rfm_list = rfm_df.to_dict('records')
        
        return jsonify({
            'success': True,
            'total_users': len(rfm_df),
            'segment_summary': summary,
            'users': rfm_list[:20]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _interpret_rfm_segment(segment):
    interpretations = {
        "Champions": "Best customers - highly engaged and valuable",
        "Loyal Customers": "Regular buyers with consistent engagement",
        "Recent Customers": "New or returning customers, recently active",
        "At Risk": "Previously active users showing decline",
        "Lost Customers": "Inactive users needing win-back campaigns",
        "Big Spenders": "High-value users worth special attention",
        "Potential Loyalists": "Growing customers with potential"
    }
    return interpretations.get(segment, "Customer segment identified")


@app.route('/api/ml/rfm-analysis/<user_id>', methods=['GET'])
def get_user_rfm(user_id):

    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No user data'
            }), 400
        
        analyzer = RFMAnalyzer()
        rfm_df = analyzer.calculate_rfm(user_df)
        result = analyzer.get_user_segment(user_id, rfm_df)
        
        if result.get('success'):
            segment = result.get('segment', 'Unknown')
            result['interpretation'] = _interpret_rfm_segment(segment)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ml/user-lifecycle', methods=['POST'])
def analyze_lifecycle():

    try:
        user_df = data_loader.get_user_behavior_data()
        
        if user_df.empty:
            return jsonify({
                'success': False,
                'message': 'No user data'
            }), 400
        
        analyzer = UserLifecycleAnalyzer()
        results = analyzer.analyze_lifecycle(user_df)
        
        if results.get('success'):
            for user in results.get('users', []):
                user['interpretation'] = _interpret_lifecycle(user)
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _interpret_lifecycle(user):
    stage = user.get('lifecycle_stage', 'Unknown')
    trend = user.get('engagement_trend', '')
    
    interpretations = {
        "New User": "Just started, needs onboarding and guidance",
        "Active User": "Regular user with stable engagement",
        "Power User": "Highly valuable, engaged advocate",
        "Declining User": "Engagement dropping, needs intervention",
        "At Risk": "Likely to leave soon without action",
        "Churned": "Inactive, needs strong win-back campaign"
    }
    
    base = interpretations.get(stage, "User stage identified")
    if trend:
        base += f" ({trend.lower()})"
    
    return base

@app.route('/behavior-importance', methods=['POST'])
def behavior_importance():
    data = request.get_json()

    result = analyze_user_behavior_importance(
        data.get("user_id"),
        data.get("user_data"),
        data.get("all_users_data")
    )

    return jsonify(result), 200

@app.route('/feature-attribution', methods=['POST'])
def feature_attribution():
    try:
        data = request.get_json()

        interactions = data.get("feature_interactions", [])
        sessions = data.get("user_sessions", [])

        result = analyze_feature_attribution(interactions, sessions)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@app.route('/website-intelligence', methods=['POST'])
def website_intelligence():
    try:
        data = request.get_json()

        websites_data = data.get("websites_data", [])

        if not websites_data:
            return jsonify({
                "success": False,
                "message": "No website data provided"
            }), 400

        result = analyze_website_intelligence(websites_data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500



if __name__ == '__main__':
    print("=" * 60)
    print("🚀 SmartScope ML Service Starting...")
    print("   User Behavior Intelligence System")
    print("=" * 60)
    print(f"Running on http://localhost:{config.PORT}")
    print("\n🌐 Ready for requests!\n")
    
    app.run(
        host='0.0.0.0',
        port=config.PORT,
        debug=config.FLASK_DEBUG
    )