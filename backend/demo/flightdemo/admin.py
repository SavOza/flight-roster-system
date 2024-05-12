from django.contrib import admin
from .models import Passenger, Flight, FlightCrew, CabinCrew, Dish

# Registering the models with the admin interface
admin.site.register(Passenger)
admin.site.register(Flight)
admin.site.register(FlightCrew)
admin.site.register(CabinCrew)
admin.site.register(Dish)

