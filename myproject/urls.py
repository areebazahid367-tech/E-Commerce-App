from django.contrib import admin
from django.urls import path
from myapp import views  
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ⚙️ Django Admin Dashboard Path
    path('admin/', admin.site.urls),

    # 🌐 Core Storefront Website Paths
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('products/', views.products, name='products'),
    path('cart/', views.cart, name='cart'),       
    path('orders/', views.orders, name='orders'),   
    path('checkout/', views.checkout, name='checkout'), # 🌟 Added securely inside global paths
    
    # 🔗 Static Navbar & Footer Link Placeholders
    path('contact/', views.home, name='contact'), 
    path('about/', views.home, name='about'),     
    path('login/', views.home, name='login'),     
    path('profile/', views.home, name='profile'), 
    path('logout/', views.home, name='logout'),   
    path('faq/', views.home, name='faq'),         
    path('privacy/', views.home, name='privacy'), 
    path('terms/', views.home, name='terms'),     
    
    # 🛒 Background Shopping Cart Interaction Logic Connection Row
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
        path('dashboard/', views.merchant_dashboard, name='merchant_dashboard'),
]

# 🖼️ Media Folder Image Pipeline Routing Connected Here
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



