import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedUser || loggedUser.role !== "user") {
    window.location.href = "Login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});

const modal = document.getElementById("wasteModal");
const cardGrid = document.getElementById("wasteCardGrid");

document.getElementById("openModal").addEventListener("click", () => {
    modal.style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
});

document.getElementById("wasteForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const waste = {
        userEmail: loggedUser.email,
        type: document.getElementById("wasteType").value,
        quantity: document.getElementById("quantity").value,
        unit: document.getElementById("unit").value,
        date: document.getElementById("pickupDate").value,
        notes: document.getElementById("notes").value,
        status: "Pending",
        userLatitude: loggedUser.latitude,
        userLongitude: loggedUser.longitude
    };

    await addDoc(collection(db, "wastes"), waste);

    modal.style.display = "none";
    this.reset();
    loadWaste();
});

async function deleteWaste(id) {
    await deleteDoc(doc(db, "wastes", id));
    loadWaste();
}

async function loadWaste() {
    const q = query(
        collection(db, "wastes"),
        where("userEmail", "==", loggedUser.email)
    );

    const querySnapshot = await getDocs(q);

    cardGrid.innerHTML = "";

    let pending = 0;
    let completed = 0;

    querySnapshot.forEach((docSnap) => {
        const w = docSnap.data();
        const id = docSnap.id;

        if (w.status === "Pending") pending++;
        if (w.status === "Completed") completed++;

        let actions = "";

        if (w.status === "Pending") {
            actions = `
                <div class="actions">
                    <button class="action-btn delete-btn" onclick="deleteWaste('${id}')">Delete</button>
                </div>`;
        } 
        else if (w.status === "Accepted") {
            actions = `
                <div class="actions">
                    <div><strong>Recycler Phone:</strong> ${w.recyclerPhone || "-"}</div>
                </div>`;
        }

        const card = `
            <div class="request-card">
                <h4>${w.type}</h4>
                <p><strong>Quantity:</strong> ${w.quantity} ${w.unit}</p>
                <p><strong>Date:</strong> ${w.date}</p>
                <p>
                    <span class="status status-${w.status.toLowerCase()}">
                        ${w.status}
                    </span>
                </p>
                ${w.status === "Denied" ? `<p><strong>Reason:</strong> ${w.denyReason}</p>` : ""}
                ${actions}
            </div>
        `;

        cardGrid.innerHTML += card;
    });

    document.getElementById("totalWaste").innerText = querySnapshot.size;
    document.getElementById("pendingWaste").innerText = pending;
    document.getElementById("completedWaste").innerText = completed;
}

window.deleteWaste = deleteWaste;

loadWaste();
