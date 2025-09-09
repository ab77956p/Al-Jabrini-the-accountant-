// بيانات المنتجات
const products = [
    { id: 1, name: "أرز بسمتي", price: 25.00, image: "images/products/rice.jpg" },
    { id: 2, name: "زيت زيتون", price: 35.00, image: "images/products/olive-oil.jpg" },
    { id: 3, name: "سكر", price: 15.00, image: "images/products/sugar.jpg" },
    { id: 4, name: "دقيق", price: 12.00, image: "images/products/flour.jpg" },
    { id: 5, name: "معكرونة", price: 8.00, image: "images/products/pasta.jpg" },
    { id: 6, name: "حليب", price: 6.00, image: "images/products/milk.jpg" },
    { id: 7, name: "بيض", price: 18.00, image: "images/products/eggs.jpg" },
    { id: 8, name: "خبز", price: 4.00, image: "images/products/bread.jpg" },
    { id: 9, name: "ماء معدني", price: 2.00, image: "images/products/water.jpg" },
    { id: 10, name: "شاي", price: 20.00, image: "images/products/tea.jpg" },
    { id: 11, name: "قهوة", price: 30.00, image: "images/products/coffee.jpg" },
    { id: 12, name: "منظفات", price: 22.00, image: "images/products/cleaner.jpg" }
];

// سلة التسوق
let cart = [];

// عناصر DOM
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// عرض المنتجات
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">صورة ${product.name}</div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)} ريال</div>
                <button class="add-to-cart" data-id="${product.id}">إضافة إلى السلة</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // إضافة مستمعي الأحداث لأزرار إضافة إلى السلة
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// إضافة منتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`تم إضافة ${product.name} إلى السلة`);
}

// تحديث عربة التسوق
function updateCart() {
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCartMessage);
    } else {
        emptyCartMessage.style.display = 'none';
        
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div>${item.name}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">حذف</button>
                    </div>
                </div>
                <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} ريال</div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // إضافة مستمعي الأحداث لأزرار الكمية والحذف
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                changeQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                changeQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity < 1) {
                    e.target.value = 1;
                    setQuantity(id, 1);
                } else {
                    setQuantity(id, newQuantity);
                }
            });
        });
    }
    
    updateSummary();
}

// تغيير كمية المنتج
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        
        updateCart();
    }
}

// تعيين كمية محددة للمنتج
function setQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        updateCart();
    }
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification(`تم إزالة ${item.name} من السلة`);
}

// تحديث الملخص
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    subtotalElement.textContent = subtotal.toFixed(2) + ' ريال';
    taxElement.textContent = tax.toFixed(2) + ' ريال';
    totalElement.textContent = total.toFixed(2) + ' ريال';
}

// إشعار للمستخدم
function showNotification(message) {
    // إنشاء عنصر الإشعار إذا لم يكن موجوداً
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notification);
    }
    
    // تعيين الرسالة وإظهار الإشعار
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

// إتمام عملية الشراء
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('سلة التسوق فارغة. أضف بعض المنتجات أولاً.');
        return;
    }
    
    // هنا يمكنك إضافة رمز لإرسال الطلب إلى الخادم
    showNotification('شكراً لطلبك! تم إرسال طلبك بنجاح وسيتم التوصيل خلال 24 ساعة.');
    
    // تفريغ السلة بعد الشراء
    cart = [];
    updateCart();
});

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
});