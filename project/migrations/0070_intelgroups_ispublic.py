# Generated by Django 3.1.4 on 2021-02-19 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0069_auto_20210214_1453'),
    ]

    operations = [
        migrations.AddField(
            model_name='intelgroups',
            name='ispublic',
            field=models.BooleanField(default=False),
        ),
    ]
