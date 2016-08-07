from rest_framework import serializers
from django.contrib.auth.models import User
from customauth.models import CustomUser
from productos.serializers import MarcaSerializer
from licoreras.serializers import LicoreraSerializer
from productos.models import Producto, Marca
from licoreras.models import Licorera
from .models import Orden, Cliente, Ordenrelacion, Cupon, Cuponrelacion, Rechazo

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password', 'nombre','apellido')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):    	
        user = CustomUser.objects.create(            
            email=validated_data['email'],
            nombre=validated_data['nombre'],
            apellido=validated_data['apellido'],            
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserClienteSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser 
		fields = ('id','nombre','apellido','email')

class UserLicoreraOrdenSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser 
		fields = ('email',)

class ClientePostSerializer(serializers.ModelSerializer):		
	class Meta:
		model = Cliente		
	
class ClienteSerializer(serializers.ModelSerializer):
	usuariocliente = UserClienteSerializer()	
	class Meta:
		model = Cliente
		fields = ('id','usuariocliente','direccioncompleta','empiezapor')

class PedidoSerializer(serializers.ModelSerializer):
	marca = MarcaSerializer()	
	class Meta:
		model = Producto
		fields = ('id','descripcion','precio','marca','tipo','referencia')
		
class OrdenesPedidoSerializer(serializers.ModelSerializer):
	id = serializers.ReadOnlyField(source='productos.id')
	referencia = serializers.ReadOnlyField(source='productos.referencia')
	precio = serializers.ReadOnlyField(source='productos.precio')			
	categoria = serializers.SerializerMethodField()
	subcategoria = serializers.SerializerMethodField()
	tamano = serializers.SerializerMethodField()
	marca = serializers.SerializerMethodField()
	class Meta:
		model = Ordenrelacion
		fields = ('id','precio','cantidad','referencia','categoria','subcategoria','tamano','marca')		
	def get_categoria(self, obj):
		return obj.productos.categoria.nombre
	def get_subcategoria(self, obj):
		return obj.productos.subcategoria.nombre
	def get_tamano(self, obj):
		return obj.productos.tamano.nombre
	def get_marca(self, obj):
		return obj.productos.marca.nombre

class LicoreraOrdenSerializer(serializers.ModelSerializer):
	usuariolicorera = UserLicoreraOrdenSerializer()	
	class Meta:
		model = Licorera
		fields = ('id','usuariolicorera',)

class OrdenSerializer(serializers.ModelSerializer):	
	cliente = ClienteSerializer()
	licorera = LicoreraOrdenSerializer()	
	pedido = OrdenesPedidoSerializer(source='ordenrelacion_set', many='True')
	horallegada = serializers.TimeField(format="%I:%M %p")	
	class Meta:
		model = Orden
		fields = ('id','direccion_cliente','telefono_cliente','fechallegada',
				'horallegada','fechaenvio','horaenvio','subtotal','descuento','total_compra',
				'cliente','licorera','pedido','estado','rechazado','observacion')
		
class OrdenPutSerializer(serializers.ModelSerializer):
	class Meta:
		model = Orden
		fields = ('id','fechaenvio','horaenvio','estado',) 

class OrdenPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Orden

class OrdenrelacionPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ordenrelacion

class ClientePostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Cliente

class LicoreraPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = Licorera

class CuponSerializer(serializers.ModelSerializer):
	class Meta:
		model = Cupon

class CuponrelacionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Cuponrelacion

class CuponrelacionputSerializer(serializers.ModelSerializer):
	class Meta:
		model = Cuponrelacion
		fields = ('id','activo')

class RechazoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Rechazo

class OrdenRechazadaPutSerializer(serializers.ModelSerializer):
	class Meta:
		model= Orden
		exclude = ('direccion_cliente','telefono_cliente','fechallegada',
				'horallegada','fechaenvio','horaenvio','subtotal',
				'descuento','total_compra','cliente','licorera',
				'pedido','estado','observacion')