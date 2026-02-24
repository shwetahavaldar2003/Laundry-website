var cartItems = [];
var totalPrice = 0;

(function(){
    emailjs.init('N7s6R1wITL6dSwvjv');
})();

function toggleMenu(){
    var nav = document.getElementById('nav');
    if(nav.style.display === 'flex'){
        nav.style.display = 'none';
    }else{
        nav.style.display = 'flex';
    }
}

function addToCart(btn, serviceName, price){
    var found = false;
    for(var i=0; i<cartItems.length; i++){
        if(cartItems[i].name === serviceName){
            found = true;
            break;
        }
    }
    
    if(found){
        removeItem(serviceName);
        btn.innerText = 'Add Items';
        btn.className = 'btn-add';
    }else{
        cartItems.push({name: serviceName, price: price});
        totalPrice = totalPrice + price;
        btn.innerText = 'Remove Now';
        btn.className = 'btn-remove';
        updateCart();
    }
}

function removeItem(serviceName){
    for(var i=0; i<cartItems.length; i++){
        if(cartItems[i].name === serviceName){
            totalPrice = totalPrice - cartItems[i].price;
            cartItems.splice(i, 1);
            break;
        }
    }
    updateCart();
}

function updateCart(){
    var empty = document.getElementById('empty');
    var table = document.getElementById('cartTable');
    var tbody = document.getElementById('cartBody');
    var total = document.getElementById('total');
    
    if(cartItems.length === 0){
        empty.style.display = 'block';
        table.style.display = 'none';
    }else{
        empty.style.display = 'none';
        table.style.display = 'table';
        
        tbody.innerHTML = '';
        for(var i=0; i<cartItems.length; i++){
            var row = '<tr>';
            row += '<td>' + (i+1) + '</td>';
            row += '<td>' + cartItems[i].name + '</td>';
            row += '<td>Rs.' + cartItems[i].price + '</td>';
            row += '<td><button class="btn-remove" onclick="deleteFromCart(\'' + cartItems[i].name + '\')">Remove</button></td>';
            row += '</tr>';
            tbody.innerHTML += row;
        }
    }
    
    total.innerText = 'Rs.' + totalPrice;
}

function deleteFromCart(serviceName){
    removeItem(serviceName);
    
    var buttons = document.querySelectorAll('.item button');
    for(var i=0; i<buttons.length; i++){
        var btnText = buttons[i].parentElement.querySelector('span').innerText;
        if(btnText === serviceName){
            buttons[i].innerText = 'Add Items';
            buttons[i].className = 'btn-add';
            break;
        }
    }
}

function bookNow(){
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    
    if(name === '' || email === '' || phone === ''){
        alert('Please fill all fields');
        return;
    }
    
    if(cartItems.length === 0){
        alert('Please add at least one service');
        return;
    }
    
    var serviceList = '';
    for(var i=0; i<cartItems.length; i++){
        serviceList += cartItems[i].name + ' - Rs.' + cartItems[i].price;
        if(i < cartItems.length - 1){
            serviceList += ', ';
        }
    }
    
    var params = {
        to_email: email,
        user_name: name,
        user_email: email,
        user_phone: phone,
        services: serviceList,
        total_amount: totalPrice
    };
    
    emailjs.send('service_xdi79lj', 'template_fufhm88', params)
        .then(function(response){
            console.log('Email sent', response);
            
            cartItems = [];
            totalPrice = 0;
            updateCart();
            
            var buttons = document.querySelectorAll('.item button');
            for(var i=0; i<buttons.length; i++){
                buttons[i].innerText = 'Add Items';
                buttons[i].className = 'btn-add';
            }
            
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            
            var success = document.getElementById('success');
            success.style.display = 'block';
            setTimeout(function(){
                success.style.display = 'none';
            }, 5000);
        }, function(error){
            console.log('Error', error);
            alert('Failed to send email. Please try again.');
        });
}

function subscribe(){
    var name = document.getElementById('newsName').value;
    var email = document.getElementById('newsEmail').value;
    
    if(name === '' || email === ''){
        alert('Please fill both fields');
        return;
    }
    
    if(email.indexOf('@') === -1){
        alert('Please enter valid email');
        return;
    }
    
    var success = document.getElementById('newsSuccess');
    success.style.display = 'block';
    
    document.getElementById('newsName').value = '';
    document.getElementById('newsEmail').value = '';
    
    setTimeout(function(){
        success.style.display = 'none';
    }, 5000);
}
