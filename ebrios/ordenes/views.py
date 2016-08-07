import json
import datetime
import django_filters
from django.http import JsonResponse
from django.core import serializers
from django.shortcuts import render, render_to_response, redirect, get_object_or_404
from django.template import RequestContext, Context
from django.template.loader import get_template, render_to_string
from django.utils.timezone import utc
from django.core.mail import send_mail
from django.contrib.auth.models import User
from customauth.models import CustomUser
from django.views.decorators.cache import cache_control
from django.views.decorators.csrf import csrf_exempt 
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden, HttpResponseBadRequest 
from drealtime import iShoutClient
from productos.models import Producto
from licoreras.models import Licorera
from .models import Cliente, Orden, Ordenrelacion, Cupon, Cuponrelacion, Rechazo
ishout_client = iShoutClient()

def home(request):
    return render_to_response("index.html",)

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def login_success(request):
	if request.user.groups.filter(name="Licoreras").exists():
		users = CustomUser.objects.exclude(id=request.user.id)
		variables = RequestContext(request,{'users':users})
		return redirect(pedidos)
	else:
		return redirect(compras)	

@csrf_exempt
def registrarorden(request):
	if request.method == 'POST':
		try:				
			data = request.body
			orden = json.loads(data)				
			direccion = orden["direccion_cliente"]
			telefono = orden["telefono_cliente"]			
			horallegada = orden["horallegada"] 			
 			subtotal = orden["subtotal"]
 			descuento = orden["descuento"]
 			total_compra = orden["total_compra"]
 			cliente = orden["cliente"] 			
 			licorera = orden["licorera"]	 			
 			pedido = orden["pedido"] 			
 			observacion = orden["observacion"]
 			licoreradata = get_object_or_404(Licorera, pk=licorera)
 			clientedata = get_object_or_404(Cliente, pk=cliente)	 				 			 			
 			nuevaorden = Orden(direccion_cliente=direccion,telefono_cliente=telefono, 
 				horallegada=horallegada, subtotal=subtotal, descuento=descuento,
 				total_compra=total_compra, cliente=clientedata, licorera=licoreradata,
 				observacion=observacion)	 							 			
 			listaproductos = []
 			listacantidades = [] 			
 			for x in pedido:
 				listaproductos.append(x[0])
 				listacantidades.append(x[1]) 
 			for y in range(len(listaproductos)):
 				productos = get_object_or_404(Producto, pk=listaproductos[y])
 			nuevaorden.save() 	 			
 			for i in range(len(listaproductos)):
 				productos = get_object_or_404(Producto, pk=listaproductos[i])				 				
 				ordeniterador = Ordenrelacion(productos=productos, ordenes=nuevaorden,
 								cantidad=listacantidades[i])
 				ordeniterador.save()
 		except:
 			return HttpResponseBadRequest('Algo salio mal',)	
		return JsonResponse({"id":nuevaorden.id})
	else:
		return HttpResponse('Bad Request',)


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def compras(request):	
	if request.flavour == 'mobile':
		return render_to_response("compras_movil.html",)
	else:
		return render_to_response("compras_desktop.html",)
	
@login_required
@user_passes_test(lambda u: u.groups.filter(name='Licoreras').exists())
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def pedidos(request):
	usuarios = CustomUser.objects.exclude(id=request.user.id)
	estasvariables = RequestContext(request,{'users':usuarios})
	return render_to_response('principal_licorera.html',estasvariables)

@login_required
@user_passes_test(lambda u: u.groups.filter(name='Licoreras').exists())
@csrf_exempt
def obtenerlicoreraautenticada(request):
	if request.method == 'GET':
		try:
			usuario = request.user		
			nombre = usuario.email
			id = usuario.id
			context = {
						"id" : id,
						"nombreusuario" :nombre,
			}
		except:
			return HttpResponseBadRequest('Bad Request')
		return JsonResponse(context)
	else:
		return HttpResponseBadRequest('POST')
	

