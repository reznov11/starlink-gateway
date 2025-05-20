from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from apps.authorize.endpoints.login.views import IndexView

urlpatterns = [
    path('partner/', IndexView.as_view(), name='home'),
    path('i18n/', include('django.conf.urls.i18n')),
    path('api/', include('apps.authorize.urls')),
    path('api/admin/', admin.site.urls),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns.extend(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))


admin.site.site_header: str = "IFrame Generator"
admin.site.site_title: str = "IFrame"
admin.site.index_title: str = "IFrame Generator"
