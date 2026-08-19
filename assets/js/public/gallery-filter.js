(function initGalleryFilter() {
    const buttons = document.querySelectorAll(".gallery-tab[data-filter]");
    const items = document.querySelectorAll(".gallery-item[data-category]");

    if (!buttons.length || !items.length) return;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            buttons.forEach(item => {
                item.classList.toggle("active", item === button);
            });

            items.forEach(item => {
                const visible =
                    filter === "all" ||
                    item.dataset.category === filter;

                item.hidden = !visible;
            });
        });
    });
})();