function wireAuth() {
    $("loginButton").addEventListener("click", async () => {
        const { error } = await window.db.auth.signInWithPassword({
            email: $("email").value.trim(),
            password: $("password").value
        });

        if (error) {
            $("loginMessage").textContent = error.message;
            return;
        }

        $("loginBox").hidden = true;
        $("dashboard").hidden = false;

        await loadSettings();
        await loadProducts();
        await loadServices();
    });

    $("logoutButton").addEventListener("click", async () => {
        await window.db.auth.signOut();
        $("loginBox").hidden = false;
        $("dashboard").hidden = true;
    });
}

async function checkExistingSession() {
    const { data } = await window.db.auth.getSession();

    if (data.session) {
        $("loginBox").hidden = true;
        $("dashboard").hidden = false;
        await loadSettings();
        await loadProducts();
        await loadServices();
    }
}
