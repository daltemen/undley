from django.contrib import admin
from django.contrib.auth.models import User
from licoreras.models import Licorera
from actions import export_as_excel
from .models import Orden, Cliente, Ordenrelacion, Cuponrelacion, Cupon, Rechazo

class ClientesAdmin(admin.ModelAdmin):
	list_display = ('id','usuariocliente','direccioncompleta','telefono',)
	search_fields = ('id','usuariocliente__email','direccioncompleta','telefono',)

class OrdenesPedidoInline(admin.TabularInline):
	model = Ordenrelacion
	extra = 1

class OrdenesAdmin(admin.ModelAdmin):
	list_display = ('id','cliente','direccion_cliente','telefono_cliente','fechallegada'
		,'subtotal','descuento','total_compra','idlicorera','idrechazo')
	list_filter = ('fechallegada',)
	filter_horizontal = ('pedido',)
	search_fields = ('licorera__usuariolicorera__email','id','cliente__usuariocliente__email','rechazado__id')
	actions = (export_as_excel,)
	inlines = (OrdenesPedidoInline,)
	def idrechazo(self, obj):
		return obj.rechazado_id
	def idlicorera(self, obj):
		return obj.licorera.usuariolicorera.email

	
class CuponAdmin(admin.ModelAdmin):
	list_display = ('id','serie','descuento')
	search_fields = ('id','serie','descuento')
	
class CuponrelacionAdmin(admin.ModelAdmin):
	list_display = ('id','cupon','cliente', 'activo')
	search_fields = ('id','cupon__serie','cliente__usuariocliente__email')

class RechazoAdmin(admin.ModelAdmin):
	list_display = ('id','fechareporte','horareporte')
	search_fields = ('id','fechareporte','horareporte')

admin.site.register(Orden,OrdenesAdmin)
admin.site.register(Cliente, ClientesAdmin)
admin.site.register(Ordenrelacion)
admin.site.register(Cuponrelacion, CuponrelacionAdmin)
admin.site.register(Cupon, CuponAdmin)
admin.site.register(Rechazo, RechazoAdmin)