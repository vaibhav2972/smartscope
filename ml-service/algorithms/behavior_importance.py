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
                "insight": self._humanize(name, data, importance_scores)
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
            "avg_duration":      np.mean([s.get("duration", 0) for s in sessions]),
            "interaction_level": np.mean([s.get("interactions", 0) for s in sessions]),
            "conversion_rate":   np.mean([s.get("conversions", 0) for s in sessions]),
            "bounce_rate":       np.mean([s.get("bounceRate", 0) for s in sessions]),
            "feature_diversity": len(set([s.get("page", "") for s in sessions]))
        }


    def _calculate_importance(self, user, all_users):
        df = pd.DataFrame(all_users)
        importance = {}
        reverse_metrics = ["bounce_rate"]

        for key in user:
            values = df[key]

            if key in reverse_metrics:
                percentile = (values > user[key]).sum() / len(values)
            else:
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
                "importance":  float(score),
                "value":       level,
                "percentile":  percentile,
                "user_value":  float(user[key]),
                "avg":         float(values.mean())
            }

        return importance


    def _humanize(self, name, data, all_scores):
        """
        Cross-signal insights — each metric is interpreted in context of
        related metrics, not in isolation. This produces insights like
        "high frequency but low conversion = browsing without purpose"
        rather than just "high frequency = good habit".
        """
        value    = data["value"]
        user_val = data["user_value"]
        avg      = data["avg"]

        if avg == 0:
            return "Not enough data for comparison"

        pct_diff = abs((user_val - avg) / avg * 100) if avg > 0 else 0

        # Pull related signals for cross-metric context
        freq_state    = all_scores.get("session_frequency", {}).get("value", "medium")
        conv_state    = all_scores.get("conversion_rate", {}).get("value", "medium")
        bounce_state  = all_scores.get("bounce_rate", {}).get("value", "medium")
        dur_state     = all_scores.get("avg_duration", {}).get("value", "medium")
        inter_state   = all_scores.get("interaction_level", {}).get("value", "medium")
        div_state     = all_scores.get("feature_diversity", {}).get("value", "medium")

        if name == "session_frequency":
            if value == "high" and conv_state == "low":
                return (
                    f"User visits {int(pct_diff)}% more than average but converts rarely — "
                    "high frequency with low intent suggests browsing habit without purpose. "
                    "Focus on converting existing visits rather than driving more."
                )
            elif value == "high" and conv_state == "high":
                return (
                    f"User visits {int(pct_diff)}% more than average and converts well — "
                    "this is your most valuable behaviour pattern. User has strong habit and intent."
                )
            elif value == "high" and bounce_state == "low":
                return (
                    f"User returns {int(pct_diff)}% more often than average and rarely bounces — "
                    "platform has successfully created a sticky habit for this user."
                )
            elif value == "low" and dur_state == "high":
                return (
                    f"User visits {int(pct_diff)}% less than average but stays long when they do — "
                    "quality engagement exists but frequency is a problem. "
                    "A reminder or notification strategy could convert this into a regular habit."
                )
            elif value == "low":
                return (
                    f"User visits {int(pct_diff)}% less than average — "
                    "retention risk. No consistent usage habit has formed yet."
                )
            else:
                return (
                    f"Visit frequency is close to average — "
                    "engagement exists but has not reached habitual levels."
                )

        if name == "avg_duration":
            if value == "high" and conv_state == "low":
                return (
                    f"Sessions are {int(pct_diff)}% longer than average but conversions are low — "
                    "user spends time but does not act. Likely confused or not finding what they need. "
                    "Review conversion path clarity."
                )
            elif value == "high" and inter_state == "high":
                return (
                    f"Sessions are {int(pct_diff)}% longer than average with high interaction — "
                    "deep, active engagement. This user is genuinely invested in the platform."
                )
            elif value == "high" and inter_state == "low":
                return (
                    f"Sessions are {int(pct_diff)}% longer than average but interactions are low — "
                    "user stays but remains passive. Content may be holding attention without "
                    "offering clear next actions."
                )
            elif value == "low" and bounce_state == "low":
                return (
                    f"Sessions are shorter than average but bounce rate is also low — "
                    "user visits are brief but intentional. They find what they need quickly, "
                    "which can be a positive signal."
                )
            elif value == "low":
                return (
                    f"Sessions are {int(pct_diff)}% shorter than average — "
                    "content or landing experience is not holding attention. "
                    "First-screen relevance needs improvement."
                )
            else:
                return (
                    "Session duration is near average — "
                    "engagement is present but not strong enough to stand out."
                )

        if name == "interaction_level":
            if value == "high" and conv_state == "low":
                return (
                    f"User interacts {int(pct_diff)}% more than average but rarely converts — "
                    "high activity with low outcome suggests UI friction near conversion points. "
                    "Check if CTAs are clear and checkout/signup flow is smooth."
                )
            elif value == "high" and conv_state == "high":
                return (
                    f"User interacts {int(pct_diff)}% more than average and converts well — "
                    "interactions are translating into real actions. This is the ideal usage pattern."
                )
            elif value == "low" and dur_state == "high":
                return (
                    f"User spends long time per session but interacts {int(pct_diff)}% less than average — "
                    "passive consumption pattern. User reads or watches but does not engage. "
                    "Add interactive elements or prompts to break passive behaviour."
                )
            elif value == "low":
                return (
                    f"User interacts {int(pct_diff)}% less than average — "
                    "passive usage pattern. Platform is not prompting meaningful actions."
                )
            else:
                return (
                    "Interaction level is near average — "
                    "user engages but has not reached a deeply active usage pattern."
                )

        if name == "feature_diversity":
            if value == "high" and conv_state == "high":
                return (
                    f"User explores significantly more features than average and converts well — "
                    "broad product discovery is directly driving value. "
                    "This user understands and uses the platform deeply."
                )
            elif value == "high" and conv_state == "low":
                return (
                    f"User explores many features but rarely converts — "
                    "discovery is strong but value realisation is weak. "
                    "Consider guiding exploration toward high-value features specifically."
                )
            elif value == "low" and freq_state == "high":
                return (
                    f"User visits frequently but uses very few features — "
                    "strong habit formed around a narrow set of actions. "
                    "Risk: if that one feature fails, user has no reason to stay."
                )
            elif value == "low":
                return (
                    f"User explores fewer features than average — "
                    "low product discovery. Onboarding or feature tooltips may help broaden usage."
                )
            else:
                return (
                    "Feature usage is moderate — "
                    "user knows the core product but has not explored its full depth."
                )

        if name == "conversion_rate":
            if value == "high" and freq_state == "low":
                return (
                    f"User converts well but visits infrequently — "
                    "high intent on rare visits. "
                    "Increasing visit frequency could significantly multiply total conversions."
                )
            elif value == "high":
                return (
                    f"User converts better than most — strong intent and clear goal orientation. "
                    "This user knows what they want and the platform delivers it."
                )
            elif value == "low" and inter_state == "high":
                return (
                    f"User is highly interactive but conversion rate is low — "
                    "engagement exists but the conversion path has friction. "
                    "Audit the steps between engagement and conversion."
                )
            elif value == "low" and dur_state == "high":
                return (
                    f"User spends significant time but rarely converts — "
                    "time is being spent without reaching a decision. "
                    "Value proposition or CTA placement may need revisiting."
                )
            elif value == "low":
                return (
                    "User rarely converts — "
                    "either value perception is low or conversion path has too much friction."
                )
            else:
                return (
                    "Conversion rate is near average — "
                    "user sometimes acts on intent but not consistently."
                )

        if name == "bounce_rate":
            if value == "low" and conv_state == "high":
                return (
                    "User rarely bounces and converts well — "
                    "landing experience is working perfectly for this user. "
                    "Their entry path is worth analysing as a template."
                )
            elif value == "low" and conv_state == "low":
                return (
                    "User rarely bounces but also rarely converts — "
                    "they stay and explore without taking action. "
                    "Engagement hooks are working but conversion triggers are missing."
                )
            elif value == "high" and freq_state == "high":
                return (
                    f"User returns frequently but bounces often — "
                    "habitual visitor who rarely finds what they need on arrival. "
                    "Landing page or entry point relevance needs improvement."
                )
            elif value == "high":
                return (
                    "User exits quickly more often than average — "
                    "first impression is not matching user expectations. "
                    "Review the page they most commonly land on."
                )
            else:
                return (
                    "Bounce rate is near average — "
                    "landing experience is functional but not compelling."
                )

        return "Behaviour pattern identified"


    def _importance_label(self, score):
        if score > 1:
            return "Very High"
        elif score > 0.5:
            return "High"
        elif score > 0.2:
            return "Moderate"
        else:
            return "Low"


    def _generate_summary(self, factors):
        if not factors:
            return "Not enough data"

        main = factors[0]
        weak = [f["factor"] for f in factors if f["current_state"] == "low"]
        strong = [f["factor"] for f in factors if f["current_state"] == "high"]

        if weak and strong:
            return (
                f"User excels in {', '.join(strong[:2]).lower()} but underperforms in "
                f"{', '.join(weak[:2]).lower()}. "
                f"The gap between these signals suggests uneven product experience — "
                f"fixing weak areas will have outsized impact."
            )
        elif weak:
            return (
                f"User is strongest in {main['factor'].lower()}, "
                f"but struggling with {', '.join(weak[:2]).lower()}. "
                f"Improving these areas can significantly increase engagement."
            )
        else:
            return (
                f"User shows consistently strong behaviour, especially in "
                f"{main['factor'].lower()}. "
                f"Focus on maintaining this and expanding into advanced features."
            )


    def _generate_actions(self, factors):
        suggestions = []

        for f in factors:
            factor = f["factor"]
            state  = f["current_state"]

            if state == "low":
                action = self._fix_suggestion(factor)
                action["priority"] = "high"
                suggestions.append(action)

            elif state == "medium":
                suggestions.append({
                    "type":     "optimize",
                    "factor":   factor,
                    "action":   f"Improve {factor.lower()} to reach top-performing users",
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
                "fix": "Introduce features via onboarding or tooltips",
                "expected_impact": "More product adoption"
            },
            "Conversion Rate": {
                "type": "fix",
                "problem": "User is not converting",
                "fix": "Improve CTA clarity and reduce friction in conversion path",
                "expected_impact": "Higher conversions"
            },
            "Bounce Rate": {
                "type": "fix",
                "problem": "User exits quickly",
                "fix": "Improve landing page relevance and load speed",
                "expected_impact": "Lower bounce rate"
            }
        }
        return fixes.get(factor, {
            "type": "fix",
            "problem": f"{factor} is low",
            "fix": "Optimise this area",
            "expected_impact": "Better engagement"
        })


    def _maintain_suggestion(self, factor):
        maintains = {
            "Session Frequency": {
                "type":   "maintain",
                "strength": "User returns frequently",
                "action": "Maintain value and avoid over-notification",
                "goal":   "Sustain habit"
            },
            "Avg Duration": {
                "type":   "maintain",
                "strength": "User spends long time per session",
                "action": "Keep content quality high",
                "goal":   "Maintain deep engagement"
            },
            "Interaction Level": {
                "type":   "maintain",
                "strength": "User is highly interactive",
                "action": "Continue offering interactive experiences",
                "goal":   "Sustain activity"
            },
            "Feature Diversity": {
                "type":   "maintain",
                "strength": "User explores many features",
                "action": "Introduce advanced or premium features",
                "goal":   "Increase platform dependency"
            },
            "Conversion Rate": {
                "type":   "maintain",
                "strength": "User converts well",
                "action": "Upsell or recommend complementary actions",
                "goal":   "Maximise revenue per user"
            },
            "Bounce Rate": {
                "type":   "maintain",
                "strength": "User stays and explores",
                "action": "Maintain UX performance and page relevance",
                "goal":   "Keep bounce rate low"
            }
        }
        return maintains.get(factor, {
            "type":   "maintain",
            "strength": f"{factor} is strong",
            "action": "Maintain current performance",
            "goal":   "Sustain engagement"
        })


def analyze_user_behavior_importance(user_id, user_data, all_users_data):
    analyzer = BehaviorImportanceAnalyzer()
    return analyzer.analyze_user_importance(user_id, user_data, all_users_data)