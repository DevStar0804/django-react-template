from copy import copy
from django.conf import settings
from .meta import absolute_url


def project_meta(request):
    # modify these values as needed and add whatever else you want globally available here
    project_data = copy(settings.PROJECT_METADATA)
    project_data['TITLE'] = '{}'.format(project_data['NAME'])
    return {
        'project_meta': project_data,
        'page_url': absolute_url(request.path),
        'page_title': '',
        'page_description': '',
        'page_image': '',
    }


def google_analytics_id(request):
    """
    Adds google analytics id to all requests
    """
    if settings.GOOGLE_ANALYTICS_ID:
        return {
            'GOOGLE_ANALYTICS_ID': settings.GOOGLE_ANALYTICS_ID,
        }
    else:
        return {}
