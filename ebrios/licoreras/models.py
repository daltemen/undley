from django.db import models
from customauth.models import CustomUser
from django.contrib.auth.models import User

class Licorera (models.Model):
	usuariolicorera = models.OneToOneField(CustomUser, unique=True,limit_choices_to={'groups__name': "Licoreras"})
	razon_social = models.CharField(max_length=120)
	nit = models.CharField(max_length=120)
	direccion = models.CharField(max_length=120)
	representante = models.CharField(max_length=120)
	celular = models.CharField(max_length=120)
	celular_alternativo = models.CharField(max_length=120)	
	montominimo = models.IntegerField(blank=True, null=True)	
	class Meta:
		verbose_name_plural = "Licoreras"
	def __unicode__(self):
		return '%s %s %s %s %s %s %s' % (self.usuariolicorera, self.razon_social, self.nit, 
			self.direccion, self.representante, self.celular, self.celular_alternativo)

class Zona (models.Model):
	carreramenor = models.IntegerField(blank=True)
	carreramayor = models.IntegerField(blank=True)
	callemenor = models.IntegerField(blank=True)
	callemayor = models.IntegerField(blank=True)	
	essur = models.BooleanField(default=False)
	eseste = models.BooleanField(default=False)
	licorera = models.ForeignKey(Licorera, blank=True, null=True)
	disponible = models.BooleanField(default=False)
	ciudad = models.CharField(max_length=120, blank=True)
	costoenvio = models.IntegerField(blank=True, default=5000)
	efectivo = models.BooleanField(default=True)
	tarjeta = models.BooleanField(default=True)
	class Meta:
		verbose_name_plural = "Zonas"
	def __unicode__(self):
		return '%s %s %s %s %s %s' % (self.carreramenor, self.carreramayor, self.callemenor, 
			self.callemayor, self.essur, self.licorera)