# Generated by Django 3.1.4 on 2021-01-18 22:20

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0042_auto_20210118_2152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feeds',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
    ]