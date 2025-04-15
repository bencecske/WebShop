let apiURL;

async function loadAPIURL() {
    try {
        const response = await fetch("Scripts/api.txt");

        if (!response.ok) {
            throw new Error("Rossz elérési útvonal");
        }

        apiURL = await response.text();

        const req = await fetch(apiURL);
        const text = await req.text();

        let res;
        try {
            res = JSON.parse(text);
        } catch (jsonError) {
            throw new Error("Rossz elérési útvonal");
        }

        if (!res.ok) {
            throw new Error("Karbantartás");
        }

        return apiURL;
    } catch (err) {
        let message = err.message || err.toString();
        if (message.includes("fetch")) {
            err = "Rossz elérési útvonal";
        }
        throw err;
    }
}

async function init() {
    try {
        await loadAPIURL();
        onStart();
        onClickEvents();
        if (typeof admin === "function") {
            admin();
        }

    } catch (error) {
        onAPIError(error);
    }
}

function onAPIError(error) {
    window.location.replace("error.html?error=" + encodeURIComponent(error));
}

init();