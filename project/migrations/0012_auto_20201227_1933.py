# Generated by Django 3.1.4 on 2020-12-27 19:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('djstripe', '0006_2_3'),
        ('project', '0011_auto_20201224_1133'),
    ]

    operations = [
        migrations.AlterField(
            model_name='intelgroups',
            name='plan',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='djstripe.plan'),
        ),
    ]
