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
                "feature":          self._pretty_name(name),
                "importance_level": self._importance_label(data["score"]),
                "insight":          self._human_insight(name, data, df, feature_scores),
                "why_it_matters":   self._why_it_matters(name, df, feature_scores),
                "action":           self._action_recommendation(name, data["score"], df)
            })

        return {
            "success":        True,
            "top_drivers":    top_features,
            "summary":        self._generate_summary(top_features, feature_scores),
            "recommendation": self._recommendation(top_features)
        }


    def _calculate_feature_scores(self, df):

        scores = {}
        total_events = len(df) if len(df) > 0 else 1

        if "interactionType" in df.columns:
            counts = df["interactionType"].value_counts().to_dict()
            for k, v in counts.items():
                scores[k] = {
                    "score":  v / total_events,
                    "signal": "interaction"
                }

        if "timeOnElement" in df.columns:
            avg_time = df["timeOnElement"].mean()
            scores["time_on_content"] = {
                "score":  min(avg_time / 45, 1),
                "signal": "engagement_depth"
            }

        if "scrollDepth" in df.columns:
            scores["scroll_behavior"] = {
                "score":  df["scrollDepth"].mean() / 100,
                "signal": "content_consumption"
            }

        if "pageName" in df.columns:
            diversity = df["pageName"].nunique()
            scores["content_exploration"] = {
                "score":  min(diversity / 8, 1),
                "signal": "exploration"
            }

        if "elementType" in df.columns:
            ui_diversity = df["elementType"].nunique()
            scores["ui_exploration"] = {
                "score":  min(ui_diversity / 6, 1),
                "signal": "ui_usage"
            }

        return scores


    def _human_insight(self, name, data, df, all_scores):
        """
        Cross-signal insights — each metric is read in context of related
        signals rather than in isolation, producing actionable conclusions
        instead of raw observations.
        """
        score = data["score"]

        avg_time  = df["timeOnElement"].mean() if "timeOnElement" in df.columns else 0
        avg_scroll = df["scrollDepth"].mean() if "scrollDepth" in df.columns else 0
        pages     = df["pageName"].nunique() if "pageName" in df.columns else 0
        elements  = df["elementType"].nunique() if "elementType" in df.columns else 0

        # Pull related scores for cross-signal context
        scroll_score  = all_scores.get("scroll_behavior", {}).get("score", 0.5)
        time_score    = all_scores.get("time_on_content", {}).get("score", 0.5)
        explore_score = all_scores.get("content_exploration", {}).get("score", 0.5)
        ui_score      = all_scores.get("ui_exploration", {}).get("score", 0.5)

        if name == "scroll_behavior":
            if score > 0.7 and time_score < 0.4:
                return (
                    f"User scrolls ~{int(avg_scroll)}% of content but spends little time per element — "
                    "they are scanning, not reading. Content hierarchy needs improvement: "
                    "key information should be visible without requiring deep reading."
                )
            elif score > 0.7 and time_score > 0.6:
                return (
                    f"User scrolls ~{int(avg_scroll)}% and spends significant time on content — "
                    "full content consumption with deep focus. Layout and content flow are both effective."
                )
            elif score > 0.4 and explore_score < 0.3:
                return (
                    f"User scrolls ~{int(avg_scroll)}% but visits very few pages — "
                    "they engage deeply with a narrow set of content. "
                    "Related content recommendations could expand their journey."
                )
            elif score > 0.4:
                return (
                    f"User scrolls ~{int(avg_scroll)}% — engaged but drops before full content. "
                    "Content below the fold may not be compelling enough to pull them further."
                )
            else:
                return (
                    f"User scrolls only ~{int(avg_scroll)}% — "
                    "losing interest at the top of the page. "
                    "Above-the-fold content is not creating enough pull to scroll further."
                )

        if name == "time_on_content":
            if score > 0.7 and ui_score < 0.3:
                return (
                    f"User spends ~{int(avg_time)}s per interaction but uses very few UI elements — "
                    "they read deeply but do not act. Content is engaging but calls-to-action "
                    "are either missing or not visible enough."
                )
            elif score > 0.7 and ui_score > 0.6:
                return (
                    f"User spends ~{int(avg_time)}s per interaction and actively uses the interface — "
                    "strong intent combined with active behaviour. This is the highest-value usage pattern."
                )
            elif score > 0.4 and scroll_score < 0.3:
                return (
                    f"User spends ~{int(avg_time)}s on content but barely scrolls — "
                    "time is concentrated on first-screen content only. "
                    "Whatever is above the fold is working; below it is being ignored."
                )
            elif score > 0.4:
                return (
                    f"User spends ~{int(avg_time)}s per interaction — "
                    "moderate engagement. Some content is landing, but not consistently across the session."
                )
            else:
                return (
                    f"User spends only ~{int(avg_time)}s per interaction — "
                    "content is not holding attention. "
                    "Either relevance is low or the content format does not match user expectations."
                )

        if name == "content_exploration":
            if score > 0.7 and time_score < 0.4:
                return (
                    f"User visited {pages} different pages but spends little time on each — "
                    "broad but shallow exploration. They are looking for something specific "
                    "and not finding it. Navigation clarity or search functionality needs attention."
                )
            elif score > 0.7 and time_score > 0.6:
                return (
                    f"User visited {pages} pages with strong time investment per page — "
                    "wide and deep exploration. This user is thoroughly engaged with the product ecosystem."
                )
            elif score > 0.4 and ui_score < 0.3:
                return (
                    f"User visited {pages} pages but barely interacted with UI elements — "
                    "exploring content passively without taking actions. "
                    "Interactive prompts or progress indicators could convert browsing into action."
                )
            elif score > 0.4:
                return (
                    f"User visited {pages} pages — moderate exploration. "
                    "They know the core product but have not discovered its full depth."
                )
            else:
                return (
                    f"User visited only {pages} pages — "
                    "stuck in a narrow flow. Weak onboarding or poor content discovery "
                    "is preventing them from seeing the full product value."
                )

        if name == "ui_exploration":
            if score > 0.7 and explore_score < 0.3:
                return (
                    f"User interacted with {elements} UI elements but visited very few pages — "
                    "highly active on a small section of the platform. "
                    "Strong engagement in one area; rest of the product is undiscovered."
                )
            elif score > 0.7 and scroll_score > 0.6:
                return (
                    f"User interacted with {elements} UI elements and scrolls deeply — "
                    "combining active interface usage with content consumption. "
                    "This is a fully engaged user getting value from both content and features."
                )
            elif score > 0.4 and time_score < 0.3:
                return (
                    f"User interacts with {elements} UI elements quickly without much time on content — "
                    "task-oriented behaviour. They come with a specific goal and execute it fast. "
                    "This is positive if tasks complete successfully."
                )
            elif score > 0.4:
                return (
                    f"User interacted with {elements} UI elements — "
                    "moderate interface usage. Core actions are being used but advanced features are not."
                )
            else:
                return (
                    f"User interacted with only {elements} UI elements — "
                    "mostly passive. The interface is not prompting them to take action. "
                    "Review whether key actions are visible and accessible on first view."
                )

        return "Behaviour pattern detected from interaction data"


    def _why_it_matters(self, name, df=None, all_scores=None):
        """
        Why-it-matters is now context-aware — explains the business
        consequence of this specific signal given the overall pattern.
        """
        if all_scores is None:
            all_scores = {}

        scroll_score  = all_scores.get("scroll_behavior", {}).get("score", 0.5)
        time_score    = all_scores.get("time_on_content", {}).get("score", 0.5)
        explore_score = all_scores.get("content_exploration", {}).get("score", 0.5)
        ui_score      = all_scores.get("ui_exploration", {}).get("score", 0.5)

        if name == "scroll_behavior":
            if time_score < 0.3:
                return (
                    "Scroll without time investment means content is being skimmed — "
                    "conversion funnel completion is unlikely if users never slow down to read."
                )
            return "Scroll depth directly determines how much of your value proposition a user actually sees."

        if name == "time_on_content":
            if ui_score < 0.3:
                return (
                    "Time spent without UI interaction is passive consumption — "
                    "it does not translate to retention unless paired with action triggers."
                )
            return "Time on content is the strongest leading indicator of intent and future retention."

        if name == "content_exploration":
            if explore_score > 0.6 and time_score < 0.3:
                return (
                    "Wide exploration with low time per page suggests navigation confusion — "
                    "users are searching rather than discovering, which increases drop-off risk."
                )
            return "Breadth of exploration directly correlates with product stickiness and long-term retention."

        if name == "ui_exploration":
            if ui_score < 0.3:
                return (
                    "Low UI interaction means users are not discovering product capabilities — "
                    "features that are never used cannot create value or retention."
                )
            return "UI interaction depth reflects how well the product is communicating its available actions."

        return "This behaviour directly influences overall engagement quality and retention probability."


    def _action_recommendation(self, name, score, df=None):

        if score < 0.3:
            return {
                "type":               "fix",
                "priority":           "high",
                "problem":            f"Low engagement detected in {self._pretty_name(name)}",
                "what_users_experience": "Users are not naturally engaging with this area",
                "recommended_fix":    self._fix_action(name),
                "expected_impact":    "Improved retention and engagement depth"
            }

        if score > 0.7:
            return {
                "type":               "maintain",
                "priority":           "low",
                "strength":           f"{self._pretty_name(name)} is performing strongly",
                "what_is_working":    "Users naturally engage without friction",
                "recommended_action": self._maintain_action(name),
                "expected_impact":    "Sustained high engagement"
            }

        return {
            "type":     "optimize",
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


    def _generate_summary(self, features, all_scores=None):
        if not features:
            return "Not enough behavioural data to generate insights."

        if all_scores is None:
            all_scores = {}

        top  = features[0]
        low  = [f["feature"] for f in features if f["importance_level"] == "Low"]
        high = [f["feature"] for f in features if f["importance_level"] in ("Very High", "High")]

        scroll_score = all_scores.get("scroll_behavior", {}).get("score", 0.5)
        time_score   = all_scores.get("time_on_content", {}).get("score", 0.5)
        ui_score     = all_scores.get("ui_exploration", {}).get("score", 0.5)

        # Cross-signal summary
        if scroll_score > 0.6 and time_score < 0.3:
            return (
                f"User scrolls broadly but does not invest time in content — "
                f"a scanning pattern that rarely leads to conversion. "
                f"The strongest driver is {top['feature'].lower()}, but depth of engagement "
                f"needs improvement before this translates into retention."
            )

        if time_score > 0.6 and ui_score < 0.3:
            return (
                f"User invests time in content but does not interact with the interface — "
                f"passive consumption without action. "
                f"{top['feature']} is the key strength, but converting attention into action "
                f"is the primary opportunity."
            )

        if low:
            return (
                f"The strongest driver of user behaviour is {top['feature'].lower()}. "
                f"However, {', '.join(low[:2]).lower()} are underperforming — "
                f"these gaps are limiting the overall engagement quality "
                f"and are the highest-priority areas to address."
            )

        return (
            f"The strongest driver is {top['feature'].lower()}. "
            f"User behaviour is consistent across signals — "
            f"focus on deepening the existing engagement pattern rather than fixing gaps."
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