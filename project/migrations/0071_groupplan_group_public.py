# Generated by Django 3.1.4 on 2021-02-22 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0070_intelgroups_ispublic'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupplan',
            name='group_public',
            field=models.BooleanField(default=False),
        ),
    ]
