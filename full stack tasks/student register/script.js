document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    document.getElementById("message").innerText =
        "Registration Successful! Welcome " + name + " (" + email + ")";
});