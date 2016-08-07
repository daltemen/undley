from django.template.loader import render_to_string
from django.template import Context
from django.core.mail import send_mail
from ordenes.models import Cupon, Cuponrelacion
from uuid import uuid4

from social.utils import slugify, module_member
from .models import CustomUser
from ordenes.models import Cliente


USER_FIELDS = ['email']


def get_username(strategy, details, user=None, *args, **kwargs):
    if 'username' not in strategy.setting('USER_FIELDS', USER_FIELDS):
        return
    storage = strategy.storage

    if not user:
        email_as_username = strategy.setting('USERNAME_IS_FULL_EMAIL', False)
        uuid_length = strategy.setting('UUID_LENGTH', 16)
        max_length = storage.user.username_max_length()
        do_slugify = strategy.setting('SLUGIFY_USERNAMES', False)
        do_clean = strategy.setting('CLEAN_USERNAMES', True)

        if do_clean:
            clean_func = storage.user.clean_username
        else:
            clean_func = lambda val: val

        if do_slugify:
            override_slug = strategy.setting('SLUGIFY_FUNCTION')
            if override_slug:
                slug_func = module_member(override_slug)
            else:
                slug_func = slugify
        else:
            slug_func = lambda val: val

        if email_as_username and details.get('email'):
            username = details['email']
        elif details.get('username'):
            username = details['username']
        else:
            username = uuid4().hex

        short_username = username[:max_length - uuid_length]
        final_username = slug_func(clean_func(username[:max_length]))

        # Generate a unique username for current user using username
        # as base but adding a unique hash at the end. Original
        # username is cut to avoid any field max_length.
        # The final_username may be empty and will skip the loop.
        while not final_username or \
              storage.user.user_exists(username=final_username):
            username = short_username + uuid4().hex[:uuid_length]
            final_username = slug_func(clean_func(username[:max_length]))
    else:
        final_username = storage.user.get_username(user)
    return {'username': final_username}


def create_user(backend, strategy, details, user=None, *args, **kwargs):    
    if user:
        return {'is_new': False}    
    fields = dict((name, kwargs.get(name) or details.get(name))
                  for name in strategy.setting('USER_FIELDS',
                                               USER_FIELDS))
    if not fields:
        return
    return {
        'is_new': True,
        'user': strategy.create_user(**fields)
    }

def user_details(backend, strategy, details,response, user=None, *args, **kwargs):
    social= user.social_auth.get(provider='facebook')    
    if user:        
        if kwargs['is_new']:
            attrs = {'usuariocliente': user}
            customuser=CustomUser.objects.get(email=user)      
            customuser.nombre=social.extra_data['first_name']
            customuser.apellido=social.extra_data['last_name']
            customuser.save()            
            attrs = dict(attrs.items())
            a = Cliente.objects.create(**attrs)          
            cupon = Cupon.objects.get(pk=1)
            cuponrelacion = Cuponrelacion.objects.create(cupon=cupon, cliente=a, activo=True)
    	    subject = "Cupon Promocional"
    	    to = customuser.email      
            contexto = {
                'nombre':customuser.nombre,
                'apellido':customuser.apellido,
                'cupon': cupon.serie,
                'descuento':cupon.descuento,
            }
            html_content = render_to_string('email/email.html',Context(contexto))
            txt_content = render_to_string('email/email.html',Context(contexto))                        
            send_mail(subject,txt_content,'marketing@ebrios.co',[to],fail_silently = True, html_message=html_content)           
            print a