@csrf_exempt
def obtenerclienteautenticado(request):
	if request.method == 'GET':
		if request.user.is_authenticated():	
			try:		
				usuario = request.user		
				nombre = usuario.nombre
				id = usuario.id
				cliente = Cliente.objects.get(usuariocliente=id)
				context = {
							"id" : cliente.id,
							"nombreusuario" : nombre,
				}
			except:
				return HttpResponseBadRequest('Bad Request')
			return JsonResponse(context)
		else:
			return JsonResponse({"id":"null","nombreusuario":"Anonimo"})
	else:
		return HttpResponseBadRequest("BadRequest")

@login_required
def alert(request):
	try:
		r = request.GET.get		
		ishout_client.emit(
			int(r('user')),
			'alertchannel',
			data = {'msg':'Hey Bitch'}		
			)
	except:
		return HttpResponseBadRequest('Algo salio mal')
	return HttpResponseRedirect(reverse('compras'))

@csrf_exempt
def enviar_correo(request):			
	if request.method == 'POST':
		try:			
			data = request.body
			correo = json.loads(data)					
			subject = "Cupon Promocional"  
			from_email = 'Nico de Ebrios <marketing@ebrios.co>'	  
			cliente = correo["id"]
			to = correo["correo"]
			cupon = Cupon.objects.get(pk=1)
			clientedata = get_object_or_404(CustomUser, pk=cliente)			
			contexto = {
				'nombre':clientedata.nombre,
				'apellido':clientedata.apellido,
				'cupon': cupon.serie,
				'descuento':cupon.descuento,
			}
			html_content = render_to_string('email/email.html',Context(contexto))
			txt_content = render_to_string('email/email.html',Context(contexto))						
			send_mail(subject,txt_content,from_email,[to],fail_silently = True, html_message=html_content)			
		except:
			return HttpResponseBadRequest('BAD REQUEST')
		return HttpResponse('YEAH BITCH')
	else:
		return HttpResponseBadRequest('BAD REQUEST')
	
@csrf_exempt
def get_datetime(request):
	if request.method == 'GET':
		try:
			time = datetime.datetime.now().strftime('%H:%M:%S')
			date = datetime.datetime.now().strftime('%Y-%m-%d')
			contexto = {
				'hora':time,
				'fecha': date,
			}
		except:
			return HttpResponseBadRequest('BAD REQUEST')
		return JsonResponse(contexto)
	else:
		return HttpResponseBadRequest('BAD REQUEST')

def registro(request):
    if request.flavour == 'mobile':
        return render_to_response("registro_movil.html",)
    else:
        return render_to_response("registro_desktop.html",)
    
def ingreso(request):
    if request.flavour == 'mobile':
        return render_to_response("ingreso_movil.html",)
    else:
        return render_to_response("ingreso_desktop.html",)

def terminosycondiciones(request):
    if request.flavour == 'mobile':
        return render_to_response("terminosYCondiciones.html",)
    else:
        return render_to_response("terminosYCondiciones.html",)
    
@csrf_exempt
def buzon(request):
	if request.method == 'POST':
		try:				
			data = request.body
			sugerencia = json.loads(data)
			categoria_comentario = sugerencia["categoria_comentario"]			
			comentario = sugerencia["comentario"]
			cliente_id = sugerencia["cliente_comentario"]
			if sugerencia["cliente_comentario"] == "null":
				contexto_ebrios = {
					'categoria_comentario':categoria_comentario,
					'cliente_id': cliente_id,
					'comentario': comentario
				}
				html_content = render_to_string('email/email_buzon_ebrios.html',Context(contexto_ebrios))
				txt_content = render_to_string('email/email_buzon_ebrios.html',Context(contexto_ebrios))
				send_mail(categoria_comentario,txt_content,'marketing@ebrios.co',['devopebrios@gmail.com'],fail_silently = True, html_message=html_content)
			else:
				cliente = Cliente.objects.get(pk=cliente_id)
				usuario = CustomUser.objects.get(pk=cliente.usuariocliente.id) 
				contexto_cliente = {
					'categoria_comentario':categoria_comentario
				}
				html_content = render_to_string('email/email_cliente_buzon.html',Context(contexto_cliente))
				txt_content = render_to_string('email/email_cliente_buzon.html',Context(contexto_cliente))						
				subject_cliente = "Tu opinion es muy importante"
				send_mail(subject_cliente,txt_content,'marketing@ebrios.co',[usuario.email],fail_silently = True, html_message=html_content)			
				contexto_ebrios = {
					'categoria_comentario':categoria_comentario,
					'cliente_id': cliente_id,
					'comentario': comentario
				}
				html_content_ebrios = render_to_string('email/email_buzon_ebrios.html',Context(contexto_ebrios))
				txt_content_ebrios = render_to_string('email/email_buzon_ebrios.html',Context(contexto_ebrios))
				send_mail(categoria_comentario,txt_content_ebrios,'marketing@ebrios.co',['devopebrios@gmail.com'],fail_silently = True, html_message=html_content_ebrios)
 		except:
 			return HttpResponseBadRequest('Algo salio mal',)	
		return HttpResponse('YEAH BITCH')
	else:
		return HttpResponse('Bad Request',)

