from django.shortcuts import render
from django.shortcuts import (render_to_response)
from django.template import RequestContext

# HTTP Error 400
def bad_request(request):
    return render(request, '400.html')

def permission_denied(request):
	return render(request, '403.html')

def page_not_found(request):
	return render(request, '404.html')

def server_error(request):
	return render(request, '500.html')