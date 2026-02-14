document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const location = document.getElementById("location").value;
    const role = document.getElementById("role").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        alert("User already exists with this email!");
        return;
    }

    const newUser = {
        name,
        email,
        password,
        location,
        role
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");

    if (role === "user") {
        window.location.href = "UserDashboard.html";
    } else {
        window.location.href = "RecyclerDashboard.html";
    }
});
