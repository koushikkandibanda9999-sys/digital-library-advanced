let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

window.onload = function () {
  loadCart();
};

function addCart(name, price) {
  cart.push({ name, price });
  saveCart();
  loadCart();
}

function loadCart() {
  let cartList = document.getElementById("cartList");
  cartList.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerText = item.name + " - ₹" + item.price;

    let btn = document.createElement("button");
    btn.innerText = "Remove";
    btn.className = "remove-btn";

    btn.onclick = function () {
      removeItem(index);
    };

    li.appendChild(btn);
    cartList.appendChild(li);

    total += item.price;
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  loadCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}