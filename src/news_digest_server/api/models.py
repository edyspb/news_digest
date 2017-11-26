from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return '<Category {name}>'.format(name=self.name)


class News(models.Model):
    title = models.CharField(max_length=512)
    description = models.TextField()
    pub_date = models.DateTimeField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return '<News {title}>'.format(title=self.title)
