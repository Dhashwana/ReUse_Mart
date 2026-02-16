document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("reuseModal");
    const openBtn = document.querySelector(".add-btn");
    const closeBtn = document.getElementById("closeReuseModal");
    const form = document.getElementById("reuseForm");
    const cardGrid = document.querySelector(".card-grid");

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!openBtn) return; // Safety check

    // Open modal
    openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Close modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Load items
    loadItems();

    function loadItems() {
        const items = JSON.parse(localStorage.getItem("reuseItems")) || [];
        cardGrid.innerHTML = "";

        items.forEach(item => {
            addCardToUI(item);
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const newItem = {
            id: Date.now(),
            title: document.getElementById("itemTitle").value,
            category: document.getElementById("itemCategory").value,
            condition: document.getElementById("itemCondition").value,
            location: document.getElementById("itemLocation").value,
            price: document.getElementById("itemPrice").value,
            owner: loggedInUser.email,
            claimed: false
        };

        const items = JSON.parse(localStorage.getItem("reuseItems")) || [];
        items.push(newItem);
        localStorage.setItem("reuseItems", JSON.stringify(items));

        loadItems();

        form.reset();
        modal.style.display = "none";
    });

    function addCardToUI(item) {

        const card = document.createElement("div");
        card.className = "item-card";

        const badge = item.price == 0
            ? `<div class="badge free">FREE</div>`
            : `<div class="badge price">₹ ${item.price}</div>`;

        let actionButtons = "";

        if (item.owner === loggedInUser.email) {
            actionButtons = `
                <button onclick="deleteItem(${item.id})" class="delete-btn">Delete</button>
            `;
        } 
        else if (!item.claimed) {
            actionButtons = `
                <button onclick="claimItem(${item.id})" class="claim-btn">Request Item</button>
            `;
        } 
        else {
            actionButtons = `<span class="claimed-label">Claimed</span>`;
        }

        card.innerHTML = `
            ${badge}
            <h3>${item.title}</h3>
            <p class="category">${item.category} | ${item.condition}</p>
            <p class="location">${item.location}</p>
            ${actionButtons}
        `;

        cardGrid.appendChild(card);
    }

    // Make delete and claim global
    window.deleteItem = function (id) {
        let items = JSON.parse(localStorage.getItem("reuseItems")) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem("reuseItems", JSON.stringify(items));
        loadItems();
    };

    window.claimItem = function (id) {
        let items = JSON.parse(localStorage.getItem("reuseItems")) || [];
        items = items.map(item => {
            if (item.id === id) {
                item.claimed = true;
            }
            return item;
        });

        localStorage.setItem("reuseItems", JSON.stringify(items));
        loadItems();
    };

});
