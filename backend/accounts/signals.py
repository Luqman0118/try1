from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import MahasiswaProfile

@receiver(post_save, sender=User)
def create_mahasiswa_profile(sender, instance, created, **kwargs):
    if created:
        MahasiswaProfile.objects.create(user=instance)
