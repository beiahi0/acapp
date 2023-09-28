from django.shortcuts import reder

def index(request):
    return render(request, "multiends/web.html")