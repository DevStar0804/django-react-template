# Generated by Django 3.1.4 on 2021-01-18 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0040_auto_20210118_2211'),
    ]

    operations = [
        migrations.AlterField(
            model_name='intelgroups',
            name='name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
