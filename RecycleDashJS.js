import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedUser || loggedUser.role !== "recycler") {
    window.location.href = "Login.html";
}

const welcomeRecycler = document.getElementById("welcomeRecycler");
if (welcomeRecycler) {
    welcomeRecycler.innerText = "Welcome, " + loggedUser.name;
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function loadRequests() {

    const wastesSnapshot = await getDocs(collection(db, "wastes"));
    const usersSnapshot = await getDocs(collection(db, "users"));

    const wastes = wastesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const users = usersSnapshot.docs.map(doc => doc.data());

    const tbody = document.querySelector("#recyclerTable tbody");
    tbody.innerHTML = "";

    let pending = 0;
    let accepted = 0;
    let completed = 0;

    const filteredWastes = wastes.filter(waste => {

        if (!loggedUser.recycleTypes.includes(waste.type)) return false;

        const distance = calculateDistance(
            loggedUser.latitude,
            loggedUser.longitude,
            waste.userLatitude,
            waste.userLongitude
        );

        return distance <= 5;
    });

    filteredWastes.forEach(waste => {

        const user = users.find(u => u.email === waste.userEmail);

        const distance = calculateDistance(
            loggedUser.latitude,
            loggedUser.longitude,
            waste.userLatitude,
            waste.userLongitude
        );

        const roundedDistance = distance.toFixed(2);

        if (waste.status === "Pending") pending++;
        if (waste.status === "Accepted") accepted++;
        if (waste.status === "Completed") completed++;

        let actionButton = "";

        if (waste.status === "Pending") {
            actionButton = `
                <button class="action-btn accept-btn" onclick="acceptRequest('${waste.id}')">Accept</button>
                <button class="action-btn deny-btn" onclick="denyRequest('${waste.id}')">Deny</button>`;
        } else if (waste.status === "Accepted") {
            actionButton = `
                <button class="action-btn complete-btn" onclick="completeRequest('${waste.id}')">Complete</button>`;
        } else {
            actionButton = "Done";
        }

        const row = `
            <tr>
                <td>${user ? user.name : "Unknown"}</td>
                <td>${waste.type}</td>
                <td>${waste.quantity}</td>
                <td>${waste.unit}</td>
                <td>${waste.date}</td>
                <td>${user ? user.location : "-"}</td>
                <td>${roundedDistance}</td>
                <td>
                    <span class="status status-${waste.status.toLowerCase()}">
                        ${waste.status}
                    </span>
                </td>
                <td>${actionButton}</td>
            </tr>
        `;

        tbody.innerHTML += row;
    });

    document.getElementById("totalRequests").innerText = filteredWastes.length;
    document.getElementById("pendingRequests").innerText = pending;
    document.getElementById("acceptedRequests").innerText = accepted;
    document.getElementById("completedRequests").innerText = completed;
}

async function acceptRequest(id) {
    await updateDoc(doc(db, "wastes", id), {
        status: "Accepted"
    });
    loadRequests();
}

async function completeRequest(id) {
    await updateDoc(doc(db, "wastes", id), {
        status: "Completed"
    });
    loadRequests();
}

async function denyRequest(id) {
    const reason = prompt("Enter reason for denial:");

    if (reason && reason.trim() !== "") {
        await updateDoc(doc(db, "wastes", id), {
            status: "Denied",
            denyReason: reason
        });
        loadRequests();
    } else {
        alert("Denial reason is required.");
    }
}

window.acceptRequest = acceptRequest;
window.completeRequest = completeRequest;
window.denyRequest = denyRequest;

loadRequests();
