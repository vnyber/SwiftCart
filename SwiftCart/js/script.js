// Initialize or retrieve cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to add items to the cart
function addToCart(name, price, imageUrl) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item exists
    } else {
        cart.push({ name, price, imageUrl, quantity: 1 }); // Add new item
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    alert(`${name} has been added to your cart.`); // Confirmation message
}

// Function to update the cart display on the cart page
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = ''; // Clear existing items
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        let itemPrice = item.price ? item.price : 0;
        
        const itemElement = document.createElement("div");
        itemElement.className = "d-flex align-items-center border-bottom py-2";
        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; margin-right: 10px;">
            <span>${item.name} - £${itemPrice.toFixed(2)} x ${item.quantity}</span>
            <button class="btn btn-danger btn-sm ms-auto remove-from-cart" data-index="${index}">Remove</button>
        `;

        cartItemsContainer.appendChild(itemElement);
        total += itemPrice * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2); // Update total price

    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            removeFromCart(index);
        });
    });
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item at index
    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    updateCart(); // Refresh cart display
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem("cart"); // Remove cart from localStorage
    cart = []; // Empty cart array
    updateCart(); // Refresh cart display
}

// Function to load cart on checkout page with real-time total
function loadCheckoutPage() {
    const checkoutItemsContainer = document.getElementById("checkout-items");
    const checkoutTotal = document.getElementById("checkout-total");

    // Ensure elements exist before proceeding
    if (!checkoutItemsContainer || !checkoutTotal) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    checkoutItemsContainer.innerHTML = ''; // Clear existing items
    let total = 0;

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        checkoutTotal.textContent = "0.00";
        return;
    }

    cart.forEach(item => {
        let itemPrice = item.price ? item.price : 0;
        
        const itemElement = document.createElement("div");
        itemElement.className = "d-flex align-items-center border-bottom py-2";
        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; margin-right: 10px;">
            <span>${item.name} - £${itemPrice.toFixed(2)} x ${item.quantity}</span>
        `;

        checkoutItemsContainer.appendChild(itemElement);
        total += itemPrice * item.quantity;
    });

    // Update total price in real time
    checkoutTotal.textContent = total.toFixed(2);
}
// Function to handle the checkout process with a prompt
function handleCheckout(event) {
    event.preventDefault(); // Prevent form submission

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }

    let orderSummary = cart.map(item => `${item.quantity} x ${item.name} - £${(item.price * item.quantity).toFixed(2)}`).join("\n");
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    let confirmation = confirm(`Your Order:\n\n${orderSummary}\n\nTotal: £${total}\n\nDo you want to proceed?`);

    if (confirmation) {
        alert("Thank you for your purchase! Your order has been placed.");
        clearCart(); // Empty cart after order
        window.location.href = "index.html"; // Redirect to home page (update as needed)
    }
}

// Ensure the cart is updated when the cart page loads
if (document.getElementById("cart-items")) {
    updateCart();
}

// Ensure the checkout page loads the cart and adds event listener for checkout
if (window.location.pathname.includes("checkout.html")) {
    loadCheckoutPage();

    // Attach event listener to the checkout form
    const checkoutForm = document.querySelector("form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", handleCheckout);
    }
}
