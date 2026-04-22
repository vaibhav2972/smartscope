import pandas as pd
import numpy as np


class FeatureAttributionAnalyzer:

    def analyze(self, feature_interactions, user_sessions):

        if not feature_interactions:
            return {
                "success": False,
                "message": "No interaction data found"
            }

        df = pd.DataFrame(feature_interactions)
        session_df = pd.DataFrame(user_sessions) if user_sessions else pd.DataFrame()

        expected_cols = [
            "interactionType",
            "timeOnElement",
            "scrollDepth",
            "pageUrl",
            "pageName",
            "elementType"
        ]

        for col in expected_cols:
            if col not in df.columns:
                df[col] = 0

        df = df.fillna(0)

        feature_scores = self._calculate_feature_scores(df)

        sorted_features = sorted(
            feature_scores.items(),
            key=lambda x: x[1]["score"],
            reverse=True
        )

        top_features = []

        for name, data in sorted_features[:6]:

            top_features.append({
                "feature": self._pretty_name(name),
                "importance_level": self._importance_label(data["score"]),

                
                "insight": self._human_insight(name, data, df),

                "why_it_matters": self._why_it_matters(name, df),

                "action": self._action_recommendation(name, data["score"], df)
            })

        return {
            "success": True,
            "top_drivers": top_features,
            "summary": self._generate_summary(top_features),
            "recommendation": self._recommendation(top_features)
        }

    def _calculate_feature_scores(self, df):

        scores = {}
        total_events = len(df) if len(df) > 0 else 1

        if "interactionType" in df.columns:
            counts = df["interactionType"].value_counts().to_dict()

            for k, v in counts.items():
                scores[k] = {
                    "score": v / total_events,
                    "signal": "interaction"
                }

        if "timeOnElement" in df.columns:
            avg_time = df["timeOnElement"].mean()
            scores["time_on_content"] = {
                "score": min(avg_time / 45, 1),  
                "signal": "engagement_depth"
            }

        if "scrollDepth" in df.columns:
            scores["scroll_behavior"] = {
                "score": df["scrollDepth"].mean() / 100,
                "signal": "content_consumption"
            }

        if "pageName" in df.columns:
            diversity = df["pageName"].nunique()
            scores["content_exploration"] = {
                "score": min(diversity / 8, 1),
                "signal": "exploration"
            }

        if "elementType" in df.columns:
            ui_diversity = df["elementType"].nunique()
            scores["ui_exploration"] = {
                "score": min(ui_diversity / 6, 1),
                "signal": "ui_usage"
            }

        return scores

    def _human_insight(self, name, data, df):

        score = data["score"]

        avg_time = df["timeOnElement"].mean() if "timeOnElement" in df else 0
        avg_scroll = df["scrollDepth"].mean() if "scrollDepth" in df else 0
        pages = df["pageName"].nunique() if "pageName" in df else 0
        elements = df["elementType"].nunique() if "elementType" in df else 0

        if name == "scroll_behavior":

            if score > 0.7:
                return (
                    f"User scrolls ~{int(avg_scroll)}% of content — "
                    "they are fully consuming your pages, meaning layout and content flow is effective."
                )
            elif score > 0.4:
                return (
                    f"User scrolls ~{int(avg_scroll)}% — "
                    "they engage but drop before reaching full content."
                )
            else:
                return (
                    f"User scrolls only ~{int(avg_scroll)}% — "
                    "they are likely losing interest in the first screen or above-the-fold content is weak."
                )

        if name == "time_on_content":

            if score > 0.7:
                return (
                    f"User spends ~{int(avg_time)}s per interaction — "
                    "this indicates strong intent and deep focus on content."
                )
            elif score > 0.4:
                return (
                    f"User spends ~{int(avg_time)}s — "
                    "moderate engagement, some content is working but not all."
                )
            else:
                return (
                    f"User spends only ~{int(avg_time)}s — "
                    "content is not holding attention long enough to create engagement."
                )

        if name == "content_exploration":

            if score > 0.7:
                return (
                    f"User visited {pages} different pages — "
                    "they are actively exploring your product ecosystem."
                )
            elif score > 0.4:
                return (
                    f"User visited {pages} pages — "
                    "they explore, but still stick to core areas."
                )
            else:
                return (
                    f"User visited only {pages} pages — "
                    "they are stuck in a narrow flow, likely due to weak onboarding or discovery."
                )

        if name == "ui_exploration":

            if score > 0.7:
                return (
                    f"User interacted with {elements} UI elements — "
                    "they are highly engaged and actively using the interface."
                )
            elif score > 0.4:
                return (
                    f"User interacted with {elements} elements — "
                    "moderate interface usage."
                )
            else:
                return (
                    f"User interacted with only {elements} UI elements — "
                    "they are mostly passive and not exploring available actions."
                )

        return "Behavior pattern detected from interaction data"

    def _why_it_matters(self, name, df=None):

        mapping = {
            "scroll_behavior": "Directly impacts content visibility and conversion funnel completion.",
            "time_on_content": "Higher time strongly correlates with intent and retention probability.",
            "content_exploration": "More page exploration = stronger product discovery and retention.",
            "ui_exploration": "UI interaction depth reflects product usability and clarity."
        }

        return mapping.get(
            name,
            "This behavior influences overall engagement and product success."
        )

    def _action_recommendation(self, name, score, df=None):

        if score < 0.3:
            return {
                "type": "fix",
                "priority": "high",
                "problem": f"Low engagement detected in {self._pretty_name(name)}",
                "what_users_experience": "Users are not naturally engaging with this area",
                "recommended_fix": self._fix_action(name),
                "expected_impact": "Improved retention and engagement depth"
            }

        if score > 0.7:
            return {
                "type": "maintain",
                "priority": "low",
                "strength": f"{self._pretty_name(name)} is performing strongly",
                "what_is_working": "Users naturally engage without friction",
                "recommended_action": self._maintain_action(name),
                "expected_impact": "Sustained high engagement"
            }

        return {
            "type": "optimize",
            "priority": "medium",
            "suggestion": f"Small improvements in {self._pretty_name(name)}",
            "recommended_actions": [
                "Improve clarity of UI elements",
                "Reduce friction in user flow",
                "Test alternative layouts"
            ],
            "expected_impact": "Incremental engagement lift"
        }

    def _fix_action(self, name):

        return {
            "steps": [
                "Identify friction points in UX",
                "Improve visibility of key actions",
                "Make first interaction more intuitive"
            ]
        }

    def _maintain_action(self, name):

        return {
            "steps": [
                "Keep current UX patterns stable",
                "Avoid unnecessary redesign",
                "Scale successful interaction flows"
            ]
        }

    def _generate_summary(self, features):

        if not features:
            return "Not enough behavioral data to generate insights."

        top = features[0]

        return (
            f"The strongest driver of user behavior is {top['feature']}. "
            f"This indicates where the user finds the most value. "
            f"Improving lower-performing areas will likely increase overall engagement quality."
        )

    def _recommendation(self, features):
        return []

    def _importance_label(self, score):
        if score > 0.7:
            return "Very High"
        elif score > 0.4:
            return "High"
        elif score > 0.2:
            return "Moderate"
        else:
            return "Low"

    def _pretty_name(self, name):
        return name.replace("_", " ").title()


def analyze_feature_attribution(feature_interactions, user_sessions):
    analyzer = FeatureAttributionAnalyzer()
    return analyzer.analyze(feature_interactions, user_sessions)