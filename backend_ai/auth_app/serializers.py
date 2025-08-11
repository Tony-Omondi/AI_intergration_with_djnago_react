from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Event, ClothingItem, OTP

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['code']

class ClothingItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = ClothingItem
        fields = ['id', 'category', 'name', 'image', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_category(self, value):
        valid_categories = [choice[0] for choice in ClothingItem.CATEGORY_CHOICES]
        if value not in valid_categories:
            raise serializers.ValidationError("Invalid category.")
        return value

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'location', 'date', 'event_notes', 'weather_notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'age', 'gender', 'location', 'profile_picture', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False  # User is inactive until OTP verification
        )
        UserProfile.objects.create(
            user=user,
            full_name=profile_data.get('full_name', ''),
            age=profile_data.get('age'),
            gender=profile_data.get('gender'),
            location=profile_data.get('location')
        )
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['full_name'] = instance.profile.full_name
        return representation