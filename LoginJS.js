document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => 
        user.email === email && user.password === password
    );

    if (validUser) {

        // Store entire logged-in user object
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        // Redirect based on role
        if (validUser.role === "user") {
            window.location.href = "UserDashboard.html";
        } else {
            window.location.href = "RecyclerDashboard.html";
        }

    } else {
        alert("Invalid email or password!");
    }
});
