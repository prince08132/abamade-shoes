// ==========================
// ===== Checkout Script =====
// ==========================

// ----- Elements -----
const checkoutItemsContainer = document.getElementById("checkout-items");
const subtotalElement = document.getElementById("checkout-subtotal");
const totalElement = document.getElementById("checkout-total");
const couponInput = document.getElementById("coupon-code");
const couponMessage = document.getElementById("coupon-message");
const applyCouponBtn = document.getElementById("apply-coupon");
const placeOrderBtn = document.getElementById("place-order");

// ----- Load Cart -----
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;

// ==========================
// ===== Display Checkout Items =====
function displayCheckoutItems() {
    checkoutItemsContainer.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    🛒 Your cart is empty. <a href="shop.html" class="empty-cart-link">Continue Shopping</a>
                </td>
            </tr>`;
        subtotalElement.textContent = "₦0";
        totalElement.textContent = "₦0";
        return;
    }

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><button class="remove-item" data-index="${index}" title="Remove"><i class="fa fa-trash"></i></button></td>
            <td><img src="${item.image}" alt="${item.name}" class="checkout-img"></td>
            <td>${item.name}</td>
            <td>${item.size || "—"}</td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>${item.quantity}</td>
            <td>₦${itemSubtotal.toLocaleString()}</td>
        `;
        checkoutItemsContainer.appendChild(row);
    });

    subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    totalElement.textContent = `₦${(subtotal - discount).toLocaleString()}`;
}

displayCheckoutItems();

// ==========================
// ===== Remove Cart Item =====
checkoutItemsContainer.addEventListener("click", (e) => {
    if (e.target.closest(".remove-item")) {
        const index = e.target.closest(".remove-item").dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCheckoutItems();
    }
});

// ==========================
// ===== Apply Coupon =====
applyCouponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (code === "ABAMADE10") {
        discount = subtotal * 0.1;
        couponMessage.style.color = "green";
        couponMessage.textContent = "🎉 Coupon applied! 10% off.";
    } else if (code === "") {
        discount = 0;
        couponMessage.textContent = "";
    } else {
        discount = 0;
        couponMessage.style.color = "red";
        couponMessage.textContent = "❌ Invalid coupon code.";
    }

    totalElement.textContent = `₦${(subtotal - discount).toLocaleString()}`;
});

// ==========================
// ===== Simulated Place Order =====
placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const cardExpiry = document.getElementById("card-expiry").value.trim();
    const cardCVV = document.getElementById("card-cvv").value.trim();

    // Validate customer info
    if (!name || !email || !phone || !address) {
        alert("⚠️ Please fill out all customer details.");
        return;
    }

    // Validate cart
    if (!cart.length) {
        alert("🛒 Your cart is empty.");
        return;
    }

    // Validate card info (basic)
    if (!cardNumber || !cardExpiry || !cardCVV) {
        alert("⚠️ Please fill out all debit card details.");
        return;
    }

    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ""))) {
        alert("⚠️ Enter a valid 16-digit card number.");
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert("⚠️ Enter a valid expiry date (MM/YY).");
        return;
    }

    if (!/^\d{3,4}$/.test(cardCVV)) {
        alert("⚠️ Enter a valid CVV.");
        return;
    }

    // Simulate payment success
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - discount;

    const order = {
        id: "ABAMADE-" + Math.floor(Math.random() * 1000000),
        name,
        email,
        phone,
        address,
        items: cart,
        total: "₦" + total.toLocaleString(),
        paymentMethod: "Debit Card (Simulated)",
        date: new Date().toLocaleString()
    };

    localStorage.setItem("orderData", JSON.stringify(order));
    localStorage.removeItem("cart");

    alert("✅ Payment successful! Redirecting to confirmation page...");
    window.location.href = "confirmation.html";
});
