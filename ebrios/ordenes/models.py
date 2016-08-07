from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from customauth.models import CustomUser
from licoreras.models import Licorera
from productos.models import Producto

import telebot

class Cupon(models.Model):
	serie = models.CharField(max_length=120, blank=True)
	descuento = models.IntegerField(blank=True, null=True)
	class Meta:
		verbose_name_plural = "Cupones"
	def __unicode__(self):
		return '%s %s' % (self.serie, self.descuento)

class Cliente(models.Model):
	usuariocliente = models.OneToOneField(CustomUser, unique=True, null=True, blank=True)
	telefono= models.CharField(max_length=100, blank=True)
	fechanacimiento = models.DateField(null=True, blank=True)
	sexo = models.CharField(max_length=2,blank=True)
	direccioncompleta = models.CharField(max_length=125, blank=True)
	calle = models.CharField(max_length=125, blank=True)
	carrera = models.CharField(max_length=125, blank=True)
	essur = models.BooleanField(default=False)
	eseste = models.BooleanField(default=False)
	empiezapor = models.CharField(max_length=125, blank=True)	
	class Meta:
		verbose_name_plural = "Clientes"
	def __unicode__(self):
		return '%s %s' % (self.usuariocliente, self.telefono)

class Cuponrelacion(models.Model):
	cupon = models.ForeignKey(Cupon, null=True, blank=True)
	cliente = models.ForeignKey(Cliente, null=True, blank=True)
	activo = models.BooleanField(default=True)

	class Meta:
		verbose_name_plural = "Cuponrelacion"
	def __unicode__(self):
		return '%s %s %s' % (self.cupon, self.cliente, self.activo)

class Rechazo(models.Model):
	motivo = models.CharField(max_length=255, blank=True)
	fechareporte = models.DateField(null=True, blank=True)
	horareporte = models.TimeField(null=True, blank=True)
	def __unicode__(self):
		return '%s' % (self.motivo,)

class Orden(models.Model):
	direccion_cliente = models.CharField(max_length=125, blank=True)
	telefono_cliente = models.CharField(max_length=125, blank=True)
	fechallegada = models.DateField(auto_now_add=True,null=True, blank=True)
	horallegada = models.TimeField(null=True, blank=True)
	fechaenvio = models.DateField(null=True, blank=True)
	horaenvio = models.TimeField(null=True, blank=True)	
	subtotal = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
	descuento = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
	total_compra = models.DecimalField(max_digits=15, decimal_places=3, blank=True, null=True)
	cliente = models.ForeignKey(Cliente, to_field='usuariocliente', null=True, blank=True)	
	licorera = models.ForeignKey(Licorera, to_field='usuariolicorera', null=True, blank=True)
	pedido = models.ManyToManyField(Producto, through='Ordenrelacion', blank=True)
	estado = models.BooleanField(default=False)
	observacion = models.CharField(max_length=255, blank=True)
	rechazado = models.OneToOneField(Rechazo, null=True, blank=True)
	class Meta:
		verbose_name_plural = "Ordenes"
	def __unicode__(self):
		return '%s %s %s %s %s %s %s %s %s' % (self.direccion_cliente, self.telefono_cliente, self.fechallegada, 
			self.horallegada, self.fechaenvio, self.horaenvio, self.subtotal, self.licorera, self.pedido)

class Ordenrelacion(models.Model):
	ordenes = models.ForeignKey('ordenes.Orden', on_delete=models.CASCADE)
	productos = models.ForeignKey('productos.Producto', on_delete=models.CASCADE)
	cantidad = models.CharField(max_length=80,blank=True)

def enviar_notificacion_telegram(sender, instance, created, **kwargs):
	try:
		bot = telebot.TeleBot(settings.API_TOKEN)
		message = """Felicitaciones ha llegado una 
					 nueva orden asociada a %s, a
					 la direccion %s, por un total de 
					 %s,los datos del cliente
					 son telefono: %s, nombre y apellido:
					 %s %s """ % (instance.licorera.razon_social,
								instance.direccion_cliente,
								instance.total_compra,
								instance.telefono_cliente,
								instance.cliente.usuariocliente.nombre,
								instance.cliente.usuariocliente.apellido,)
		bot.send_message(settings.ADMIN_CHAT_ID, message)
		print "se tuvo que haber enviado"
	except:
		print "no se pudo enviar la notificacion"


post_save.connect(enviar_notificacion_telegram, sender=Orden)

