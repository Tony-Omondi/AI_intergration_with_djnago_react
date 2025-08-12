from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
import random
import string

# Enforce email uniqueness on the User model
User._meta.get_field('email')._unique = True

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    purpose = models.CharField(max_length=20, choices=[('signup', 'Signup'), ('password_reset', 'Password Reset')])

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = ''.join(random.choices(string.digits, k=6))
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def clean(self):
        if not self.is_valid():
            raise ValidationError('OTP has expired.')
        super().clean()

    def __str__(self):
        return f"OTP {self.code} for {self.user.email} ({self.purpose})"

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('tshirts', 'T-shirts'),
        ('shirts_blouses', 'Shirts/Blouses'),
        ('sweaters_hoodies', 'Sweaters/Hoodies'),
        ('tank_tops_camisoles', 'Tank Tops/Camisoles'),
        ('jeans', 'Jeans'),
        ('trousers_pants', 'Trousers/Pants'),
        ('shorts', 'Shorts'),
        ('skirts', 'Skirts'),
        ('dresses', 'Dresses'),
        ('jumpsuits', 'Jumpsuits'),
        ('jackets', 'Jackets'),
        ('coats', 'Coats'),
        ('blazers', 'Blazers'),
        ('raincoats_trenchcoats', 'Raincoats/Trenchcoats'),
        ('hats_caps', 'Hats/Caps'),
        ('scarves', 'Scarves'),
        ('belts', 'Belts'),
        ('gloves', 'Gloves'),
        ('sunglasses', 'Sunglasses'),
        ('jewelry', 'Jewelry'),
        ('sneakers', 'Sneakers'),
        ('boots', 'Boots'),
        ('sandals', 'Sandals'),
        ('formal_shoes', 'Formal Shoes'),
        ('underwear', 'Underwear'),
        ('bras', 'Bras'),
        ('pajamas', 'Pajamas'),
        ('lounge_sets', 'Lounge Sets'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clothing_items')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='closet_images/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()}) - {self.user.username}"

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    date = models.DateField()
    event_notes = models.TextField(blank=True, null=True)
    weather_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.date}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name}'s Profile"

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='recommendations')
    clothing_items = models.ManyToManyField(ClothingItem, related_name='recommendations')
    description = models.TextField()  # AI-generated recommendation text
    weather_info = models.TextField(blank=True)  # Weather data at the time of recommendation
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommendation for {self.event.name} - {self.user.username}"