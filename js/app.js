let listProductHTML = document.querySelector('.listProduct'); 
let listCartHTML = document.querySelector('.listCart'); 
let iconCart = document.querySelector('.icon-cart'); 
let iconCartSpan = document.querySelector('.icon-cart span'); 
let body = document.querySelector('body'); 
let closeCart = document.querySelector('.close'); 
let products = [];
let cart = []; 


iconCart.addEventListener('click', () => { //arrow function that adds and eventListener of click to the iconCart class(cart image)
    body.classList.toggle('showCart') //adds the showCart class (which opens the cart) to the body when clicking on the iconCart
});
closeCart.addEventListener('click', () => { //arrow function that adds addEventListener of click to the closeCart class (button)
    body.classList.toggle('showCart') //toggles the showCart function when clicking the close cart button.  Toggling this class when it is already active causes it to deactivate
})

const addDataToHTML = () => { //defines the variable addDataToHTML using const and an arrow function
    if(products.length > 0) { //if statement stating that if the length of the products array is greater than zero,
        products.forEach(product => { //invoke the forEach method to loop through the products array, and defines the product parameter as a placeholder of the function (for when its called later)
            let newProduct = document.createElement('div'); //uses the createElement method to create a new div within the html.  Uses let to declare that div as the variable newProduct
            newProduct.dataset.id = product.id; //defines the id of the products
            newProduct.classList.add('item'); //uses the classList.add method to add the "item" class to the newProduct varirable (which is = to the div element just created)

            //the code below uses the innerHTML method to create the products on the index page.  
            newProduct.innerHTML = ` 

            <a href="${product.link}"><img class="cart-item-picture" src="${product.image}"></a>

            <h2>${product.name}</h2>
            <h3>${product.house}</h3>
            <div class="price">$${product.price}</div>
                <button class="addCart">
                    Add To Cart
                </button>
                `;
                listProductHTML.appendChild(newProduct); //uses the appendChild method to add any new products to the html of the index page
        })
    }
}

listProductHTML.addEventListener('click', (event) => { //adds a click eventListener to the listProductHTML variable (which is the products on the index page) and establishes the event parameter
    let positionClick = event.target; //uses the target property on the event parameter to return the element where the event (click) occured and saves it as the positionClick variable
    if(positionClick.classList.contains('addCart')){ //if statement that checks if the the position click (where the user clicked) is = to addCart class (button)
        let product_id  = positionClick.parentElement.dataset.id;// if they did, save the dataset id of the product where they clicked the button, and save it to the product_id variable
       addToCart(product_id); // run the add to cart function on the product_id (the product the user chose to add to the cart)
    }
})

const addToCart = (product_id) => { //arrow function declaring the addToCart function with the product_id parameter
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id); //
    if(cart.length <= 0) { //if the length of the cart array is less than or equal to zero,
        cart = [{ // then add to the cart:
            product_id: product_id, // the product id
            quantity: 1 // and + 1 to the quantity
        }]
    } else if(positionThisProductInCart < 0){ //if the first condition is false, check if the positionThisProductInCart is less than 0 (check if the product the user selected is in the cart or not)
        cart.push({ //if it is not in the cart, add it to the cart
           product_id: product_id,
           quantity: 1
        });
    } else { //if first two constions are false,
       cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1; //increases the quantity in the cart by 1
    }
    addCartToHTML(); //function that adds cart array to HTML
    addCartToMemory(); //function that saves the cart data to memory
}
    const addCartToMemory = () => { //declares the addCartToMemory variable
        localStorage.setItem('cart', JSON.stringify(cart)); //
    }
const addCartToHTML = () => { //declares the addCartToHTML variable
    listCartHTML.innerHTML = ''; //declares the innerHTML of the listCartHTML to be blank
    let totalQuantity = 0; //declares the totalQuantity variable = 0
    if(cart.length > 0) { //if the length of the cart array is less than 0,
        cart.forEach (item => { //loops through the cart array and runs the following functions on each
            totalQuantity = totalQuantity + item.quantity; //update the totalQuantity variable to totalQuantity + the quantity of the item variable?
        let newCart = document.createElement('div'); //create a new HTML element and save it as newCart variable
        newCart.classList.add('item'); //add the item class to the newCart class list
        newCart.dataset.id =  item.product_id; //
        let positionProduct = products.findIndex((value) => value.id == item.product_id); //
        let info = products[positionProduct];
        listCartHTML.appendChild(newCart);
        newCart.innerHTML = `
        <div class="img">
            <img src="${info.image}">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">$${info.price * item.quantity}</div>
        <div class="quantity">
            <span class="minus"><</span>
            <span>${item.quantity}</span>
            <span class="plus">></span>
    </div>
        `;  
    })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity +1;
                break;

                default: 
                    let valueChange = cart[positionItemInCart].quantity - 1;
                    if (valueChange > 0) {
                        cart[positionItemInCart].quantity = valueChange;
                    } else {
                        cart.splice(positionItemInCart, 1);
                    }
                    break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

const initApp = () => {
    //get data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
        
        // get cart from memory
        if(localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem
            ('cart'));
            addCartToHTML();
        }

    })
}
initApp();
