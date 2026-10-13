from django.db import models

class Register(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, default="")
    password = models.CharField(max_length=100, default="")
    
    def __str__(self):
        return self.name

    class Meta:
        db_table = 'myapp_register'

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    image = models.ImageField(upload_to='products/')
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(Register, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.user.name}'s Cart"

# 🌟 NEW DATABASE MODEL: Stores full customer details and shipping logs
class CustomerOrder(models.Model):
    user = models.ForeignKey(Register, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=50)
    payment_method = models.CharField(max_length=50)
    total_amount = models.FloatField()
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Processing Delivery")

    def __str__(self):
        return f"Order #{self.id} by {self.full_name}"


