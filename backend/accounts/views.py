from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import MahasiswaProfile, Skill, Experience
from .serializers import (
    RegisterSerializer,
    MahasiswaProfileSerializer,
    SkillSerializer,
    ExperienceSerializer
)

from reportlab.pdfgen import canvas
import io

# ================================
# REGISTER
# ================================
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User berhasil dibuat"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================================
# MAHASISWA PROFILE
# ================================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def profile(request):
    profile = MahasiswaProfile.objects.filter(user=request.user).first()

    if request.method == 'GET':
        if not profile:
            return Response({}, status=200)
        serializer = MahasiswaProfileSerializer(profile)
        return Response(serializer.data, status=200)

    if profile:
        serializer = MahasiswaProfileSerializer(profile, data=request.data, partial=True)
    else:
        serializer = MahasiswaProfileSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=200)

    print("SERIALIZER ERROR:", serializer.errors)
    return Response(serializer.errors, status=400)


# ================================
# DOWNLOAD CV
# ================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_cv(request):
    profile = MahasiswaProfile.objects.get(user=request.user)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)

    p.setFont("Helvetica", 14)
    p.drawString(50, 800, f"Nama: {profile.nama_lengkap}")
    p.drawString(50, 770, f"Prodi: {profile.prodi}")
    p.drawString(50, 740, "Deskripsi:")
    p.drawString(50, 720, profile.deskripsi or "-")

    y = 680
    for skill in Skill.objects.filter(user=request.user):
        p.drawString(50, y, f"- {skill.name}")
        y -= 20

    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="CV.pdf")


# ================================
# SKILL & EXPERIENCE
# ================================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def skill_list(request):
    if request.method == 'GET':
        return Response(SkillSerializer(Skill.objects.filter(user=request.user), many=True).data)
    serializer = SkillSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def experience_list(request):
    if request.method == 'GET':
        return Response(ExperienceSerializer(Experience.objects.filter(user=request.user), many=True).data)
    serializer = ExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ================================
# PUBLIC PROFILES
# ================================
@api_view(['GET'])
@permission_classes([AllowAny])
def public_profiles(request):
    profiles = MahasiswaProfile.objects.all()
    data = []
    for p in profiles:
        skills = [s.name for s in Skill.objects.filter(user=p.user)]
        data.append({
            "id": p.id,
            "name": p.nama_lengkap,
            "prodi": p.prodi,
            "skills": skills,
            "email": p.user.email,
            "linkedin": "",  # optional field
            "github": "",    # optional field
            "created_at": p.created_at
        })
    return Response(data)


# ================================
# ADMIN VIEWS
# ================================
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_student_list(request):
    """
    Menampilkan semua mahasiswa untuk admin
    """
    users = User.objects.filter(is_staff=False)  # hanya mahasiswa
    data = []
    for u in users:
        profile = MahasiswaProfile.objects.filter(user=u).first()
        skills = [s.name for s in Skill.objects.filter(user=u)]
        data.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active,
            "nama_lengkap": profile.nama_lengkap if profile else "",
            "prodi": profile.prodi if profile else "",
            "skills": skills
        })
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_toggle_student(request, user_id):
    """
    Mengaktifkan / menonaktifkan mahasiswa
    """
    try:
        user = User.objects.get(id=user_id, is_staff=False)
    except User.DoesNotExist:
        return Response({"error": "User tidak ditemukan"}, status=404)

    user.is_active = not user.is_active
    user.save()
    return Response({"message": f"Status mahasiswa diubah menjadi {user.is_active}"})

# Custom serializer untuk admin
class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        if not user.is_staff:  # hanya admin
            raise Exception("Not admin")
        return super().get_token(user)

# Custom view
class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception:
            return Response({"detail": "Hanya admin yang bisa login"}, status=status.HTTP_401_UNAUTHORIZED)
