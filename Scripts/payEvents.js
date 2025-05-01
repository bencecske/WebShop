async function payEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("id");

    if (sessionId) {
        loadSessionDetails(sessionId);
    }
}

async function loadSessionDetails(sessionId) {
    try {
        const res = await fetch(apiURL + `get-checkout-session?id=${sessionId}`);
        const data = await res.json();
        let responseData;
        const orders = await fetch(apiURL + "orders");
        const ordersJson = await orders.json();
        const match = ordersJson.find(order => order.session === sessionId);
        if (match) {
        responseData = match;
        ID = responseData.ID;
        } else {
            let name = window.localStorage.getItem("username") || window.sessionStorage.getItem("username")
            const response = await fetch(apiURL + `succes?id=${sessionId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                name: name,
                price: data.amount_total / 100,
                date: data.created
            })
        });
        responseData = await response.json();
        ID = responseData.order.ID;
        }
        document.getElementById("orderInfo").innerHTML = `
          <p><strong>Azonosító:</strong> #${ID}</p>
          <p><strong>Fizetés összege:</strong> ${(data.amount_total / 100).toLocaleString("de-DE")} Ft</p>
          <p><strong>Fizetve:</strong> ${new Date(data.created * 1000).toLocaleString("hu-HU")}</p>
        `;
  
    } catch (err) {
        console.error(err);
    }
}