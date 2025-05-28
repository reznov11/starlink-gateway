from django.urls import path, include

app_name = 'api'

urlpatterns = [
    path('', include('apps.authorize.endpoints.login.urls')),
    path('user/', include('apps.accounts.endpoints.users.urls')),
    path('domains/', include('apps.domains.urls')),
    path('partners/', include('apps.partners.urls')),
    path('constructor/', include('apps.constructor.urls')),
    path('proposal/', include('apps.proposal.urls')),
]
