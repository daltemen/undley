import django_filters
from django.shortcuts import render
from customauth.models import CustomUser 
from rest_framework import viewsets, serializers, generics, filters
from .models import Licorera, Zona
from .serializers import LicoreraSerializer, UserLicoreraSerializer, ZonaPutSerializer, ZonaSerializer

class LicoreraFilter(django_filters.FilterSet):
	pk_usuario = django_filters.CharFilter(name="usuariolicorera__pk")	
	class Meta:
		model = Licorera
		fields = ['pk_usuario']

class LicoreraViewSet(viewsets.ModelViewSet):
	queryset = Licorera.objects.all()
	serializer_class = LicoreraSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = LicoreraFilter	

class UserViewSet(viewsets.ModelViewSet):
	queryset = CustomUser.objects.filter(groups__name='Licoreras')
	serializer_class = UserLicoreraSerializer

class ZonaPutViewSet(viewsets.ModelViewSet):
	queryset = Zona.objects.all()
	serializer_class = ZonaPutSerializer	

class ZonaFilter(django_filters.FilterSet):
	licorera = django_filters.CharFilter(name="licorera__pk")	
	class Meta:
		model = Zona
		fields = ['licorera']

class ZonaViewSet(viewsets.ModelViewSet):
	queryset = Zona.objects.all()
	serializer_class = ZonaSerializer
	filter_class = ZonaFilter
