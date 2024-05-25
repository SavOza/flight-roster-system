# Generated by Django 5.0.6 on 2024-05-25 09:48

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CabinCrew',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('age', models.IntegerField()),
                ('gender', models.CharField(max_length=100)),
                ('nationality', models.CharField(max_length=255)),
                ('languages', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), size=None)),
                ('seniority', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Dish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dish', models.CharField(max_length=255)),
            ],
        ),
    ]
