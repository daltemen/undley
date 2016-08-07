from rest_framework import serializers
from customauth.models import CustomUser
from productos.serializers import MarcaSerializer
from productos.models import Producto, Marca
from .models import Licorera, Zona

class UserLicoreraSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = CustomUser 
		fields = ('id','email',)

class LicoreraSerializer(serializers.HyperlinkedModelSerializer):
	usuariolicorera = UserLicoreraSerializer()	
	class Meta:
		model = Licorera
		fields = ('id','razon_social','usuariolicorera','montominimo')

class LicoreraMarcaSerializer(serializers.HyperlinkedModelSerializer):	
	class Meta:
		model = Marca
		fields = ('nombre',)

class ZonaPutSerializer(serializers.ModelSerializer):
	class Meta:
		model = Zona
		fields = ('id','disponible',) 

class ZonaSerializer(serializers.ModelSerializer):
    usuariolicorera = serializers.SerializerMethodField()
    montominimo = serializers.SerializerMethodField()
    razon_social = serializers.SerializerMethodField()
    class Meta:
        model = Zona
        fields = ('id','carreramenor','carreramayor','callemenor','callemayor',
        			'essur','eseste','licorera','disponible','ciudad',
        			'usuariolicorera','montominimo','costoenvio','efectivo',
        			'tarjeta','razon_social') 
    def get_usuariolicorera(self, obj):
        return obj.licorera.usuariolicorera.id
    def get_montominimo(self, obj):
        return obj.licorera.montominimo
    def get_razon_social(self, obj):
        return obj.licorera.razon_social