from rest_framework import serializers
from .models import Producto, Marca, Categoria, Subcategoria, Tamano

class CategoriaSerializer(serializers.ModelSerializer):		
	class Meta:
		model = Categoria
		fields = ('id','nombre')

class SubcategoriaSerializer(serializers.ModelSerializer):		
	class Meta:
		model = Subcategoria
		fields = ('id','nombre','categoria')

class MarcaSerializer(serializers.ModelSerializer):		
	class Meta:
		model = Marca
	

class TamanoSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Tamano
	

class CategoriaGetSerializer(serializers.ModelSerializer):		
	class Meta:
		model = Categoria
		fields = ('id','nombre')

class SubcategoriaGetSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Subcategoria
		fields = ('id','nombre')

class MarcaGetSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Marca
		fields = ('id','nombre')

class TamanoGetSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Tamano
		fields = ('id','nombre')

class ProductoGetSerializer(serializers.ModelSerializer):			
	categoria = CategoriaGetSerializer()
	tamano = SubcategoriaGetSerializer()
	subcategoria = MarcaGetSerializer()
	marca = TamanoGetSerializer()	
	class Meta:
		model = Producto
		fields = ('id','precio','referencia','disponible',
				'borrado','licorera','categoria','tamano','subcategoria',
				'marca','imagen')
	

class ProductoSerializer(serializers.ModelSerializer):	
	categoria = serializers.SerializerMethodField()
	tamano = serializers.SerializerMethodField()
	subcategoria = serializers.SerializerMethodField()
	marca = serializers.SerializerMethodField()
	class Meta:
		model = Producto
		fields = ('id','precio','referencia','disponible','borrado',
				'licorera','categoria','tamano','subcategoria','marca','imagen')
	def get_categoria(self, obj):
		return obj.categoria.nombre
	def get_tamano(self, obj):
		return obj.tamano.nombre
	def get_subcategoria(self, obj):
		return obj.subcategoria.nombre	
	def get_marca(self, obj):
		return obj.marca.nombre

class ProductoPutSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Producto
		fields = ('id','borrado')		

class ProductoDisponiblePutSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Producto
		fields = ('id','disponible')		

class MarcaPostSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Marca	

class ProductoPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Producto
		
