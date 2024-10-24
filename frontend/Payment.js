// Function to start the countdown timer
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = `${minutes}:${seconds}`;

        // If the timer runs out
        if (--timer < 0) {
            clearInterval(interval);
            alert('Payment time expired!');
            window.location.href = 'index.html'; // Redirect to home page or another page
        }
    }, 1000);
}

// Window onload event to initialize the countdown and order summary
window.onload = function () {
    const fiveMinutes = 60 * 5; // Set timer duration (5 minutes)
    const display = document.querySelector('#countdown');
    startTimer(fiveMinutes, display);

    // Retrieve and display order summary and total amount from localStorage
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || [];
    const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

    const orderSummaryDiv = document.getElementById('order-summary');
    orderSummaryDiv.innerHTML = '';

    if (orderSummary.length === 0) {
        orderSummaryDiv.innerHTML = 'No items in cart';
    } else {
        orderSummary.forEach(cartItem => {
            orderSummaryDiv.innerHTML += `
                <div class="cart-item">
                    <span>${cartItem.item} - ₹${cartItem.price} x ${cartItem.quantity}</span>
                </div>`;
        });
    }

    document.getElementById('total-amount').textContent = `Total: ₹${totalAmount}`;
};

// Function to check if pickup time is set
function isPickupTimeSet() {
    const hours = document.getElementById('pickup-hours').value;
    const minutes = document.getElementById('pickup-minutes').value;
    return hours !== '' && minutes !== '';
}

// Function to handle UPI payment
function makeUPIPayment() {
    if (!isPickupTimeSet()) {
        alert("Please enter a pickup time before proceeding with UPI payment.");
        return;
    }
    // Redirect to UPI payment page or handle payment logic
    window.location.href = 'https://www.phonepe.com/'; // Replace with actual UPI payment URL
}

// Function to handle wallet payment
async function makeWalletPayment() {
    const totalAmount = parseFloat(document.getElementById('total-amount').innerText.replace('Total: ₹', '').trim());
    let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 0;

    // Check if the wallet balance is sufficient
    if (totalAmount <= walletBalance) {
        // Deduct the total amount from the wallet balance
        walletBalance -= totalAmount;

        // Update the wallet balance in localStorage
        localStorage.setItem('walletBalance', walletBalance.toFixed(2));

        // Store order summary and total amount in localStorage for the success page
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
        localStorage.setItem('orderTotal', totalAmount.toFixed(2)); // Store total amount for success page

        // Send order details to shop
        const orderDetails = {
            user: 'User Name', // Replace with actual user data
            foodItems: orderSummary,
            totalAmount: totalAmount,
            shop: 'Ur Choice'
        };
        sendOrderToShop(orderDetails);

        // Redirect to the order success page
        window.location.href = 'successful.html'; // Redirect to an order success page
    } else {
        alert("Insufficient wallet balance. Please add funds to your wallet or choose a different payment method.");
    }
}

// Function to send order to shop
function sendOrderToShop(orderDetails) {
    fetch('http://shop-website.com/api/order-receive', { // Replace with the actual shop's API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails) // Sending order details to the shop
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order sent to shop:', data);
        alert('Your order has been sent to the shop for processing!');
    })
    .catch(error => {
        console.error('Error sending order:', error);
    });
}

// Function to cancel the payment
function cancelPayment() {
    // Confirm before redirecting
    if (confirm('Are you sure you want to cancel the payment?')) {
        window.location.href = 'user.html'; // Redirect to home page or order page
    }
}
