# Generated by Django 3.1.4 on 2021-01-03 12:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0029_auto_20210103_1216'),
    ]

    operations = [
        migrations.RenameField(
            model_name='indicators',
            old_name='example',
            new_name='value',
        ),
    ]
