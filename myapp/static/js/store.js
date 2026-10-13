// arebHub E-Commerce Client-side Store Controller
(function() {
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('arebhub_cart')) || [];
        } catch(e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('arebhub_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    function getOrders() {
        try {
            return JSON.parse(localStorage.getItem('arebhub_orders')) || [];
        } catch(e) {
            return [];
        }
    }

    function saveOrders(orders) {
        localStorage.setItem('arebhub_orders', JSON.stringify(orders));
    }

    function showToast(message) {
        let toast = document.getElementById('store-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'store-toast';
            toast.style.cssText = 'position: fixed; top: 25px; right: 25px; background: #10b981; color: white; padding: 14px 24px; border-radius: 12px; font-weight: bold; font-size: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000; transition: all 0.3s ease; opacity: 0; transform: translateY(-20px); pointer-events: none;';
            document.body.appendChild(toast);
        }
        toast.innerHTML = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
        }, 2500);
    }

    function updateCartBadge() {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartLinks = document.querySelectorAll('a[href*="cart"]');
        cartLinks.forEach(link => {
            if (link.innerHTML.includes('Cart')) {
                link.innerHTML = `🛒 Cart (${totalCount})`;
            }
        });
    }

    function updateNavUser() {
        const username = localStorage.getItem('arebhub_user');
        const userPanels = document.querySelectorAll('nav div:last-child');
        userPanels.forEach(panel => {
            if (username) {
                panel.innerHTML = `
                    <div style="background: rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 30px; color: white; font-weight: 700; font-size: 14px; border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; gap: 8px;">
                        👤 ${username}
                    </div>
                    <a href="#" id="logout-btn" style="background: white; color: #7c3aed; padding: 8px 20px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">Logout</a>
                `;
                const logoutBtn = panel.querySelector('#logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('arebhub_user');
                        window.location.reload();
                    });
                }
            }
        });
    }

    function handleAddToCartClicks() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('a[href*="add-to-cart"], a[href*="add_to_cart"]');
            if (btn) {
                e.preventDefault();
                const card = btn.closest('div[style*="background: #fff"], div[style*="background: white"]');
                let name = "Product";
                let price = 0;
                let image = "";
                let id = btn.getAttribute('href').replace(/\D/g, '') || String(Date.now());

                if (card) {
                    const nameEl = card.querySelector('h3');
                    if (nameEl) name = nameEl.textContent.trim();
                    const priceEl = card.querySelector('p[style*="color: #7c3aed"], p[style*="font-weight: bold"]');
                    if (priceEl) {
                        const match = priceEl.textContent.match(/[\d\.]+/);
                        if (match) price = parseFloat(match[0]);
                    }
                    const imgEl = card.querySelector('img');
                    if (imgEl) image = imgEl.src;
                }

                const cart = getCart();
                const existing = cart.find(item => item.id === id);
                if (existing) {
                    existing.quantity = (existing.quantity || 1) + 1;
                } else {
                    cart.push({ id, name, price, image, quantity: 1 });
                }
                saveCart(cart);
                showToast(`🛍️ Added <b>${name}</b> to cart!`);
            }
        });
    }

    function setupCartPage() {
        if (!window.location.pathname.includes('/cart')) return;
        const cart = getCart();
        const mainContainer = document.querySelector('.content-wrapper > div');
        if (!mainContainer) return;

        if (cart.length === 0) {
            mainContainer.innerHTML = `
                <h2 style="font-size: 32px; color: #1e293b; font-weight: 700; margin-bottom: 30px;">🛒 Your Shopping Cart</h2>
                <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <p style="color: #64748b; font-size: 18px; margin-bottom: 20px;">Your shopping cart is completely empty!</p>
                    <a href="/products/" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Shop For Products</a>
                </div>
            `;
            return;
        }

        let total = 0;
        let rowsHtml = '';
        cart.forEach((item, index) => {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            total += itemTotal;
            rowsHtml += `
                <tr style="border-bottom: 1px solid #f1f5f9; color: #334155;">
                    <td style="padding: 15px 10px; display: flex; align-items: center; gap: 15px;">
                        ${item.image ? `<img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">` : ''}
                        <span style="font-weight: 600;">${item.name}</span>
                    </td>
                    <td style="padding: 15px 10px;">$${item.price}</td>
                    <td style="padding: 15px 10px;">
                        <button class="cart-qty-btn" data-index="${index}" data-delta="-1" style="border: 1px solid #cbd5e1; background: #f1f5f9; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="font-weight: 600; margin: 0 10px;">${item.quantity || 1}</span>
                        <button class="cart-qty-btn" data-index="${index}" data-delta="1" style="border: 1px solid #cbd5e1; background: #f1f5f9; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                    </td>
                    <td style="padding: 15px 10px; font-weight: bold; color: #7c3aed;">$${itemTotal}</td>
                    <td style="padding: 15px 10px;">
                        <button class="cart-del-btn" data-index="${index}" style="border: none; background: #fee2e2; color: #ef4444; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">✕ Remove</button>
                    </td>
                </tr>
            `;
        });

        mainContainer.innerHTML = `
            <h2 style="font-size: 32px; color: #1e293b; font-weight: 700; margin-bottom: 30px;">🛒 Your Shopping Cart</h2>
            <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 20px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600;">
                            <th style="padding: 15px 10px;">Product</th>
                            <th style="padding: 15px 10px;">Price</th>
                            <th style="padding: 15px 10px;">Quantity</th>
                            <th style="padding: 15px 10px;">Subtotal</th>
                            <th style="padding: 15px 10px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div style="text-align: right; margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 20px;">
                    <h3 style="font-size: 24px; color: #1e293b; margin-bottom: 15px;">Grand Total: <span style="color: #7c3aed;">$${total}</span></h3>
                    <a href="/checkout/" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);">Proceed to Checkout ➡️</a>
                </div>
            </div>
        `;

        mainContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const delta = parseInt(btn.dataset.delta);
                const cart = getCart();
                if (cart[idx]) {
                    cart[idx].quantity = (cart[idx].quantity || 1) + delta;
                    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
                    saveCart(cart);
                    setupCartPage();
                }
            });
        });

        mainContainer.querySelectorAll('.cart-del-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const cart = getCart();
                cart.splice(idx, 1);
                saveCart(cart);
                setupCartPage();
            });
        });
    }

    function setupCheckoutPage() {
        if (!window.location.pathname.includes('/checkout')) return;
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        const form = document.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = form.querySelector('input[name="full_name"]')?.value || 'Guest Customer';
            const address = form.querySelector('input[name="address"]')?.value || 'Store Address';
            const phone = form.querySelector('input[name="phone"]')?.value || '';
            const payment = form.querySelector('input[name="payment_method"]:checked')?.value || 'cod';

            const orders = getOrders();
            const newOrder = {
                id: orders.length + 1,
                full_name: fullName,
                address: address,
                phone: phone,
                payment_method: payment,
                total_amount: total,
                status: 'Confirmed',
                date: new Date().toLocaleDateString()
            };
            orders.unshift(newOrder);
            saveOrders(orders);
            saveCart([]);

            showToast("🎉 Order Placed Successfully!");
            setTimeout(() => {
                window.location.href = '/orders/';
            }, 800);
        });
    }

    function setupOrdersPage() {
        if (!window.location.pathname.includes('/orders')) return;
        const orders = getOrders();
        const container = document.querySelector('.content-wrapper > div');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = `
                <h2 style="font-size: 32px; color: #1e293b; font-weight: 800; margin-bottom: 30px; letter-spacing: -0.5px;">📦 Your Order History</h2>
                <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
                    <p style="color: #64748b; font-size: 18px; margin-bottom: 20px;">You haven't placed any store orders yet!</p>
                    <a href="/products/" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Browse Store Catalog</a>
                </div>
            `;
            return;
        }

        let rowsHtml = '';
        orders.forEach(item => {
            rowsHtml += `
                <tr style="border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 15px;">
                    <td style="padding: 20px 10px; font-weight: 700; color: #7c3aed;">#ORD-00${item.id}</td>
                    <td style="padding: 20px 10px; font-weight: 600;">${item.full_name}</td>
                    <td style="padding: 20px 10px; font-weight: bold; text-transform: uppercase; color: #475569;">${item.payment_method}</td>
                    <td style="padding: 20px 10px; font-weight: 800; color: #16a34a; font-size: 16px;">$${item.total_amount}</td>
                    <td style="padding: 20px 10px;">
                        <span style="background: #eff6ff; color: #1d4ed8; padding: 5px 14px; border-radius: 30px; font-size: 13px; font-weight: 700; border: 1px solid #bfdbfe;">${item.status}</span>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = `
            <div style="background: #dcfce7; border-left: 6px solid #16a34a; padding: 15px 20px; border-radius: 8px; color: #14532d; font-weight: 600; margin-bottom: 35px; box-shadow: 0 4px 10px rgba(22, 163, 74, 0.08);">
                🎉 Congratulations! Your orders are tracked in real-time!
            </div>
            <h2 style="font-size: 32px; color: #1e293b; font-weight: 800; margin-bottom: 30px; letter-spacing: -0.5px;">📦 Your Order History</h2>
            <div style="background: white; border-radius: 16px; box-shadow: 0 4px 25px rgba(15, 23, 42, 0.04); padding: 25px; border: 1px solid #e2e8f0; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 700; font-size: 15px;">
                            <th style="padding: 15px 10px;">Order ID</th>
                            <th style="padding: 15px 10px;">Customer Name</th>
                            <th style="padding: 15px 10px;">Payment Method</th>
                            <th style="padding: 15px 10px;">Total Amount</th>
                            <th style="padding: 15px 10px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </div>
        `;
    }

    function setupAuth() {
        const form = document.querySelector('form');
        if (!form) return;
        const isRegister = window.location.pathname.includes('/register');
        const isLogin = window.location.pathname.includes('/login');

        if (isRegister || isLogin) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[name="username"]') || form.querySelector('input[name="email"]');
                const name = nameInput ? nameInput.value.split('@')[0] : 'User';
                localStorage.setItem('arebhub_user', name);
                showToast(`Welcome back, ${name}!`);
                setTimeout(() => {
                    window.location.href = '/products/';
                }, 700);
            });
        }
    }

    function setupCategoryFilter() {
        if (!window.location.pathname.includes('/products')) return;
        const params = new URLSearchParams(window.location.search);
        const selected = params.get('category');
        if (!selected) return;

        const categoryHeaders = document.querySelectorAll('h2');
        categoryHeaders.forEach(h2 => {
            const catName = h2.textContent.toLowerCase();
            const grid = h2.nextElementSibling;
            if (catName.includes(selected.toLowerCase())) {
                h2.style.display = 'block';
                if (grid) grid.style.display = 'grid';
            } else if (catName.includes('collection')) {
                h2.style.display = 'none';
                if (grid) grid.style.display = 'none';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        updateCartBadge();
        updateNavUser();
        handleAddToCartClicks();
        setupCartPage();
        setupCheckoutPage();
        setupOrdersPage();
        setupAuth();
        setupCategoryFilter();
    });
})();
