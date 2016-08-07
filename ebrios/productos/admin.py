from django.contrib import admin
from .models import (Categoria, Tamano, Subcategoria,
						Marca, Producto)

class ProductosAdmin(admin.ModelAdmin):
	list_display = ('id','categoria','tamano','subcategoria',
		'marca','precio')
	search_fields = ('id','categoria__nombre','tamano__nombre',
						'subcategoria__nombre','marca__nombre',
						'precio')
	
class MarcasAdmin(admin.ModelAdmin):
	list_display = ('id','nombre','subcategoria')		
	filter_horizontal = ('tamano',)
	search_fields = ('id','nombre','subcategoria__nombre',
						'subcategoria__categoria__nombre')

class CategoriaAdmin(admin.ModelAdmin):
	list_display = ('id','nombre')
	search_fields = ('id','nombre')

class SubcategoriaAdmin(admin.ModelAdmin):
	list_display = ('id','nombre','categoria')
	search_fields = ('id','nombre','categoria__nombre')
		
class TamanoAdmin(admin.ModelAdmin):
	list_display = ('id','nombre')
	search_fields = ('id','nombre')
		

admin.site.register(Categoria,CategoriaAdmin)
admin.site.register(Tamano,TamanoAdmin)
admin.site.register(Subcategoria,SubcategoriaAdmin)
admin.site.register(Marca,MarcasAdmin)
admin.site.register(Producto,ProductosAdmin)





