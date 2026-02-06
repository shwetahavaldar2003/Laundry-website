let cart = [];
let total = 0;

// Initialize EmailJS
(function() {
    emailjs.init('N7s6R1wITL6dSwvjv'); // Replace with your actual public key
})();

function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

function toggleCart(button, service, price) {
    let index = cart.findIndex(item => item.service === service);

    if (index === -1) {
        cart.push({ service, price });
        total += price;
        button.innerText = "Remove Now";
        button.classList.remove("add");
        button.classList.add("remove");
    } else {
        total -= cart[index].price;
        cart.splice(index, 1);
        button.innerText = "Add Items";
        button.classList.remove("remove");
        button.classList.add("add");
    }

    updateCartUI();
}

function updateCartUI() {
    const noItems = document.getElementById("no-items");
    const cartTable = document.getElementById("cart-table");
    const cartItems = document.getElementById("cartItems");
    
    if (cart.length === 0) {
        noItems.style.display = "block";
        cartTable.style.display = "none";
    } else {
        noItems.style.display = "none";
        cartTable.style.display = "table";
        
        cartItems.innerHTML = "";
        cart.forEach((item, index) => {
            cartItems.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.service}</td>
                    <td>₹${item.price}</td>
                    <td><button class="remove" onclick="removeFromCart('${item.service}')">Remove</button></td>
                </tr>
            `;
        });
    }

    document.getElementById("totalAmount").innerText = `₹${total}`;
}

function removeFromCart(serviceName) {
    let index = cart.findIndex(item => item.service === serviceName);
    if (index !== -1) {
        total -= cart[index].price;
        cart.splice(index, 1);
        
        const buttons = document.querySelectorAll('.service-item button');
        buttons.forEach(button => {
            if (button.onclick.toString().includes(serviceName)) {
                button.innerText = "Add Items";
                button.classList.remove("remove");
                button.classList.add("add");
            }
        });
        
        updateCartUI();
    }
}

function bookService() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (!fullName || !email || !phone) {
        alert('Please fill in all fields');
        return;
    }
    
    if (cart.length === 0) {
        alert('Please add at least one service');
        return;
    }
    
    // EmailJS send email
    const templateParams = {
        to_email: email, // Send to user's email
        user_name: fullName,
        user_email: email,
        user_phone: phone,
        services: cart.map(item => `${item.service} - ₹${item.price}`).join(', '),
        total_amount: total
    };
    
    // Send actual email using EmailJS
    emailjs.send('service_xdi79lj', 'template_fufhm88', templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            
            // Clear cart after successful email
            clearCart();
            
            const msg = document.getElementById('successMsg');
            msg.style.display = 'block';
            
            document.getElementById('fullName').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            
            setTimeout(() => {
                msg.style.display = 'none';
            }, 5000);
        }, function(error) {
            console.log('Email failed to send:', error);
            alert('Failed to send email. Please try again.');
        });
}

function clearCart() {
    cart = [];
    total = 0;
    
    // Reset all buttons to "Add Items"
    const buttons = document.querySelectorAll('.service-item button');
    buttons.forEach(button => {
        button.innerText = "Add Items";
        button.classList.remove("remove");
        button.classList.add("add");
    });
    
    updateCartUI();
}

function subscribeNewsletter() {
    const name = document.getElementById('newsletter-name').value;
    const email = document.getElementById('newsletter-email').value;
    
    if (!name || !email) {
        alert('Please fill in both name and email fields');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    const successMsg = document.getElementById('newsletter-success');
    successMsg.style.display = 'block';
    
    document.getElementById('newsletter-name').value = '';
    document.getElementById('newsletter-email').value = '';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});