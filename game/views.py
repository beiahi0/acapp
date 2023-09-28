from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def index(request):
    line1 = '<h1 style = "text-align: center" > 术士之战 </h1>'
    line2 = '<img src="https://cdn.acwing.com/media/file_system/file/application/icon/01be01554421020000019ae93ff35c.jpg1280w_1l_2o_100sh_LBjQxh6.jpg"> </img>'
    return HttpResponse(line1 + line2)
