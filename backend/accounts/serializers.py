from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MahasiswaProfile, Skill, Experience


# ============================
# REGISTER USER
# ============================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


# ============================
# MAHASISWA PROFILE
# ============================
class MahasiswaProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MahasiswaProfile
        fields = [
            'id',
            'nim',
            'nama_lengkap',
            'prodi',
            'deskripsi',
            'photo',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]


# ============================
# SKILL
# ============================
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            'id',
            'name',
        ]
        read_only_fields = ['id']


# ============================
# EXPERIENCE
# ============================
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id',
            'title',
            'description',
        ]
        read_only_fields = ['id']
