from django.db import models
from account.models import User

# Create your models here.
class Message(models.Model):
    body=models.TextField()
    sent_by=models.CharField(max_length=225)
    created_at=models.DateTimeField(auto_now_add=True)
    created_by=models.ForeignKey(User,blank=True,null=True,on_delete=models.SET_NULL)

    class Meta:
        ordering=('created_at',)

    def __str__(self) -> str:
        return f'{self.sent_by}'
    


class Room (models.Model):
    WAITING='waiting'
    ACTIVE='active'
    CLOSED='closed'
    CHOICES_STATUS=[
        (WAITING,'Waiting'),
        (ACTIVE,'Active'),
        (CLOSED,'Closed'),
    ]
    uuid=models.CharField(max_length=255)
    client=models.CharField(max_length=255)
    agent=models.ForeignKey(User,blank=True,null=True,on_delete=models.SET_NULL,related_name='rooms')
    messages=models.ManyToManyField(Message,blank=True)
    url=models.CharField(max_length=255,blank=True,null=True)
    status=models.CharField(max_length=20,choices=CHOICES_STATUS,default=WAITING)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering=('-created_at',)

    def __str__(self) -> str:
        return f'{self.client} - {self.uuid}'