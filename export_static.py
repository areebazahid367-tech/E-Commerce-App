import os
import sys
import shutil
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

import django
django.setup()

from django.test import RequestFactory
from django.template.loader import render_to_string
from myapp.models import Category, Product, CustomerOrder

def build():
    dist_dir = BASE_DIR / 'dist'
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    dist_dir.mkdir(parents=True, exist_ok=True)

    # 1. Copy Static Files
    static_src = BASE_DIR / 'myapp' / 'static'
    static_dest = dist_dir / 'static'
    if static_src.exists():
        shutil.copytree(static_src, static_dest)
        print("[OK] Static assets copied to dist/static")

    # 2. Copy Media Files
    media_src = BASE_DIR / 'media'
    media_dest = dist_dir / 'media'
    if media_src.exists():
        shutil.copytree(media_src, media_dest)
        print("[OK] Media assets copied to dist/media")

    rf = RequestFactory()
    all_categories = Category.objects.all()
    all_orders = CustomerOrder.objects.all()

    # Route definitions and templates
    routes = [
        ('/', 'home.html', {}, 'index.html'),
        ('/products/', 'products.html', {'categories': all_categories}, 'products/index.html'),
        ('/cart/', 'cart.html', {'cart_items': [], 'total_price': 0}, 'cart/index.html'),
        ('/checkout/', 'checkout.html', {'total_price': 0}, 'checkout/index.html'),
        ('/orders/', 'orders.html', {'order_items': all_orders}, 'orders/index.html'),
        ('/about/', 'about.html', {}, 'about/index.html'),
        ('/contact/', 'contact.html', {}, 'contact/index.html'),
        ('/faq/', 'faq.html', {}, 'faq/index.html'),
        ('/privacy/', 'privacy.html', {}, 'privacy/index.html'),
        ('/login/', 'login.html', {}, 'login/index.html'),
        ('/register/', 'register.html', {}, 'register/index.html'),
        ('/dashboard/', 'merchant_dashboard.html', {'categories': all_categories, 'orders': all_orders}, 'dashboard/index.html'),
        ('/404/', '404.html', {}, '404.html'),
    ]

    for path, template_name, context, output_rel in routes:
        req = rf.get(path)
        req.session = {}
        rendered = render_to_string(template_name, context=context, request=req)
        
        out_file = dist_dir / output_rel
        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(rendered, encoding='utf-8')
        print(f"[OK] Rendered {path} -> dist/{output_rel}")

    print("\n[SUCCESS] Netlify static site export complete in dist/!")

if __name__ == '__main__':
    build()
