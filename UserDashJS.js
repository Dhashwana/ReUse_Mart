const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedUser || loggedUser.role !== "user") {
    window.location.href = "Login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});

const modal = document.getElementById("wasteModal");

document.getElementById("openModal").addEventListener("click", () => {
    modal.style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
});

document.getElementById("wasteForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const waste = {
        id: Date.now(),
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

    let wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    wastes.push(waste);
    localStorage.setItem("wastes", JSON.stringify(wastes));

    modal.style.display = "none";
    this.reset();
    loadWaste();
});

function deleteWaste(id) {
    let wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    wastes = wastes.filter(w => w.id !== id);
    localStorage.setItem("wastes", JSON.stringify(wastes));
    loadWaste();
}

function loadWaste() {
    const wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    const tbody = document.querySelector("#wasteTable tbody");

    tbody.innerHTML = "";

    const userWastes = wastes.filter(w => w.userEmail === loggedUser.email);

    let pending = 0;
    let completed = 0;

    userWastes.forEach(w => {

        if (w.status === "Pending") pending++;
        if (w.status === "Completed") completed++;

        let actionButton = "";

        if (w.status === "Pending") {
            actionButton = `<button class="action-btn delete-btn" onclick="deleteWaste(${w.id})">Delete</button>`;
        } else {
            actionButton = "-";
        }

        const row = `<tr>
            <td>${w.type}</td>
            <td>${w.quantity}</td>
            <td>${w.unit}</td>
            <td>${w.date}</td>
            <td>
                <span class="status status-${w.status.toLowerCase()}">
                    ${w.status}
                </span>
                ${w.status === "Denied" ? `<br><small>Reason: ${w.denyReason}</small>` : ""}
            </td>
            <td>${actionButton}</td>
        </tr>`;

        tbody.innerHTML += row;
    });

    document.getElementById("totalWaste").innerText = userWastes.length;
    document.getElementById("pendingWaste").innerText = pending;
    document.getElementById("completedWaste").innerText = completed;
}

loadWaste();
