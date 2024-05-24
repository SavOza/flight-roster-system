# Generated by Django 5.0.6 on 2024-05-23 18:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cabin_crew_information', '0001_initial'),
        ('flight_crew_information', '0001_initial'),
        ('passenger_information', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('country', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('airport_name', models.CharField(max_length=255)),
                ('airport_code', models.CharField(max_length=3, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='SharedFlightInfo',
            fields=[
                ('shared_flight_number', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('shared_flight_company', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Roster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('flight_cabin_crew_chef', models.ManyToManyField(blank=True, related_name='flight_cabin_crew_chef', to='cabin_crew_information.cabincrew')),
                ('flight_cabin_crew_junior', models.ManyToManyField(blank=True, related_name='flight_cabin_crew_junior', to='cabin_crew_information.cabincrew')),
                ('flight_cabin_crew_senior', models.ManyToManyField(blank=True, related_name='flight_cabin_crew_senior', to='cabin_crew_information.cabincrew')),
                ('flight_crew_junior', models.ManyToManyField(related_name='flight_crew_junior', to='flight_crew_information.flightcrew')),
                ('flight_crew_senior', models.ManyToManyField(related_name='flight_crew_senior', to='flight_crew_information.flightcrew')),
                ('flight_crew_trainee', models.ManyToManyField(blank=True, related_name='flight_crew_trainee', to='flight_crew_information.flightcrew')),
                ('flight_menu', models.ManyToManyField(blank=True, to='cabin_crew_information.dish')),
                ('flight_passengers', models.ManyToManyField(blank=True, related_name='flight_passengers', to='passenger_information.placedpassenger')),
            ],
        ),
        migrations.CreateModel(
            name='VehicleType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vehicle_name', models.CharField(max_length=255)),
                ('vehicle_crew_capacity', models.IntegerField()),
                ('vehicle_pilot_capacity', models.IntegerField()),
                ('vehicle_passenger_capacity', models.IntegerField()),
                ('vehicle_seating_plan', models.IntegerField()),
                ('std_menu', models.ManyToManyField(to='cabin_crew_information.dish')),
            ],
        ),
        migrations.CreateModel(
            name='Flight',
            fields=[
                ('flight_number', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('flight_trainee_limit', models.IntegerField()),
                ('flight_date', models.DateTimeField()),
                ('flight_duration', models.DurationField()),
                ('flight_distance', models.IntegerField()),
                ('flight_dest', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='flight_destination', to='flight_information.location')),
                ('flight_src', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='flight_source', to='flight_information.location')),
                ('flight_roster', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='flight_information.roster')),
                ('shared_flight', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='flight_information.sharedflightinfo')),
                ('vehicle_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='flight_information.vehicletype')),
            ],
        ),
    ]