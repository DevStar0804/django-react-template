from django.conf import settings
from django.db import models

from apps.utils.models import BaseModel

class GlobalIndicators(BaseModel):
    type = models.CharField(max_length=100, default='')
    type_api = models.CharField(max_length=100, default='')
    value = models.CharField(max_length=100, default='')
    value_api = models.CharField(max_length=100, default='')
    
