from django.db import models
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User

from django.db import models
from django.contrib.auth.models import User

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('jackets', 'Jackets'),
        ('shirts', 'Shirts'),
        ('pants', 'Pants'),
        ('shoes', 'Shoes'),
        ('accessories', 'Accessories'),
        ('dresses', 'Dresses'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clothing_items')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='closet_images/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category}) - {self.user.username}"

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
    location = models.CharField(max_length=100, null=True, blank=True)  # e.g., "Nairobi, Kenya"
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name}'s Profile"