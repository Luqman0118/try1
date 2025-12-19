from django.urls import path
from .views import (
    RegisterView,
    profile,
    skill_list,
    experience_list,
    download_cv,
    public_profiles,
    admin_student_list,
    admin_toggle_student,
    AdminTokenObtainPairView
)
 

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Auth & Mahasiswa
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('profile/', profile),
    path('skills/', skill_list),
    path('experiences/', experience_list),
    path('cv/', download_cv),

    # Public access
    path('', public_profiles),

    # Admin
    path('admin/students/', admin_student_list),
    path('admin/students/<int:user_id>/toggle/', admin_toggle_student),
    path('admin/login/', AdminTokenObtainPairView.as_view(), name="admin-login"),

]
