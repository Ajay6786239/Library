from django.db import models

class Books(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    des = models.TextField()

    class Meta:
        db_table = 'books'

    def __str__(self):
        return self.title
