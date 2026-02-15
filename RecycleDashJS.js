// ================= LOGIN CHECK =================
const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedUser || loggedUser.role !== "recycler") {
    window.location.href = "Login.html";
}

// ================= WELCOME =================
const welcomeRecycler = document.getElementById("welcomeRecycler");
if (welcomeRecycler) {
    welcomeRecycler.innerText = "Welcome, " + loggedUser.name;
}

// ================= LOGOUT =================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
}

// ================= LOAD REQUESTS =================
function loadRequests() {
    const wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const tbody = document.querySelector("#recyclerTable tbody");
    if (!tbody) return;

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
            actionButton = `
                <button onclick="acceptRequest(${index})">Accept</button>
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

    const totalRequests = document.getElementById("totalRequests");
    const pendingRequests = document.getElementById("pendingRequests");
    const acceptedRequests = document.getElementById("acceptedRequests");
    const completedRequests = document.getElementById("completedRequests");

    if (totalRequests) totalRequests.innerText = wastes.length;
    if (pendingRequests) pendingRequests.innerText = pending;
    if (acceptedRequests) acceptedRequests.innerText = accepted;
    if (completedRequests) completedRequests.innerText = completed;
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

// ================= SAFE TAB TOGGLE =================
const recycleTab = document.getElementById("recycleTab");
const reuseTab = document.getElementById("reuseTab");

if (recycleTab && reuseTab) {

    const recyclingSection = document.getElementById("recyclingSection");
    const reuseSection = document.getElementById("reuseSection");

    recycleTab.addEventListener("click", () => {
        if (recyclingSection && reuseSection) {
            recyclingSection.style.display = "block";
            reuseSection.style.display = "none";
        }

        recycleTab.classList.add("active-tab");
        reuseTab.classList.remove("active-tab");
    });

    reuseTab.addEventListener("click", () => {
        if (recyclingSection && reuseSection) {
            recyclingSection.style.display = "none";
            reuseSection.style.display = "block";
        }

        reuseTab.classList.add("active-tab");
        recycleTab.classList.remove("active-tab");
    });
}
