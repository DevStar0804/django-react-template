# Generated by Django 3.1.4 on 2021-01-30 21:51

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0056_auto_20210129_2041'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupFeeds',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uniqueid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(blank=True, max_length=100)),
                ('description', models.TextField(blank=True, default='')),
                ('tags', models.CharField(blank=True, max_length=100)),
                ('confidence', models.PositiveIntegerField(blank=True, default=0)),
                ('isenable', models.BooleanField(default=False)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.categories')),
            ],
            options={
                'verbose_name_plural': 'GroupFeeds',
            },
        ),
        migrations.DeleteModel(
            name='Plans',
        ),
        migrations.RemoveField(
            model_name='feeds',
            name='intelgroup',
        ),
        migrations.RemoveField(
            model_name='feeds',
            name='manage_enabled',
        ),
        migrations.AlterField(
            model_name='feeds',
            name='type',
            field=models.CharField(choices=[('rss', 'RSS'), ('curated', 'Curated')], max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='feeds',
            name='uniqueid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AddField(
            model_name='groupfeeds',
            name='feed',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.feeds'),
        ),
        migrations.AddField(
            model_name='groupfeeds',
            name='intelgroup',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='project.intelgroups'),
        ),
    ]
