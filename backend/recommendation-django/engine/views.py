from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random

class RecommendationView(APIView):
    """
    Mock AI View that analyzes incident context and returns
    recommended actions with confidence scores.
    """
    def post(self, request):
        data = request.data
        description = data.get('description', '').lower()
        source = data.get('source', 'unknown')

        # Mock AI Logic / Heuristics
        actions = []
        
        if 'database' in description or 'sql' in description:
            actions.append({
                'action': 'Failover Database',
                'confidence': 0.95,
                'reason': 'High latency detected in primary DB queries.'
            })
            actions.append({
                'action': 'Kill Long-Running Queries',
                'confidence': 0.70,
                'reason': 'Potential deadlock detected.'
            })
        elif 'memory' in description or 'oom' in description:
            actions.append({
                'action': 'Restart Service',
                'confidence': 0.92,
                'reason': 'Memory usage exceeded 90% threshold for > 5 min.'
            })
            actions.append({
                'action': 'Scale Up',
                'confidence': 0.60,
                'reason': 'Consistent load increase.'
            })
        elif '500' in description or 'error' in description:
             actions.append({
                'action': 'Rollback Deployment',
                'confidence': 0.88,
                'reason': 'Error rate spiked immediately after last deployment.'
            })
        else:
             actions.append({
                'action': 'Investigate Logs',
                'confidence': 0.50,
                'reason': 'No specific pattern matched. Human investigation required.'
            })

        return Response({
            'incident_id': data.get('incident_id'),
            'recommendations': actions,
            'model_version': 'v1.0.0-mock'
        }, status=status.HTTP_200_OK)
