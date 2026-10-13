from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Product, Category, Cart, Register, CustomerOrder

# 🏠 Homepage View
def home(request):
    return render(request, 'home.html')

# 🛒 Active Basket Shopping Cart View
def cart(request):
    user_email = request.session.get('email')
    if not user_email:
        messages.warning(request, "Please log in to view your shopping cart!")
        return redirect('register')
        
    user = get_object_or_404(Register, email=user_email)
    cart_items = Cart.objects.filter(user=user)
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    
    context = {
        'cart_items': cart_items,
        'total_price': total_price,
    }
    return render(request, 'cart.html', context)

# 📦 Shipping & Payment Page Form Layout View
def checkout(request):
    user_email = request.session.get('email')
    if not user_email:
        return redirect('register')
        
    user = get_object_or_404(Register, email=user_email)
    cart_items = Cart.objects.filter(user=user)
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    
    if request.method == "POST":
        full_name = request.POST.get('full_name')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        payment_method = request.POST.get('payment_method')
        
        CustomerOrder.objects.create(
            user=user, full_name=full_name, address=address,
            phone=phone, payment_method=payment_method, total_amount=total_price
        )
        
        cart_items.delete()
        messages.success(request, "Order Placed Successfully!")
        return redirect('orders')
        
    context = {'total_price': total_price}
    return render(request, 'checkout.html', context)

# 📝 Signup Registration Page Logic View
def register(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        Register.objects.create(name=name, email=email, password=password)
        
        request.session['email'] = email
        request.session['username'] = name
        
        messages.success(request, f"Welcome {name}! Your account was created.")
        return redirect('products')
        
    return render(request, 'register.html')

# 🛍️ Store Catalog View Filtered by Categories
def products(request):
    category_name = request.GET.get('category')
    
    if category_name:
        all_categories = Category.objects.filter(name__iexact=category_name)
    else:
        all_categories = Category.objects.all()
        
    context = {
        'categories': all_categories,
        'selected_category': category_name,
    }
    return render(request, 'products.html', context)

# 🛒 Add to Cart Database Action View
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    user_email = request.session.get('email')
    
    if not user_email:
        messages.warning(request, "Please log in first to add items to your cart!")
        return redirect('register')
        
    user = get_object_or_404(Register, email=user_email)
    cart_item, created = Cart.objects.get_or_create(user=user, product=product)
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
        
    messages.success(request, f"Added {product.name} to cart successfully!")
    return redirect('products')

# 📦 Order History Tracking View
def orders(request):
    user_email = request.session.get('email')
    if not user_email:
        messages.warning(request, "Please log in to check your order details!")
        return redirect('register')
        
    user = get_object_or_404(Register, email=user_email)
    user_orders = CustomerOrder.objects.filter(user=user)
    
    context = {
        'order_items': user_orders
    }
    return render(request, 'orders.html', context)

# 🖥️ Web Admin & Merchant Product Addition Control Panel View
def merchant_dashboard(request):
    all_orders = CustomerOrder.objects.all().order_by('-order_date')
    all_categories = Category.objects.all()
    
    if request.method == "POST":
        p_name = request.POST.get('product_name')
        p_price = request.POST.get('product_price')
        p_desc = request.POST.get('product_description')
        p_image = request.FILES.get('product_image')  
        cat_id = request.POST.get('category_id')
        
        category = get_object_or_404(Category, id=cat_id)
        
        Product.objects.create(
            name=p_name, price=p_price, description=p_desc,
            image=p_image, category=category
        )
        messages.success(request, "New product added to storefront catalog dynamically!")
        return redirect('products')
        
    context = {
        'orders': all_orders,
        'categories': all_categories
    }
    return render(request, 'merchant_dashboard.html', context)












