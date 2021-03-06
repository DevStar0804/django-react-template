# Generated by Django 3.1.4 on 2021-01-25 12:17

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0049_auto_20210124_2340'),
    ]

    operations = [
        migrations.AddField(
            model_name='intelreports',
            name='feed',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.feeds'),
        ),
        migrations.AddField(
            model_name='intelreports',
            name='intelgroup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.intelgroups'),
        ),
        migrations.AddField(
            model_name='intelreports',
            name='uniqueid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
