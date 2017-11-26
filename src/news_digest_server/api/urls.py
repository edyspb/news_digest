from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^digest/$', views.DigestView.as_view(), name='digest'),
    url(r'^category/$', views.CategoryView.as_view(), name='category')
]
