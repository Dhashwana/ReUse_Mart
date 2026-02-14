const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedUser || loggedUser.role !== "user") {
    window.location.href = "login.html";
}

document.getElementById("welcomeUser").innerText =
    "Welcome, " + loggedUser.name;

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});

const modal = document.getElementById("wasteModal");
document.getElementById("openModal").onclick = () => {
    modal.style.display = "flex";
};
document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
};

document.getElementById("wasteForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const waste = {
        userEmail: loggedUser.email,
        type: wasteType.value,
        quantity: quantity.value,
        unit: unit.value,
        date: pickupDate.value,
        notes: notes.value,
        status: "Pending"
    };

    let wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    wastes.push(waste);
    localStorage.setItem("wastes", JSON.stringify(wastes));

    modal.style.display = "none";
    this.reset();
    loadWaste();
});

function loadWaste() {
    const wastes = JSON.parse(localStorage.getItem("wastes")) || [];
    const tbody = document.querySelector("#wasteTable tbody");
    tbody.innerHTML = "";

    const userWastes = wastes.filter(w => w.userEmail === loggedUser.email);

    userWastes.forEach(w => {
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
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById("totalWaste").innerText = userWastes.length;
}

loadWaste();