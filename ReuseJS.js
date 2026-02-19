document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("reuseModal");
    const openBtn = document.querySelector(".add-btn");
    const closeBtn = document.getElementById("closeReuseModal");
    const form = document.getElementById("reuseForm");
    const cardGrid = document.querySelector(".card-grid");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Stop execution if user not logged in
    if (!loggedInUser) return;

    // Modal open/close safety
    if (openBtn && modal) {
        openBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    loadItems();

    function getItems() {
        const rawItems = JSON.parse(localStorage.getItem("reuseItems")) || [];

        return rawItems.map((item) => {
            // Backward compatibility for old structure
            if (!item.status) {
                if (item.claimed === true) {
                    item.status = "claimed";
                    item.claimedBy = item.claimedBy || "Someone";
                } else {
                    item.status = "available";
                }
            }

            if (typeof item.requestedBy === "undefined") item.requestedBy = null;
            if (typeof item.claimedBy === "undefined") item.claimedBy = null;

            return item;
        });
    }

    function saveItems(items) {
        localStorage.setItem("reuseItems", JSON.stringify(items));
    }

    function loadItems() {
        const items = getItems();
        saveItems(items); // persist normalized structure

        if (!cardGrid) return;

        cardGrid.innerHTML = "";

        items.forEach((item) => {
            addCardToUI(item);
        });
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const newItem = {
                id: Date.now(),
                title: document.getElementById("itemTitle").value.trim(),
                category: document.getElementById("itemCategory").value,
                condition: document.getElementById("itemCondition").value,
                location: document.getElementById("itemLocation").value.trim(),
                price: document.getElementById("itemPrice").value,
                owner: loggedInUser.email,
                status: "available",
                requestedBy: null,
                claimedBy: null
            };

            const items = getItems();
            items.push(newItem);
            saveItems(items);

            loadItems();
            form.reset();
            if (modal) modal.style.display = "none";
        });
    }

    function getStatusMarkup(item) {
        if (item.status === "available") {
            return `<span class="status-tag status-available">Available</span>`;
        }

        if (item.status === "requested") {
            const requestedText = item.requestedBy
                ? `Requested by ${item.requestedBy}`
                : "Requested";
            return `<span class="status-tag status-requested">${requestedText}</span>`;
        }

        const claimedText = item.claimedBy
            ? `Claimed by ${item.claimedBy}`
            : "Claimed";
        return `<span class="status-tag status-claimed">${claimedText}</span>`;
    }

    function addCardToUI(item) {
        const card = document.createElement("div");
        card.className = "item-card";

        const badge = Number(item.price) === 0
            ? `<div class="badge free">FREE</div>`
            : `<div class="badge price">₹ ${item.price}</div>`;

        const isOwner = item.owner === loggedInUser.email;
        const isRequester = item.requestedBy === loggedInUser.email;
        const isClaimer = item.claimedBy === loggedInUser.email;

        let actionButtons = "";

        if (isOwner) {
            if (item.status === "available") {
                actionButtons = `
                    <div class="action-row">
                        <button onclick="deleteItem(${item.id})" class="delete-btn">Delete</button>
                    </div>
                `;
            } else if (item.status === "requested") {
                actionButtons = `
                    <div class="action-row">
                        <button onclick="approveRequest(${item.id})" class="approve-btn">Approve</button>
                        <button onclick="rejectRequest(${item.id})" class="reject-btn">Reject</button>
                    </div>
                `;
            } else {
                actionButtons = `<span class="claimed-label">Item is claimed</span>`;
            }
        } else {
            if (item.status === "available") {
                actionButtons = `
                    <button onclick="requestItem(${item.id})" class="claim-btn">Request Item</button>
                `;
            } else if (item.status === "requested") {
                actionButtons = isRequester
                    ? `<span class="claimed-label">Request sent</span>`
                    : `<span class="claimed-label">Request pending</span>`;
            } else {
                actionButtons = isClaimer
                    ? `<span class="claimed-label">You claimed this</span>`
                    : `<span class="claimed-label">Claimed</span>`;
            }
        }

        card.innerHTML = `
            ${badge}
            <h3>${item.title}</h3>
            <p class="category">${item.category} | ${item.condition}</p>
            <p class="location">${item.location}</p>
            ${getStatusMarkup(item)}
            ${actionButtons}
        `;

        cardGrid.appendChild(card);
    }

    window.deleteItem = function (id) {
        const items = getItems().filter((item) => item.id !== id);
        saveItems(items);
        loadItems();
    };

    window.requestItem = function (id) {
        const items = getItems().map((item) => {
            if (item.id === id && item.status === "available") {
                item.status = "requested";
                item.requestedBy = loggedInUser.email;
                item.claimedBy = null;
            }
            return item;
        });

        saveItems(items);
        loadItems();
    };

    window.approveRequest = function (id) {
        const items = getItems().map((item) => {
            if (item.id === id && item.status === "requested") {
                item.status = "claimed";
                item.claimedBy = item.requestedBy;
            }
            return item;
        });

        saveItems(items);
        loadItems();
    };

    window.rejectRequest = function (id) {
        const items = getItems().map((item) => {
            if (item.id === id && item.status === "requested") {
                item.status = "available";
                item.requestedBy = null;
                item.claimedBy = null;
            }
            return item;
        });

        saveItems(items);
        loadItems();
    };
});
