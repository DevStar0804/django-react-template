# Generated by Django 3.1.4 on 2020-12-29 13:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0013_apikeys_webhooks'),
    ]

    operations = [
        migrations.AddField(
            model_name='apikeys',
            name='intelgroup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.intelgroups'),
        ),
        migrations.AddField(
            model_name='webhooks',
            name='intelgroup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.intelgroups'),
        ),
    ]
