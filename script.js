// Get saved items from Local Storage
let items = JSON.parse(localStorage.getItem("lostFoundItems")) || [];

// Page navigation
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    if (pageId === "browse") {
        displayItems();
    }

    updateStats();

    window.scrollTo(0, 0);
}

// Demo login - no credentials are stored
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Login successful! Welcome to FindIt.");

    showPage("home");
});

// Report item
document.getElementById("reportForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let newItem = {
        id: Date.now(),
        name: document.getElementById("itemName").value,
        category: document.getElementById("category").value,
        type: document.getElementById("itemType").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value,
        email: document.getElementById("email").value,
        status: "Active"
    };

    items.push(newItem);

    saveItems();

    alert("Your item has been reported successfully!");

    this.reset();

    showPage("browse");
});

// Save items in browser
function saveItems() {
    localStorage.setItem("lostFoundItems", JSON.stringify(items));
    updateStats();
}

// Display items
function displayItems() {
    let container = document.getElementById("itemsContainer");

    let search = document.getElementById("searchInput").value.toLowerCase();
    let filter = document.getElementById("filterType").value;

    container.innerHTML = "";

    let filteredItems = items.filter(item => {
        let matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search) ||
            item.location.toLowerCase().includes(search);

        let matchesType =
            filter === "All" || item.type === filter;

        return matchesSearch && matchesType;
    });

    if (filteredItems.length === 0) {
        container.innerHTML = "<p>No matching items found.</p>";
        return;
    }

    filteredItems.forEach(item => {
        let card = document.createElement("div");
        card.className = "item-card";

        let statusClass = item.status === "Resolved"
            ? "Resolved"
            : item.type;

        let title = document.createElement("h3");
        title.textContent = item.name;

        let status = document.createElement("span");
        status.className = "status " + statusClass;
        status.textContent = item.status === "Resolved"
            ? "Resolved"
            : item.type;

        let details = document.createElement("p");
        details.textContent = "Category: " + item.category;

        let location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        let date = document.createElement("p");
        date.textContent = "Date: " + item.date;

        let description = document.createElement("p");
        description.textContent = item.description;

        let contact = document.createElement("p");
        contact.textContent = "Contact: " + item.email;

        card.append(title, status, details, location, date, description, contact);

        if (item.status !== "Resolved") {
            let resolveBtn = document.createElement("button");
            resolveBtn.textContent = "Mark Resolved";
            resolveBtn.onclick = () => resolveItem(item.id);
            card.appendChild(resolveBtn);
        }

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteItem(item.id);

        card.appendChild(deleteBtn);
        container.appendChild(card);
    });
}

// Mark item as resolved
function resolveItem(id) {
    let item = items.find(item => item.id === id);

    if (item) {
        item.status = "Resolved";
        saveItems();
        displayItems();
    }
}

// Delete item
function deleteItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        items = items.filter(item => item.id !== id);

        saveItems();
        displayItems();
    }
}

// Update homepage statistics
function updateStats() {
    document.getElementById("totalItems").textContent = items.length;

    document.getElementById("lostCount").textContent =
        items.filter(item => item.type === "Lost" && item.status !== "Resolved").length;

    document.getElementById("foundCount").textContent =
        items.filter(item => item.type === "Found" && item.status !== "Resolved").length;
}

// Initial loading
updateStats();
