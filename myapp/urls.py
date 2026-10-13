from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('products/', views.products, name='products'),
    path('cart/', views.cart, name='cart'),       
    path('orders/', views.orders, name='orders'),   
    path('checkout/', views.checkout, name='checkout'), # 🌟 Added securely inside app paths
    path('contact/', views.home, name='contact'), 
    path('about/', views.home, name='about'),     
    path('login/', views.home, name='login'),     
    path('profile/', views.home, name='profile'), 
    path('logout/', views.home, name='logout'),   
    path('faq/', views.home, name='faq'),         
    path('privacy/', views.home, name='privacy'), 
    path('terms/', views.home, name='terms'),     
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
]

