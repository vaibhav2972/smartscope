import numpy as np


class WebsiteIntelligenceAnalyzer:

    def analyze(self, websites_data):

        if not websites_data:
            return {"success": False, "message": "No data found"}

        raw = [self._extract(site) for site in websites_data]
        norm = self._normalize(raw)

        results = []

        for i, (site, m) in enumerate(zip(websites_data, norm)):

            score = self._score(m)

            results.append({
                "website_id": site.get("website_id"),
                "website_name": site.get("website_name"),
                "score": score,
                "insights": self._human_story(raw[i], raw) 
            })

        results.sort(key=lambda x: x["score"], reverse=True)

        return {
            "success": True,
            "winner": results[0]["website_name"],
            "rankings": results,
            "summary": self._summary(results)
        }


    def _extract(self, site):

        sessions = site.get("sessions", [])
        interactions = site.get("interactions", [])

        if not sessions:
            return {"a": 0, "b": 0, "c": 0, "d": 0}

        a = np.mean([s.get("duration", 0) for s in sessions])         
        b = 1 - np.mean([s.get("bounceRate", 0) for s in sessions])   
        c = np.mean([s.get("conversions", 0) for s in sessions])      
        d = len(interactions) / max(len(sessions), 1)                

        return {"a": a, "b": b, "c": c, "d": d}

    def _normalize(self, data):
        keys = data[0].keys()
        out = [{} for _ in data]

        for k in keys:
            vals = np.array([x[k] for x in data], dtype=float)

            # real percentile rank
            order = vals.argsort()
            ranks = np.empty_like(order, dtype=float)
            ranks[order] = np.linspace(0, 1, len(vals))

            for i in range(len(vals)):
                out[i][k] = float(ranks[i])

        return out

    def _score(self, m):
        return m["a"] * 0.35 + m["b"] * 0.25 + m["c"] * 0.25 + m["d"] * 0.15

    def _human_story(self, m, all_data):

        def rank(key):
            arr = [x[key] for x in all_data]
            return (np.array(arr) < m[key]).mean()

        a = rank("a")
        b = rank("b")
        c = rank("c")
        d = rank("d")

        story = []

        # Attention
        if a >= 0.75:
            story.append("People tend to stay and explore for a long time here.")
        elif a <= 0.25:
            story.append("People lose interest quite quickly after arriving.")
        else:
            story.append("People's attention is fairly average here.")

        # Return
        if b >= 0.75:
            story.append("Many visitors come back again after their first visit.")
        elif b <= 0.25:
            story.append("Most visitors do not return after leaving.")
        else:
            story.append("Return behavior is weak or inconsistent.")

        # Conversion
        if c >= 0.75:
            story.append("Visitors often complete what they came to do.")
        elif c <= 0.25:
            story.append("Visitors rarely finish meaningful actions here.")
        else:
            story.append("Completion behavior varies across users.")

        # Exploration
        if d >= 0.75:
            story.append("People explore many parts of the platform.")
        elif d <= 0.25:
            story.append("Most users only view a small portion of the platform.")
        else:
            story.append("Exploration is moderate across users.")

        return story


    def _summary(self, ranked):

        best = ranked[0]
        worst = ranked[-1]

        return {
            "best_performing_site": best["website_name"],
            "worst_performing_site": worst["website_name"],
            "action": "Improve user experience and clarity on the weakest platform."
        }


def analyze_website_intelligence(websites_data):
    return WebsiteIntelligenceAnalyzer().analyze(websites_data)