import { db } from "./firebase.js";
import { collection, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("Invalid email or password!");
        return;
    }

    let validUser = null;

    querySnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.password === password) {
            validUser = userData;
        }
    });

    if (!validUser) {
        alert("Invalid email or password!");
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(validUser));

    if (validUser.role === "user") {
        window.location.href = "UserDashboard.html";
    } else {
        window.location.href = "RecyclerDashboard.html";
    }
});
