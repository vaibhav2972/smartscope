"""
Generate Realistic Test Data for ML Service
Inserts sample users, sessions, and interactions into MongoDB
"""

from pymongo import MongoClient
from datetime import datetime, timedelta
import random
from bson import ObjectId
import bcrypt

# MongoDB connection
MONGODB_URI = "mongodb+srv://sebastian79863:84PJlHrRquvSHhNi@cluster0.7thskkh.mongodb.net/"
DB_NAME = "test"

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Collections
users_collection = db.users
sessions_collection = db.sessions
interactions_collection = db.interactions
websites_collection = db.websites

print("🚀 SmartScope Test Data Generator")
print("=" * 50)


# ============================================
# STEP 1: Get Website IDs
# ============================================

def get_websites():
    """Get existing websites from database"""
    websites = list(websites_collection.find())
    
    if len(websites) < 4:
        print("❌ Error: Need at least 4 websites seeded")
        print("Run: npm run seed (in backend directory)")
        exit(1)
    
    return {
        'ecommerce': next((w for w in websites if w['type'] == 'ecommerce'), None),
        'social': next((w for w in websites if w['type'] == 'social'), None),
        'blog': next((w for w in websites if w['type'] == 'blog'), None),
        'dashboard': next((w for w in websites if w['type'] == 'dashboard'), None),
    }

websites = get_websites()
print(f"✅ Found {len(websites)} websites")


# ============================================
# STEP 2: Create Test Users
# ============================================

def create_test_users(count=15):
    """Create test users with different profiles"""
    
    print(f"\n📝 Creating {count} test users...")
    
    user_profiles = [
        # Power Users (3 users)
        {'type': 'power', 'sessions': (10, 15), 'interactions': (80, 120)},
        {'type': 'power', 'sessions': (12, 18), 'interactions': (90, 150)},
        {'type': 'power', 'sessions': (8, 12), 'interactions': (70, 100)},
        
        # Active Users (5 users)
        {'type': 'active', 'sessions': (5, 8), 'interactions': (30, 60)},
        {'type': 'active', 'sessions': (6, 10), 'interactions': (40, 70)},
        {'type': 'active', 'sessions': (4, 7), 'interactions': (25, 50)},
        {'type': 'active', 'sessions': (5, 9), 'interactions': (35, 65)},
        {'type': 'active', 'sessions': (3, 6), 'interactions': (20, 45)},
        
        # Casual Users (5 users)
        {'type': 'casual', 'sessions': (2, 4), 'interactions': (10, 25)},
        {'type': 'casual', 'sessions': (1, 3), 'interactions': (5, 20)},
        {'type': 'casual', 'sessions': (2, 5), 'interactions': (8, 22)},
        {'type': 'casual', 'sessions': (1, 4), 'interactions': (6, 18)},
        {'type': 'casual', 'sessions': (2, 3), 'interactions': (7, 15)},
        
        # Inactive Users (2 users)
        {'type': 'inactive', 'sessions': (1, 2), 'interactions': (1, 5)},
        {'type': 'inactive', 'sessions': (1, 1), 'interactions': (1, 3)},
    ]
    
    created_users = []
    
    for i, profile in enumerate(user_profiles, 1):
        # Hash a simple password
        password_hash = bcrypt.hashpw("test123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        user = {
            'username': f"{profile['type']}_user_{i}",
            'email': f"test{i}@smartscope.com",
            'passwordHash': password_hash,
            'role': 'user',
            'verified': True,
            'createdAt': datetime.now() - timedelta(days=random.randint(30, 90)),
            'preferences': {},
            'profile': profile
        }
        
        result = users_collection.insert_one(user)
        user['_id'] = result.inserted_id
        created_users.append(user)
        
        print(f"  ✅ Created: {user['username']} (sessions: {profile['sessions']}, interactions: {profile['interactions']})")
    
    print(f"\n✅ Created {len(created_users)} users")
    return created_users


# ============================================
# STEP 3: Generate Sessions
# ============================================

