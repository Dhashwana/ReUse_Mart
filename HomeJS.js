const menuBtn = document.getElementById("menuBtn");
const dropdown = document.getElementById("dropdownMenu");

if (menuBtn && dropdown) {
    menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("show");
    });

    window.addEventListener("click", () => {
        dropdown.classList.remove("show");
    });
}
