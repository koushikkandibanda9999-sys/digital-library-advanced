let products = [
  { name: "Headphones", price: 500 },
  { name: "Keyboard", price: 800 },
  { name: "Mouse", price: 300 },
  { name: "Monitor", price: 5000 },
  { name: "Laptop", price: 40000 },
  { name: "Mobile", price: 15000 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load products
if (document.getElementById("products")) {
  displayProducts(products);
}

function displayProducts(list) {
  let container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach((p, index) => {
    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

function addToCart(index) {
  let product = products[index];

  let found = cart.find(item => item.name === product.name);

  if (found) {
    found.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  alert("Added to cart");
}

// Search
function searchProduct() {
  let value = document.getElementById("search").value.toLowerCase();
  let filtered = products.filter(p => p.name.toLowerCase().includes(value));
  displayProducts(filtered);
}

// CART PAGE
if (document.getElementById("cartList")) {
  loadCart();
}

function loadCart() {
  let list = document.getElementById("cartList");
  list.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${item.name} - ₹${item.price} × ${item.qty}
      <br>
      <button onclick="increase(${index})">+</button>
      <button onclick="decrease(${index})">-</button>
      <button onclick="removeItem(${index})">Remove</button>
    `;

    list.appendChild(li);

    total += item.price * item.qty;
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
}

function increase(i) {
  cart[i].qty++;
  saveCart();
  loadCart();
}

function decrease(i) {
  if (cart[i].qty > 1) {
    cart[i].qty--;
  } else {
    cart.splice(i, 1);
  }
  saveCart();
  loadCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  loadCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function checkout() {
  alert("Order Placed Successfully 🎉");
  cart = [];
  saveCart();
  loadCart();
}