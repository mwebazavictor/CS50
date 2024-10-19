from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import *

class ListingForm(forms.Form):
    name = forms.CharField()
    image = forms.ImageField()
    description = forms.CharField(widget=forms.Textarea(attrs={'cols':30, 'rows':3}))


class Commenting(forms.Form):
    comment= forms.CharField(widget=forms.Textarea(attrs={'cols':30,'rows':3}))


def index(request):
    listings=Listing.objects.all()
    content = []
    for listing in listings:
        name = listing.name
        image = listing.image.url
        description = listing.description
        listing_details={"name":name, "image":image,"description": description}
        content.append(listing_details)
    return render(request, "auctions/index.html", {"listings":content} )


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def add(request):
    if request.method == "POST":
        form = ListingForm(request.POST,request.FILES)
        if form.is_valid():
            title = form.cleaned_data['name']
            picture = form.cleaned_data['image']
            details = form.cleaned_data['description']
            try:
                new_listing = Listing.objects.create(name=title,image=picture,description=details)
                new_listing.save()
                return HttpResponseRedirect(reverse("index"))
            except IntegrityError:
                return render(request,"auctions/add", {"error":"Listing already exists."})
    else:        
        form = ListingForm()
    
    return render(request,"auctions/add.html" , {"form": form}) 