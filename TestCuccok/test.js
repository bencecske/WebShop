const apiURL = "https://1f9e-188-36-29-123.ngrok-free.app/"

document.getElementById('addItemBtn').addEventListener('click', async function(event) {
    event.preventDefault(); // Megakadályozza az alapértelmezett viselkedést
    event.stopPropagation(); // Megakadályozza az esemény továbbterjedését

    let name = document.getElementById('AddItemName').value;
    let group = document.getElementById('AddItemGroup').value;
    let type = document.getElementById('AddItemType').value;
    let price = document.getElementById('AddItemPrice').value;
    let count = document.getElementById('AddItemCount').value;
    let description = document.getElementById('AddItemDescription').value;

    const response = await fetch(apiURL + "Items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "group": group,
            "type": type,
            "price": price,
            "count": count,
            "description": description,
            "Img": "/Images/NikePolo.png"
        })
    });

    if (response.ok) {
        console.log("Termék sikeresen feltöltve!");
    } else {
        console.error("Hiba történt a feltöltés során.");
    }

    return false; // Biztosítja, hogy ne frissüljön az oldal
});