# Generated by Django 3.1.4 on 2021-02-04 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0066_webhooks_words'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webhooks',
            name='description',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='webhooks',
            name='endpoint',
            field=models.CharField(default='', max_length=100),
        ),
    ]
