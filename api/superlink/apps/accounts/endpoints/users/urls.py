from django.urls import path
from apps.accounts.endpoints.users.views import (
    UsersListCreateView,
    UserUpdateView,
    UserProfileView,
    UserRolesView,
    DeleteUserView
)

app_name = 'accounts'

urlpatterns = [
    path('', UsersListCreateView.as_view(), name='list'),
    path('roles/', UserRolesView.as_view(), name='roles_list'),
    path('profile/', UserProfileView.as_view(), name='get'),
    path('delete/<str:user_id>/', DeleteUserView.as_view(), name='delete'),
    path('<str:user_id>/', UserUpdateView.as_view(), name='update'),
]
