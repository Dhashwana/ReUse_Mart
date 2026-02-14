const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedUser || loggedUser.role !== "recycler") {
    window.location.href = "login.html";
}

document.getElementById("welcomeRecycler").innerText =
    "Welcome, " + loggedUser.name;

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});

function loadRequests() {
    const wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const tbody = document.querySelector("#recyclerTable tbody");
    tbody.innerHTML = "";

    let pending = 0;
    let accepted = 0;
    let completed = 0;

    wastes.forEach((waste, index) => {

        const user = users.find(u => u.email === waste.userEmail);

        if (waste.status === "Pending") pending++;
        if (waste.status === "Accepted") accepted++;
        if (waste.status === "Completed") completed++;

        let actionButton = "";

        if (waste.status === "Pending") {
            actionButton = 
            `<button onclick="acceptRequest(${index})">Accept</button>
            <button onclick="denyRequest(${index})">Deny</button>`;

        } else if (waste.status === "Accepted") {
            actionButton = `<button onclick="completeRequest(${index})">Mark Completed</button>`;
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

    document.getElementById("totalRequests").innerText = wastes.length;
    document.getElementById("pendingRequests").innerText = pending;
    document.getElementById("acceptedRequests").innerText = accepted;
    document.getElementById("completedRequests").innerText = completed;
}

function acceptRequest(index) {
    let wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    wastes[index].status = "Accepted";
    localStorage.setItem("wastes", JSON.stringify(wastes));
    loadRequests();
}

function completeRequest(index) {
    let wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    wastes[index].status = "Completed";
    localStorage.setItem("wastes", JSON.stringify(wastes));
    loadRequests();
}

function denyRequest(index) {
    let wastes = JSON.parse(localStorage.getItem("wastes")) || [];

    const reason = prompt("Enter reason for denial:");

    if (reason && reason.trim() !== "") {
        wastes[index].status = "Denied";
        wastes[index].denyReason = reason;
        localStorage.setItem("wastes", JSON.stringify(wastes));
        loadRequests();
    } else {
        alert("Denial reason is required.");
    }
}

loadRequests();