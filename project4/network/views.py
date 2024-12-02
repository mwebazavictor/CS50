from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.db.models import F, Count
from django.db.models.expressions import RawSQL


from .models import *

class PostingForm(forms.Form):
    post= forms.CharField(widget=forms.Textarea(attrs={
        "class" : "new_post"
    }))

def posts_collection():
    original_date = """ 
    DATE_FORMAT('%Y-%m-%d, %I:%M %p', date) 
    """
    return list(Post.objects.annotate(number_of_likes = Count("likes")).annotate(poster = F("user__username")).annotate(usable_date=RawSQL(original_date, [])).values('content', 'poster', 'usable_date','number_of_likes'))

def api_view(request):
    Posts = posts_collection()
    return JsonResponse(Posts, safe=False)

def index(request):
    if request.method == "POST":
        ... 
    form = PostingForm()
    Posts = posts_collection()
    
    return render(request, "network/index.html",{"form":form,"posts":Posts})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
