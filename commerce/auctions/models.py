from typing import Any
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Listing(models.Model):
    # info on each listing
    name = models.CharField(max_length=63, null=False)
    image = models.ImageField()
    # description = models.CharField(max_length=500, null=False)

    def __str__(self):
        return f"{self.name}"

class Bid(models.Model):
    placer = models.ManyToManyField(User, related_name="purchasers")
    price = models.IntegerField(null=False)
    item = models.ForeignKey(Listing, on_delete=models.PROTECT, related_name="item")

    def __str__(self):
        return f"{self.item} for {self.price}"

# class Comment(models.Model):
#     commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")  
#     descriptions = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments") 

#     def __str__(self):
#         return f"{self.commenter} says {self.descriptions}"
