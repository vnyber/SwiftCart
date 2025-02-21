// Retrieve cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to calculate total price
function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
}

// Function to render cart items
function renderCartItems(container, cart, showRemoveButton = false) {
    container.innerHTML = cart.length === 0 ? "<p>Your cart is empty.</p>" : "";
    cart.forEach((item, index) => {
        let itemElement = document.createElement("div");
        itemElement.className = "d-flex align-items-center border-bottom py-2";
        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; margin-right: 10px;">
            <span>${item.name} - £${item.price.toFixed(2)} x ${item.quantity}</span>
            ${showRemoveButton ? `<button class="btn btn-danger btn-sm ms-auto remove-from-cart" data-index="${index}">Remove</button>` : ""}
        `;
        container.appendChild(itemElement);
    });

    if (showRemoveButton) {
        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", function () {
                removeFromCart(this.getAttribute("data-index"));
            });
        });
    }
}

// Function to add items to the cart
function addToCart(name, price, imageUrl) {
    let cart = getCart();
    let existingItem = cart.find(item => item.name === name);
    existingItem ? existingItem.quantity++ : cart.push({ name, price, imageUrl, quantity: 1 });
    saveCart(cart);
    alert(`${name} has been added to your cart.`);
}

// Function to update the cart display
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    let cart = getCart();
    renderCartItems(cartItemsContainer, cart, true);
    cartTotal.textContent = calculateTotal(cart);
}

// Function to remove an item from the cart
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCart();
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem("cart");
    updateCart();
}

// Function to load checkout page
function loadCheckoutPage() {
    const checkoutItemsContainer = document.getElementById("checkout-items");
    const checkoutTotal = document.getElementById("checkout-total");
    if (!checkoutItemsContainer || !checkoutTotal) return;
    let cart = getCart();
    renderCartItems(checkoutItemsContainer, cart);
    checkoutTotal.textContent = calculateTotal(cart);
}

// Function to handle checkout
function handleCheckout(event) {
    event.preventDefault();
    let cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }
    let orderSummary = cart.map(item => `${item.quantity} x ${item.name} - £${(item.price * item.quantity).toFixed(2)}`).join("\n");
    if (confirm(`Your Order:\n\n${orderSummary}\n\nTotal: £${calculateTotal(cart)}\n\nDo you want to proceed?`)) {
        alert("Thank you for your purchase! Your order has been placed.");
        clearCart();
        window.location.href = "index.html";
    }
}

// Load cart on appropriate pages
if (document.getElementById("cart-items")) updateCart();
if (window.location.pathname.includes("checkout.html")) {
    loadCheckoutPage();
    document.querySelector("form")?.addEventListener("submit", handleCheckout);
}
