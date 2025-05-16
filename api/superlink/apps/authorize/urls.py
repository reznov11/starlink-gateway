from django.urls import path, include

app_name = 'api'

urlpatterns = [
    path('', include('apps.authorize.endpoints.login.urls')),
    path('user/', include('apps.accounts.endpoints.users.urls')),
]
