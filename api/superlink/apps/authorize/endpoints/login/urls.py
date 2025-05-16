from django.urls import path
from apps.authorize.endpoints.login.views import LoginView, LogoutView

app_name = 'api'

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