def generate_sessions(users):
    """Generate realistic sessions for users"""
    
    print(f"\n📊 Generating sessions...")
    
    total_sessions = 0
    
    for user in users:
        profile = user['profile']
        num_sessions = random.randint(profile['sessions'][0], profile['sessions'][1])
        
        for _ in range(num_sessions):
            # Random website
            website_key = random.choice(['ecommerce', 'social', 'blog', 'dashboard'])
            website = websites[website_key]
            
            # Session duration based on user type
            if profile['type'] == 'power':
                duration = random.randint(300, 900)  # 5-15 minutes
                pages_visited = random.randint(5, 15)
                bounce = False
            elif profile['type'] == 'active':
                duration = random.randint(120, 400)  # 2-7 minutes
                pages_visited = random.randint(3, 8)
                bounce = random.random() < 0.2
            elif profile['type'] == 'casual':
                duration = random.randint(30, 180)  # 30s-3min
                pages_visited = random.randint(1, 4)
                bounce = random.random() < 0.4
            else:  # inactive
                duration = random.randint(10, 60)  # 10-60s
                pages_visited = 1
                bounce = True
            
            # Random session start time (within last 30 days)
            session_start = datetime.now() - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
            session_end = session_start + timedelta(seconds=duration)
            
            # Interactions count
            avg_interactions = random.randint(
                profile['interactions'][0],
                profile['interactions'][1]
            )

            interactions_per_session = max(1, avg_interactions // num_sessions)
            
            session = {
                'userId': str(user['_id']),
                'websiteId': str(website['_id']),
                'sessionStart': session_start,
                'sessionEnd': session_end,
                'duration': duration,
                'isActive': False,
                'deviceInfo': {
                    'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'platform': 'Win32',
                    'screenResolution': '1920x1080',
                    'deviceType': random.choice(['desktop', 'mobile', 'tablet'])
                },
                'location': {
                    'country': 'India',
                    'city': random.choice(['Delhi', 'Mumbai', 'Bangalore']),
                    'timezone': 'Asia/Kolkata'
                },
                'ipAddress': f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
                'referralSource': random.choice(['direct', 'google', 'social']),
                'totalInteractions': interactions_per_session,
                'totalClicks': random.randint(interactions_per_session // 2, interactions_per_session),
                'totalScrolls': random.randint(0, interactions_per_session // 3),
                'pagesVisited': pages_visited,
                'uniquePagesVisited': [f"page_{i}" for i in range(pages_visited)],
                'maxScrollDepth': random.randint(30, 100),
                'bounceRate': bounce,
                'conversionEvents': ['purchase'] if random.random() < 0.15 else [],
                'hasConversion': random.random() < 0.15,
                'exitPage': f"/demo/{website_key}",
                'exitIntent': False
            }
            
            result = sessions_collection.insert_one(session)
            session['_id'] = result.inserted_id
            total_sessions += 1
            
            # Generate interactions for this session
            generate_interactions(user, session, website, interactions_per_session)
    
    print(f"✅ Generated {total_sessions} sessions")


# ============================================
# STEP 4: Generate Interactions
# ============================================

def generate_interactions(user, session, website, count):
    """Generate interactions for a session"""
    
    interaction_types = {
        'ecommerce': ['click', 'view', 'add_to_cart', 'wishlist_add', 'search', 'filter_apply'],
        'social': ['click', 'like', 'unlike', 'comment', 'share', 'post_create'],
        'blog': ['click', 'view', 'bookmark', 'share'],
        'dashboard': ['click', 'view', 'export', 'filter_apply']
    }
    
    entity_types = {
        'ecommerce': 'product',
        'social': 'post',
        'blog': 'article',
        'dashboard': 'metric'
    }
    
    website_type = website.get('type', 'ecommerce')
    available_types = interaction_types.get(website_type, ['click', 'view'])
    entity_type = entity_types.get(website_type, 'item')
    
    for i in range(count):
        interaction_type = random.choice(available_types)
        
        # Random timestamp within session
        interaction_time = session['sessionStart'] + timedelta(
            seconds=random.randint(0, session['duration'])
        )
        
        interaction = {
            'userId': str(user['_id']),
            'sessionId': str(session['_id']),
            'websiteId': str(website['_id']),
            'timestamp': interaction_time,
            'interactionType': interaction_type,
            'actionCategory': 'engagement',
            'elementId': f"element_{random.randint(1, 100)}",
            'elementType': random.choice(['button', 'link', 'card', 'input']),
            'elementText': f"Element {i}",
            'pageUrl': f"/demo/{website_type}",
            'entityData': {
                'entityType': entity_type,
                'entityId': f"{entity_type}_{random.randint(1, 12)}",
                'entityName': f"Sample {entity_type.title()} {random.randint(1, 12)}",
                'attributes': {
                    'category': random.choice(['Electronics', 'Accessories', 'Technology']),
                    'price': random.randint(299, 8999)
                }
            },
            'coordinates': {
                'x': random.randint(100, 800),
                'y': random.randint(100, 600)
            },
            'viewportSize': {
                'width': 1920,
                'height': 1080
            },
            'scrollDepth': random.randint(0, 100),
            'timeOnElement': random.randint(500, 5000),
            'deviceType': session['deviceInfo']['deviceType']
        }
        
        interactions_collection.insert_one(interaction)


# ============================================
# MAIN EXECUTION
# ============================================

def main():
    print("\n⚠️  WARNING: This will create test data in your database")
    print("Make sure you're using a development database, not production!")
    
    response = input("\nContinue? (yes/no): ")
    
    if response.lower() != 'yes':
        print("❌ Cancelled")
        return
    
    print("\n" + "=" * 50)
    print("🎬 Starting data generation...")
    print("=" * 50)
    
    # Create users
    users = create_test_users(15)
    
    # Generate sessions and interactions
    generate_sessions(users)
    
    # Summary
    print("\n" + "=" * 50)
    print("✅ DATA GENERATION COMPLETE!")
    print("=" * 50)
    print(f"👥 Users created: {users_collection.count_documents({})}")
    print(f"📊 Sessions created: {sessions_collection.count_documents({})}")
    print(f"🔘 Interactions created: {interactions_collection.count_documents({})}")
    print("\n🎉 Your ML service is ready to test!")
    print("Run: python app.py")
    print("=" * 50)


if __name__ == '__main__':
    main()