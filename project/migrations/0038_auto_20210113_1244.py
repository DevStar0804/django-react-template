# Generated by Django 3.1.4 on 2021-01-13 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0037_auto_20210112_2003'),
    ]

    operations = [
        migrations.AddField(
            model_name='globalattributes',
            name='api_attribute',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='globalattributes',
            name='api_value',
            field=models.CharField(default='', max_length=100),
        ),
    ]
