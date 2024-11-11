from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("auctions/", views.index, name="index"),
    path("auctions/login", views.login_view, name="login"),
    path("auctions/logout", views.logout_view, name="logout"),
    path("auctions/register", views.register, name="register"),
    path("auctions/add", views.add, name="add"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)