from rest_framework import viewsets, serializers, filters, generics
from .serializers import (ClienteSerializer, PedidoSerializer, LicoreraOrdenSerializer, 
				OrdenSerializer, OrdenPutSerializer, OrdenesPedidoSerializer, UserSerializer, 
				ClientePostSerializer, CuponSerializer, CuponrelacionSerializer, RechazoSerializer,
				OrdenRechazadaPutSerializer, CuponrelacionputSerializer)

class OrdenFilter(django_filters.FilterSet):	
	pk_cliente = django_filters.CharFilter(name="cliente__pk")
	pk_licorera = django_filters.CharFilter(name="licorera__pk")
	numero_orden = django_filters.CharFilter(name="pk")
	class Meta:
		model = Orden
		fields = ['numero_orden','pk_cliente','pk_licorera']


class ClienteFilter(django_filters.FilterSet):
	pk_usuario = django_filters.CharFilter(name="cliente__pk")	
	class Meta:
		model = Cliente
		fields = ['pk_usuario']

class CuponFilter(django_filters.FilterSet):
	pk_cliente = django_filters.CharFilter(name="cliente")
	pk_cupon = django_filters.CharFilter(name="cupon")
	class Meta:
		model = Cuponrelacion
		fields = ['pk_cliente','pk_cupon']	

class CuponserieFilter(django_filters.FilterSet):
	serie = django_filters.CharFilter(name="serie")	
	class Meta:
		model = Cupon
		fields = ['serie',]

class UserCreateViewSet(viewsets.ModelViewSet):
	queryset = CustomUser.objects.all()
	serializer_class = UserSerializer

class ClienteViewSet(viewsets.ModelViewSet):
	queryset = Cliente.objects.all()
	serializer_class = ClienteSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = ClienteFilter

class ClientePostViewSet(viewsets.ModelViewSet):
	queryset = Cliente.objects.all()
	serializer_class = ClientePostSerializer	

class OrdenPedidoViewSet(viewsets.ModelViewSet):
	queryset = Ordenrelacion.objects.all()
	serializer_class = OrdenesPedidoSerializer

class PedidoViewSet(viewsets.ModelViewSet):
	queryset = Producto.objects.all()
	serializer_class = PedidoSerializer

class LicoreraOrdenViewSet(viewsets.ModelViewSet):
	queryset = Licorera.objects.all()
	serializer_class = LicoreraOrdenSerializer

class OrdenViewSet(viewsets.ModelViewSet):
	queryset = Orden.objects.all()
	serializer_class = OrdenSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = OrdenFilter

class OrdenPutViewSet(viewsets.ModelViewSet):
	queryset = Orden.objects.all()
	serializer_class = OrdenPutSerializer

class CuponViewSet(viewsets.ModelViewSet):
	queryset = Cupon.objects.all()
	serializer_class = CuponSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = CuponserieFilter

class CuponrelacionViewSet(viewsets.ModelViewSet):
	queryset = Cuponrelacion.objects.all()
	serializer_class = CuponrelacionSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = CuponFilter

class CuponrelacionputViewSet(viewsets.ModelViewSet):
	queryset = Cuponrelacion.objects.all()
	serializer_class = CuponrelacionputSerializer

class RechazoViewSet(viewsets.ModelViewSet):
	queryset = Rechazo.objects.all()
	serializer_class = RechazoSerializer

class OrdenrechazadaPutViewSet(viewsets.ModelViewSet):
	queryset = Orden.objects.all()
	serializer_class = OrdenRechazadaPutSerializer
