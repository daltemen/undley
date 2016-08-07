from django.contrib import admin
from .models import Licorera, Zona

class LicorerasAdmin(admin.ModelAdmin):
	list_display = ('id','usuariolicorera','razon_social','nit',
		'direccion','representante','celular',
		'celular_alternativo',)
	search_fields = ('nit','representante','usuariolicorera__username',)
	
class ZonasAdmin(admin.ModelAdmin):
	list_display = ('id','razon_social','disponible')
	def razon_social(self, obj):
		return obj.licorera.razon_social


admin.site.register(Licorera,LicorerasAdmin)
admin.site.register(Zona,ZonasAdmin)