# Generated by Django 3.1.4 on 2021-01-03 05:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0025_auto_20210103_0125'),
    ]

    operations = [
        migrations.AddField(
            model_name='tags',
            name='state',
            field=models.CharField(default='custom', max_length=100),
        ),
    ]
