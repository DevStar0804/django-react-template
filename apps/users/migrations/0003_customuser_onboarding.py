# Generated by Django 3.1.4 on 2021-02-26 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20201226_2259'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='onboarding',
            field=models.BooleanField(default=True),
        ),
    ]
