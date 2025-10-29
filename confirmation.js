document.addEventListener("DOMContentLoaded", () => {
    const orderData = JSON.parse(localStorage.getItem("orderData"));
    const container = document.getElementById("order-confirmation");

    if (!orderData) {
        container.innerHTML = `
            <div class="confirmation-card" style="text-align:center; padding:40px;">
                <h3 style="color:#e74c3c;">⚠️ No Order Found</h3>
                <p>You haven’t placed an order yet.</p>
                <a href="shop.html" style="padding:12px 25px; background:#088178; color:#fff; border-radius:50px; text-decoration:none;">⬅️ Back to Shop</a>
            </div>`;
        return;
    }

    // Build order items
    let itemsHTML = "";
    let total = 0;
    orderData.items.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemsHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₦${item.price.toLocaleString()}</td>
                <td>₦${subtotal.toLocaleString()}</td>
            </tr>`;
    });

    container.innerHTML = `
        <div class="confirmation-card">
            <img src="IMAGES/LOGO/ABAMADE LOGO.png" alt="Aba Made Logo" width="100">
            <h3>🎉 Order Placed Successfully!</h3>
            <p>Your order number is <strong>${orderData.id}</strong></p>

            <div class="order-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${orderData.name}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Phone:</strong> ${orderData.phone}</p>
                <p><strong>Address:</strong> ${orderData.address}</p>
            </div>

            <div class="order-summary">
                <h4>Order Summary</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                <p class="total">Total: <strong>${orderData.total}</strong></p>
            </div>

            <div class="buttons" style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <a href="shop.html" class="shop-now-btn" style="background:#088178;">⬅️ Back to Shop</a>
                <a href="index.html" class="shop-now-btn" style="background:#ff7b00;">🏠 Home</a>
                <button class="shop-now-btn print-btn" onclick="window.print()" style="background:#27ae60;">🖨️ Print Receipt</button>
            </div>
        </div>
    `;

    // Clear orderData after printing
    window.addEventListener("afterprint", () => {
        localStorage.removeItem("orderData");
    });
});
