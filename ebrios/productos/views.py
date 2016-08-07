import json 
import django_filters 
from django.core import serializers
from django.shortcuts import render, get_object_or_404
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from .models import Producto, Marca, Categoria, Tamano, Subcategoria
# Create your views here.
def producto_view(request):
	allobjects = list(Producto.objects.all()) 
	data = serializers.serialize('json', allobjects)
	return HttpResponse(data, content_type='application/json')

from rest_framework import viewsets, serializers, generics, filters
from .serializers import (ProductoPutSerializer, ProductoSerializer, MarcaSerializer, 
						MarcaPostSerializer, ProductoPostSerializer, 
						CategoriaSerializer, TamanoSerializer, SubcategoriaSerializer, 
						ProductoDisponiblePutSerializer, 
						ProductoGetSerializer)

class ProductosFilter(django_filters.FilterSet):
	licorera = django_filters.CharFilter(name="licorera__id")
	borrados = django_filters.BooleanFilter(name="borrado")
	disponibles = django_filters.BooleanFilter(name="disponible")
	class Meta:
		model = Producto
		fields = ['licorera','borrados','disponibles']

class MarcaViewSet(viewsets.ModelViewSet):
	queryset = Marca.objects.all()
	serializer_class = MarcaSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
	queryset = Categoria.objects.all()
	serializer_class = CategoriaSerializer

class SubcategoriaViewSet(viewsets.ModelViewSet):
	queryset = Subcategoria.objects.all()
	serializer_class = SubcategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
	queryset = Producto.objects.all()
	serializer_class = ProductoSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = ProductosFilter

class ProductoGetViewSet(viewsets.ModelViewSet):
	queryset = Producto.objects.all()
	serializer_class = ProductoGetSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = ProductosFilter

class ProductoPutViewSet(viewsets.ModelViewSet):
	queryset = Producto.objects.all()
	serializer_class = ProductoPutSerializer

class ProductoDisponiblePutViewSet(viewsets.ModelViewSet):
	queryset = Producto.objects.all()
	serializer_class = ProductoDisponiblePutSerializer

class MarcaPostViewSet(viewsets.ModelViewSet):
	queryset = Marca.objects.all()
	serializer_class = MarcaPostSerializer

class ProductoPostViewSet(viewsets.ModelViewSet):
	queryset = Producto.objects.all()
	serializer_class = ProductoPostSerializer
	
class TamanoViewSet(viewsets.ModelViewSet):
	queryset = Tamano.objects.all()
	serializer_class = TamanoSerializer
