import numpy as np
import pandas as pd


class BehaviorImportanceAnalyzer:

    def analyze_user_importance(self, user_id, user_data, all_users_data):

        user_features = self._extract_user_features(user_data)

        if not user_features:
            return {
                "success": False,
                "message": "Not enough user data"
            }

        all_features = [
            self._extract_user_features(u)
            for u in all_users_data if u
        ]
        all_features = [f for f in all_features if f]

        if len(all_features) < 5:
            return {
                "success": False,
                "message": "Not enough comparison data"
            }

        importance_scores = self._calculate_importance(user_features, all_features)

        sorted_factors = sorted(
            importance_scores.items(),
            key=lambda x: x[1]["importance"],
            reverse=True
        )

        top_factors = []

        for name, data in sorted_factors[:5]:
            top_factors.append({
                "factor": name.replace("_", " ").title(),
                "importance_level": self._importance_label(data["importance"]),
                "current_state": data["value"],
                "percentile": f"{round(data['percentile'] * 100)}%",
                "insight": self._humanize(name, data)
            })

        return {
            "success": True,
            "user_id": user_id,
            "top_factors": top_factors,
            "summary": self._generate_summary(top_factors),
            "actions": self._generate_actions(top_factors)
        }


    def _extract_user_features(self, data):
        sessions = data.get("sessions", [])
        if not sessions:
            return None

        return {
            "session_frequency": len(sessions),
            "avg_duration": np.mean([s.get("duration", 0) for s in sessions]),
            "interaction_level": np.mean([s.get("interactions", 0) for s in sessions]),
            "conversion_rate": np.mean([s.get("conversions", 0) for s in sessions]),
            "bounce_rate": np.mean([s.get("bounceRate", 0) for s in sessions]),
            "feature_diversity": len(set([s.get("page", "") for s in sessions]))
        }


    def _calculate_importance(self, user, all_users):
        df = pd.DataFrame(all_users)
        importance = {}

        for key in user:
            values = df[key]

            percentile = (values < user[key]).sum() / len(values)
            deviation = abs(user[key] - values.mean())
            score = deviation * percentile

            if percentile > 0.75:
                level = "high"
            elif percentile > 0.3:
                level = "medium"
            else:
                level = "low"

            importance[key] = {
                "importance": float(score),
                "value": level,
                "percentile": percentile,
                "user_value": float(user[key]),
                "avg": float(values.mean())
            }

        return importance

    def _importance_label(self, score):
        if score > 1:
            return "Very High"
        elif score > 0.5:
            return "High"
        elif score > 0.2:
            return "Moderate"
        else:
            return "Low"


    def _humanize(self, name, data):
        value = data["value"]
        user_val = data["user_value"]
        avg = data["avg"]

        if avg == 0:
            return "Not enough data for comparison"

        diff = user_val - avg
        pct_diff = (diff / avg) * 100 if avg > 0 else 0

        if name == "session_frequency":
            if value == "high":
                return f"User visits {int(abs(pct_diff))}% more often than average — strong habit formation"
            elif value == "medium":
                return f"User visit frequency is close to average — can be improved"
            else:
                return f"User visits {int(abs(pct_diff))}% less than average — retention risk"

        if name == "avg_duration":
            if value == "high":
                return f"Sessions are longer than average by {int(abs(pct_diff))}% — strong engagement depth"
            elif value == "medium":
                return f"Session duration is average"
            else:
                return f"Sessions are shorter than average — users may not find value quickly"

        if name == "interaction_level":
            if value == "high":
                return f"User interacts {int(abs(pct_diff))}% more than average — highly active behavior"
            elif value == "medium":
                return f"Interaction level is average"
            else:
                return f"User interacts less than average — passive usage pattern"

        if name == "feature_diversity":
            if value == "high":
                return f"User explores significantly more features than average"
            elif value == "medium":
                return f"User uses a moderate number of features"
            else:
                return f"User uses fewer features than average — low product discovery"

        if name == "conversion_rate":
            if value == "high":
                return f"User converts better than most users — strong intent"
            elif value == "medium":
                return f"Conversion rate is average"
            else:
                return f"User rarely converts — value perception may be low"

        if name == "bounce_rate":
            if value == "high":
                return f"User leaves quickly more often than average"
            elif value == "medium":
                return f"Bounce rate is moderate"
            else:
                return f"User tends to stay and explore — strong retention signal"

        return "Behavior pattern identified"


    def _generate_summary(self, factors):
        if not factors:
            return "Not enough data"

        main = factors[0]
        weak = [f["factor"] for f in factors if f["current_state"] == "low"]

        if weak:
            return (
                f"User is strongest in {main['factor'].lower()}, "
                f"but struggling with {', '.join(weak[:2]).lower()}. "
                f"Improving these areas can significantly increase engagement."
            )
        else:
            return (
                f"User shows strong behavior across key areas, especially in "
                f"{main['factor'].lower()}. Focus should be on maintaining this performance."
            )


    def _generate_actions(self, factors):
        suggestions = []

        for f in factors:
            factor = f["factor"]
            state = f["current_state"]

            if state == "low":
                action = self._fix_suggestion(factor)
                action["priority"] = "high"
                suggestions.append(action)

            elif state == "medium":
                suggestions.append({
                    "type": "optimize",
                    "factor": factor,
                    "action": f"Improve {factor.lower()} to reach top-performing users",
                    "priority": "medium"
                })

            elif state == "high":
                action = self._maintain_suggestion(factor)
                action["priority"] = "low"
                suggestions.append(action)

        return list({str(s): s for s in suggestions}.values())

    def _fix_suggestion(self, factor):
        fixes = {
            "Session Frequency": {
                "type": "fix",
                "problem": "User does not return often",
                "fix": "Use push notifications, emails, or reminders",
                "expected_impact": "Increase repeat visits and retention"
            },
            "Avg Duration": {
                "type": "fix",
                "problem": "User leaves quickly",
                "fix": "Improve first impression and content relevance",
                "expected_impact": "Longer sessions"
            },
            "Interaction Level": {
                "type": "fix",
                "problem": "User is passive",
                "fix": "Add more interactive UI elements and CTAs",
                "expected_impact": "Higher engagement per session"
            },
            "Feature Diversity": {
                "type": "fix",
                "problem": "User uses few features",
                "fix": "Introduce features via onboarding/tooltips",
                "expected_impact": "More product adoption"
            },
            "Conversion Rate": {
                "type": "fix",
                "problem": "User is not converting",
                "fix": "Improve CTA clarity and reduce friction",
                "expected_impact": "Higher conversions"
            },
            "Bounce Rate": {
                "type": "fix",
                "problem": "User exits quickly",
                "fix": "Improve landing page UX and speed",
                "expected_impact": "Lower bounce rate"
            }
        }

        return fixes.get(factor, {
            "type": "fix",
            "problem": f"{factor} is low",
            "fix": "Optimize this area",
            "expected_impact": "Better engagement"
        })

    def _maintain_suggestion(self, factor):
        maintains = {
            "Session Frequency": {
                "type": "maintain",
                "strength": "User returns frequently",
                "action": "Maintain value and avoid over-notification",
                "goal": "Sustain habit"
            },
            "Avg Duration": {
                "type": "maintain",
                "strength": "User spends long time",
                "action": "Keep content quality high",
                "goal": "Maintain deep engagement"
            },
            "Interaction Level": {
                "type": "maintain",
                "strength": "User is highly interactive",
                "action": "Continue interactive experiences",
                "goal": "Sustain activity"
            },
            "Feature Diversity": {
                "type": "maintain",
                "strength": "User explores features",
                "action": "Introduce advanced features",
                "goal": "Increase dependency"
            },
            "Conversion Rate": {
                "type": "maintain",
                "strength": "User converts well",
                "action": "Upsell or recommend premium",
                "goal": "Maximize revenue"
            },
            "Bounce Rate": {
                "type": "maintain",
                "strength": "User stays engaged",
                "action": "Maintain UX performance",
                "goal": "Keep low bounce"
            }
        }

        return maintains.get(factor, {
            "type": "maintain",
            "strength": f"{factor} is strong",
            "action": "Maintain performance",
            "goal": "Sustain engagement"
        })


def analyze_user_behavior_importance(user_id, user_data, all_users_data):
    analyzer = BehaviorImportanceAnalyzer()
    return analyzer.analyze_user_importance(user_id, user_data, all_users_data)