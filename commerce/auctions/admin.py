from django.contrib import admin
from .models import *

#  Control what data I see from different models(inside site admin)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','image')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('get_commenters', 'item','comment')
    def get_commenters(self, obj):
        return ", ".join([commenter.username for commenter in obj.commenter.all()])
    get_commenters.short_description = 'Commenter'

class BidAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_placers', 'price','item')
    def get_placers(self, obj):
        return ", ".join([placer.username for placer in obj.placer.all()])
    get_placers.short_description = 'Placers'

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Bid, BidAdmin)
