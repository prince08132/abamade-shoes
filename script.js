document.addEventListener("DOMContentLoaded", () => {

  // --- Navbar toggle ---
  const bar = document.getElementById('bar');
  const close = document.getElementById('close');
  const nav = document.getElementById('navbar');
  if (bar) bar.addEventListener('click', () => nav.classList.add('active'));
  if (close) close.addEventListener('click', () => nav.classList.remove('active'));

  // --- Cart Functions ---
  function addToCart(name, price, image, size, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.name === name && item.size === size);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ name, price, image, size, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
    updateCartCount();
    renderCart();
  }

  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index].quantity > 1) cart[index].quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function updateQuantity(index, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = Math.max(1, parseInt(newQty));
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tableBody = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>Your cart is empty</td></tr>";
    } else {
      cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        tableBody.innerHTML += `
          <tr>
            <td><button onclick="removeFromCart(${index})" class="remove-btn"><i class='fa-regular fa-circle-xmark'></i></button></td>
            <td><img src='${item.image}' width='70'></td>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>
              <div class="quantity-controls">
                <button onclick="decreaseQuantity(${index})">-</button>
                <input type="number" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
                <button onclick="increaseQuantity(${index})">+</button>
              </div>
            </td>
            <td>₦${itemSubtotal.toLocaleString()}</td>
          </tr>`;
      });
    }

    if (subtotalEl) subtotalEl.textContent = "₦" + subtotal.toLocaleString();
    if (totalEl) totalEl.textContent = "₦" + subtotal.toLocaleString();
    updateCartCount();
  }

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = count;
  }

  renderCart();
  updateCartCount();

  // --- Related Products ---
  const randomRelated = window.randomRelated || [];
  const relatedContainer = document.getElementById('related-container');
  if (relatedContainer && randomRelated.length) {
    randomRelated.forEach(p => {
      const item = document.createElement("div");
      item.classList.add("pro");
      item.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="des">
          <span>Aba Made</span>
          <h5>${p.name}</h5>
          <h4>₦${p.price.toLocaleString()}</h4>
        </div>
        <select class="related-size">
          <option value="">Select Size</option>
          <option>40</option><option>41</option><option>42</option>
          <option>43</option><option>44</option><option>45</option>
        </select>
        <button class="related-cart"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
      `;

      item.addEventListener("click", e => {
        if (!e.target.closest(".related-cart") && !e.target.closest(".related-size")) {
          localStorage.setItem("productImage", p.image);
          localStorage.setItem("productName", p.name);
          localStorage.setItem("productPrice", p.price);
          window.location.href = "sproduct.html";
        }
      });

      const cartBtn = item.querySelector(".related-cart");
      const sizeSelect = item.querySelector(".related-size");
      cartBtn.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        const selectedSize = sizeSelect.value;
        if (!selectedSize) return alert("Please select a size!");
        addToCart(p.name, p.price, p.image, selectedSize);
        alert(`${p.name} (Size ${selectedSize}) added to cart!`);
      });

      relatedContainer.appendChild(item);
    });
  }

  // --- Coupon Code ---
  const coupons = { "SAVE10": 0.10, "SAVE20": 0.20 };
  const applyBtn = document.getElementById('apply-coupon');
  const couponInput = document.getElementById('coupon-code');
  const message = document.getElementById('coupon-message');
  const totalDisplay = document.getElementById('total-price');

  if (applyBtn && couponInput && message && totalDisplay) {
    applyBtn.addEventListener('click', () => {
      const code = couponInput.value.toUpperCase().trim();
      let total = parseFloat(totalDisplay.textContent.replace(/,/g, '')) || 0;
      if (coupons[code]) {
        const discount = total * coupons[code];
        const newTotal = total - discount;
        totalDisplay.textContent = newTotal.toLocaleString();
        message.textContent = `✅ Coupon applied! You saved ₦${discount.toLocaleString()}.`;
        message.style.color = "green";
      } else {
        message.textContent = "❌ Invalid coupon code.";
        message.style.color = "red";
      }
    });
  }

});

// --- Open product page ---
function viewProduct(image, name, price) {
  localStorage.setItem('productImage', image);
  localStorage.setItem('productName', name);
  localStorage.setItem('productPrice', price);
  window.location.href = 'sproduct.html';
}

// Make cart functions global for HTML onclicks
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      addToCart(productId);
    });
  });
});
window.removeFromCart = removeFromCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantity = updateQuantity;

document.addEventListener("DOMContentLoaded", () => {

  const checkoutItems = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");
  const cartCountEl = document.getElementById("cart-count");
  const couponCodeInput = document.getElementById("coupon-code");
  const applyCouponBtn = document.getElementById("apply-coupon");
  const couponMessage = document.getElementById("coupon-message");
  const placeOrderBtn = document.getElementById("place-order");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let discount = 0;

  // Render Cart Items
  function renderCart() {
    checkoutItems.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      checkoutItems.innerHTML = `<tr><td colspan="7" style="text-align:center;">Your cart is empty</td></tr>`;
    } else {
      cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        checkoutItems.innerHTML += `
          <tr>
            <td><button onclick="removeItem(${index})" class="remove-btn"><i class='fa-regular fa-circle-xmark'></i></button></td>
            <td><img src="${item.image}" width="70"></td>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>${item.quantity}</td>
            <td>₦${itemSubtotal.toLocaleString()}</td>
          </tr>`;
      });
    }

    subtotalEl.textContent = "₦" + subtotal.toLocaleString();
    totalEl.textContent = "₦" + (subtotal - discount).toLocaleString();
    cartCountEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
  }

  // Remove Item
  window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // Coupon functionality
  const coupons = { "SAVE10": 0.10, "SAVE20": 0.20 };
  applyCouponBtn.addEventListener("click", () => {
    const code = couponCodeInput.value.toUpperCase().trim();
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (coupons[code]) {
      discount = subtotal * coupons[code];
      totalEl.textContent = "₦" + (subtotal - discount).toLocaleString();
      couponMessage.textContent = `✅ Coupon applied! You saved ₦${discount.toLocaleString()}.`;
      couponMessage.style.color = "green";
    } else {
      couponMessage.textContent = "❌ Invalid coupon code.";
      couponMessage.style.color = "red";
      discount = 0;
      totalEl.textContent = "₦" + subtotal.toLocaleString();
    }
  });

  // Place Order
  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("✅ Order placed successfully!");
    localStorage.removeItem("cart");
    renderCart();
    window.location.href = "index.html";
  });

  renderCart();
});


// --- Load cart items from localStorage ---
const fragment = document.createDocumentFragment();

cart.forEach(item => {
  const div = document.createElement('div');
  div.className = 'checkout-item';
  div.innerHTML = `
    <p>${item.name}</p>
    <p>${item.price}</p>
  `;
  fragment.appendChild(div);
});

checkoutItems.appendChild(fragment);


// --- Display cart items ---
function renderCheckoutItems() {
  checkoutItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const subtotalItem = item.price * item.quantity;
    subtotal += subtotalItem;

    const row = `
      <tr>
        <td><i class="fa-solid fa-trash remove-item" data-index="${index}" style="cursor:pointer;"></i></td>
        <td><img src="${item.image}" width="70" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>${item.size || '-'}</td>
        <td>₦${item.price.toLocaleString()}</td>
        <td>${item.quantity}</td>
        <td>₦${subtotalItem.toLocaleString()}</td>
      </tr>
    `;
    checkoutItems.insertAdjacentHTML('beforeend', row);
  });

  totalAmount = subtotal;
  checkoutSubtotal.textContent = `₦${subtotal.toLocaleString()}`;
  checkoutTotal.textContent = `₦${subtotal.toLocaleString()}`;
}

// --- Remove item ---
checkoutItems.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckoutItems();
  }
});

// --- Apply coupon ---
document.getElementById('apply-coupon').addEventListener('click', () => {
  const code = document.getElementById('coupon-code').value.trim().toLowerCase();
  const message = document.getElementById('coupon-message');
  let total = totalAmount;

  if (code === 'abamade10') {
    const discount = total * 0.1;
    total -= discount;
    message.textContent = '✅ Coupon applied! 10% discount.';
  } else if (code) {
    message.textContent = '❌ Invalid coupon code.';
  } else {
    message.textContent = '';
  }

  checkoutTotal.textContent = `₦${total.toLocaleString()}`;
  totalAmount = total;
});

// --- Place order ---
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !email || !phone || !address) {
    alert('Please fill all your details.');
    return;
  }

  // Simulate order placement
  alert(`🎉 Thank you, ${name}! Your order has been placed successfully.\n\nA confirmation has been sent to ${email}.`);

  localStorage.removeItem('cart');
  window.location.href = 'shop.html';
});

renderCheckoutItems();

// --- Load cart items from localStorage ---
const checkoutItems = document.getElementById('checkout-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalAmount = 0;

// --- Display cart items ---
function renderCheckoutItems() {
  checkoutItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const subtotalItem = item.price * item.quantity;
    subtotal += subtotalItem;

    const row = `
      <tr>
        <td><i class="fa-solid fa-trash remove-item" data-index="${index}" style="cursor:pointer;"></i></td>
        <td><img src="${item.image}" width="70" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>${item.size || '-'}</td>
        <td>₦${item.price.toLocaleString()}</td>
        <td>${item.quantity}</td>
        <td>₦${subtotalItem.toLocaleString()}</td>
      </tr>
    `;
    checkoutItems.insertAdjacentHTML('beforeend', row);
  });

  totalAmount = subtotal;
  checkoutSubtotal.textContent = `₦${subtotal.toLocaleString()}`;
  checkoutTotal.textContent = `₦${subtotal.toLocaleString()}`;
}

// --- Remove item ---
checkoutItems.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckoutItems();
  }
});

// --- Apply coupon ---
document.getElementById('apply-coupon').addEventListener('click', () => {
  const code = document.getElementById('coupon-code').value.trim().toLowerCase();
  const message = document.getElementById('coupon-message');
  let total = totalAmount;

  if (code === 'abamade10') {
    const discount = total * 0.1;
    total -= discount;
    message.textContent = '✅ Coupon applied! 10% discount.';
  } else if (code) {
    message.textContent = '❌ Invalid coupon code.';
  } else {
    message.textContent = '';
  }

  checkoutTotal.textContent = `₦${total.toLocaleString()}`;
  totalAmount = total;
});

// --- Auto-fill buyer info ---
function loadBuyerInfo() {
  const savedInfo = JSON.parse(localStorage.getItem('buyerInfo'));
  if (savedInfo) {
    document.getElementById('name').value = savedInfo.name || '';
    document.getElementById('email').value = savedInfo.email || '';
    document.getElementById('phone').value = savedInfo.phone || '';
    document.getElementById('address').value = savedInfo.address || '';
  }
}

// --- Save buyer info automatically when typing ---
['name', 'email', 'phone', 'address'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const buyerInfo = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      address: document.getElementById('address').value.trim()
    };
    localStorage.setItem('buyerInfo', JSON.stringify(buyerInfo));
  });
});

// --- Place order ---
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !email || !phone || !address) {
    alert('Please fill all your details.');
    return;
  }

  // Save buyer info before clearing
  const buyerInfo = { name, email, phone, address };
  localStorage.setItem('buyerInfo', JSON.stringify(buyerInfo));

  // Simulate order placement
  alert(`🎉 Thank you, ${name}! Your order has been placed successfully.\n\nA confirmation has been sent to ${email}.`);

  localStorage.removeItem('cart');
  window.location.href = 'shop.html';
});

// --- Initialize everything ---
renderCheckoutItems();
loadBuyerInfo();

