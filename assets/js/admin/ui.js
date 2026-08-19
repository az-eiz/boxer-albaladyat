function wireTabs() {
    const tabs = document.querySelectorAll(".admin-tab");
    const panels = document.querySelectorAll(".admin-panel-section");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            panels.forEach(panel => {
                panel.hidden = panel.id !== `tab-${tab.dataset.tab}`;
            });

            document.querySelector(".admin-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}
