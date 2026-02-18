import { db } from "./firebase.js";
import { collection, addDoc, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {

    const roleSelect = document.getElementById("role");
    const recyclerOptions = document.getElementById("recyclerOptions");
    const form = document.getElementById("registerForm");

    roleSelect.addEventListener("change", function () {
        if (this.value === "recycler") {
            recyclerOptions.style.display = "block";
        } else {
            recyclerOptions.style.display = "none";
        }
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const location = document.getElementById("location").value.trim();
        const role = document.getElementById("role").value;

        const usersRef = collection(db, "users");

        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("User already exists with this email!");
            return;
        }

        let recycleTypes = [];
        if (role === "recycler") {
            const checkboxes = document.querySelectorAll("#recycleTypes input[type='checkbox']:checked");
            recycleTypes = Array.from(checkboxes).map(cb => cb.value);

            if (recycleTypes.length === 0) {
                alert("Please select at least one material you recycle.");
                return;
            }
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const newUser = {
                name,
                email,
                password,
                location,
                role,
                recycleTypes: role === "recycler" ? recycleTypes : [],
                latitude,
                longitude
            };

            await addDoc(usersRef, newUser);

            localStorage.setItem("loggedInUser", JSON.stringify(newUser));

            alert("Registration successful!");

            if (role === "user") {
                window.location.href = "UserDashboard.html";
            } else {
                window.location.href = "RecyclerDashboard.html";
            }

        }, function () {
            alert("Location access is required for registration.");
        });

    });

});
