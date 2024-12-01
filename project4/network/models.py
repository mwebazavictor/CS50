from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=255, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts",null=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return(f"Post is {self.content[:10]}")

class Like(models.Model):
    post = models.ForeignKey(Post,on_delete = models.CASCADE, related_name= 'likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes",null=False)
    
    
    def __str__(self):
        number_of_likes = self.post.likes.count()
        return (f"The post {self.post.content[:10]} by {self.user} has {number_of_likes} {'like' if number_of_likes == 1 else 'likes'}.")
