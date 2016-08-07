from django.db import models
from licoreras.models import Licorera

class Categoria (models.Model):
	nombre = models.CharField(max_length=120, null=True, blank=True)		
	class Meta:
		verbose_name_plural = "Categorias"
	def __unicode__(self):
		return '%s' % (self.nombre,)

class Tamano (models.Model):
	nombre = models.CharField(max_length=120, null=True, blank=True)	
	class Meta:
		verbose_name_plural = "Tamanos"
	def __unicode__(self):
		return '%s' % (self.nombre)

class Subcategoria (models.Model):
	nombre = models.CharField(max_length=120)
	categoria = models.ForeignKey(Categoria, blank=True, null=True)	
	class Meta:
		verbose_name_plural = "Subcategorias"
	def __unicode__(self):
		return '%s, %s' % (self.nombre, self.categoria)

class Marca (models.Model):
	nombre = models.CharField(max_length=120, null=True, blank=True)
	subcategoria = models.ForeignKey(Subcategoria, blank=True, null=True)
	imagen = models.BooleanField(default=True)
	tamano = models.ManyToManyField(Tamano, blank=True)
	class Meta:
		verbose_name_plural = "Marcas"
	def __unicode__(self):
		return '%s %s' % (self.nombre, self.subcategoria)

class Producto (models.Model):	
	precio = models.DecimalField(max_digits=15, decimal_places=0, blank=True)	
	referencia = models.CharField(max_length=125,null=True, blank=True)
	disponible = models.BooleanField(default=True)
	borrado = models.BooleanField(default=False)
	imagen = models.CharField(max_length=500,null=True, blank=True)	
	licorera = models.ForeignKey(Licorera, null=True, blank=True)	
	categoria = models.ForeignKey(Categoria, blank=True, null=True)
	tamano = models.ForeignKey(Tamano, blank=True, null=True)
	subcategoria = models.ForeignKey(Subcategoria, blank=True, null=True)
	marca = models.ForeignKey(Marca, blank=True, null=True)
	class Meta:
		verbose_name_plural = "Productos"	
	def __unicode__(self):
		return '%s %s %s %s %s %s %s' % (self.precio, self.referencia,
											self.licorera, self.categoria, self.tamano,
											self.subcategoria, self.marca)

