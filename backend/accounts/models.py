from django.db import models
from django.contrib.auth.models import User

class MahasiswaProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    nim = models.CharField(max_length=20, blank=True)  # ✅
    nama_lengkap = models.CharField(max_length=100)
    prodi = models.CharField(max_length=100)
    deskripsi = models.TextField(blank=True)

    photo = models.ImageField(
        upload_to='profile/',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.nama_lengkap


class Skill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name



class Experience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="experiences")
    title = models.CharField(max_length=150)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
