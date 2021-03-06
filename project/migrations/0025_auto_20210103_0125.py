# Generated by Django 3.1.4 on 2021-01-03 01:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0024_auto_20201230_2305'),
    ]

    operations = [
        migrations.AddField(
            model_name='extractions',
            name='intelgroup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.intelgroups'),
        ),
        migrations.AlterField(
            model_name='feeds',
            name='confidence',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
