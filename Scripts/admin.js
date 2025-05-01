let prevStatusIcon = "⏪"
let nextStatusIcon = "⏩"

async function admin() {
    await LoadUser();
    if (user) {
        let acces;
        const response = await fetch(apiURL + "Users/" + user)
        const result = await response.json();
        if (result.user.role == "admin") {
            GetJSON(1);
            GetJSON(2);
            LoadGraphs()
        } else {
            window.location.replace("account.html?platform=set")
        }
    } else {
        window.location.replace("index.html")
    }
}

function mobileAdminBtn(element) {
    const content = element.innerHTML;

    switch (true) {
        case content.includes("Rendelések"):
            document.getElementById("orderList").style.display = "unset"
            document.getElementById("ItemAdd").style.display = "none"
            document.getElementById("itemList").style.display = "none"
            break;
        case content.includes("Új"):
            document.getElementById("ItemAdd").style.display = "unset"
            document.getElementById("orderList").style.display = "none"
            document.getElementById("itemList").style.display = "none"
            break;
        default:
            document.getElementById("itemList").style.display = "unset"
            document.getElementById("orderList").style.display = "none"
            document.getElementById("ItemAdd").style.display = "none"
    }
}

async function GetJSON(type) {
    let xd = "";
    if (type == 1) {
        xd = "Items/";
    } else {
        xd = "Datas/"
    }
    const response = await fetch(apiURL + xd)
    const result = await response.json();
    for (let i = result.length; i >= 1; i--) {
        const res = await fetch(apiURL + xd + i);
        const item = await res.json();
        if (type == 1) {
            LoadItems(i, item.item.name, item.item.group, item.item.type, item.item.price, item.item.description, item.item.Img, item.item.ID, item.item.count);
        } else {
            LoadData(item.order.ID, item.order.customer, item.order.price, item.order.count, item.order.date, item.order.status);
        }
    }
}

let income = 0;

function LoadData(number, customer, price, count, date, status) {
    const statusTexts = {
        0: `Feldolgozás alatt <strong id="nextStatus${number}" onclick="changeStatus(this, 1)"> ${nextStatusIcon}</strong>`,
        1: `<strong id="prevStatus${number}" onclick="changeStatus(this, -1)">${prevStatusIcon} </strong>Kiszállítás alatt <strong id="nextStatus${number}" onclick="changeStatus(this, 1)"> ${nextStatusIcon}</strong>`,
        2: `<strong id="prevStatus${number}" onclick="changeStatus(this, -1)">${prevStatusIcon} </strong>Kézbesítve <strong id="nextStatus${number}" onclick="changeStatus(this, 1)"> ${nextStatusIcon}</strong>`,
        3: `<strong id="prevStatus${number}" onclick="changeStatus(this, -1)">${prevStatusIcon} </strong>Lezárva`
    };
    
    status = statusTexts[status] || "Ismeretlen státusz";
    let newIncome = price;
    income += newIncome;
    document.getElementById('income').innerHTML = "Teljes Bevétel: " + income.toLocaleString('de-DE')  + " Ft";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "Elements/DataListItem.html", true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            document.getElementById('DataList').innerHTML += rawFile.responseText;

            const replacements = {
                "Customer": customer,
                "Price": price.toLocaleString('de-DE') + " Ft",
                "Count": count,
                "Date": new Date(date * 1000).toLocaleString("hu-HU"),
                "Number": "#" + number,
                "Status": status
            };

            for (let key in replacements) {
                const oldId = "newData" + key;
                const newId = "data" + key + number;
                const element = document.getElementById(oldId);
                if (element) {
                    element.id = newId;
                    element.innerHTML = replacements[key];
                }
                if (mobile) {
                    if (newId.includes("Customer") || newId.includes("Price") || newId.includes("Date")) {
                        element.style.display = "none"
                    }
                }
            }
        }
    };
    rawFile.send();
}

async function changeStatus(element, direction) {
    const ID = element.id.replace(/(prevStatus|nextStatus)/, "");
    const response = await fetch(apiURL + "Datas/" + ID);
    const data = await response.json();
    
    const newStatus = data.order.status + direction;

    await fetch(apiURL + "Datas/" + ID, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
    });

    const statusTexts = {
        0: `Feldolgozás alatt <strong id="nextStatus${ID}" onclick="changeStatus(this, 1)"> ${nextStatusIcon}</strong>`,
        1: `<strong id="prevStatus${ID}" onclick="changeStatus(this, -1)">${prevStatusIcon} </strong>Kiszállítás alatt <strong id="nextStatus${ID}" onclick="changeStatus(this, 1)"> ${nextStatusIcon}</strong>`,
        2: `<strong id="prevStatus${ID}" onclick="changeStatus(this, -1)">${prevStatusIcon} </strong>Kézbesítve <strong id="nextStatus${ID}" onclick="changeStatus(this, 1)"> ${nextStatusIcon}</strong>`,
        3: `<strong id="prevStatus${ID}" onclick="changeStatus(this, -1)">${prevStatusIcon} </strong>Lezárva`
    };

    document.getElementById("dataStatus" + ID).innerHTML = statusTexts[newStatus] || "Ismeretlen státusz";
}

function LoadItems(number, name, group, type, price, description, img, id, count) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "Elements/ListItem.html", true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            document.getElementById('ItemList').innerHTML += rawFile.responseText;
            if (mobile) {
                document.getElementById("NewListItemDelete").style.fill = "none"
                document.getElementById("NewListItemEdit").style.fill = "none"
            }
            const replacements = {
                "ListItemTitle": {
                    newId: "item" + number + "_name",
                    content: name
                },
                "ListItemDescription": {
                    newId: "item" + number + "_description",
                    content: description
                },
                "ListPrice": {
                    newId: "item" + number + "_price",
                    content: price
                }
            };

            for (let key in replacements) {
                const oldId = "new" + key;
                const { newId, content } = replacements[key];
                const element = document.getElementById(oldId);
                if (element) {
                    element.id = newId;
                    element.innerHTML = content;
                }
            }
            const imgElement = document.getElementById("newListItemImg");
            if (imgElement) {
                const newId = "item" + number;
                imgElement.id = newId;
                imgElement.innerHTML = count;
                //imgElement.style.backgroundImage = `url(${apiURL}Images/${img})`;
            }
            const editElement = document.getElementById("NewListItemEdit");
            if (editElement) editElement.id = "itemEdit" + number;

            const deleteElement = document.getElementById("NewListItemDelete");
            if (deleteElement) deleteElement.id = "itemDelete" + number;
        }
    };
    rawFile.send();
}

function RefreshJSON() {
    document.getElementById('ItemList').innerHTML = "";
    if (!mobile) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", "Elements/ItemListTitle.html", true);
        rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            var allText = rawFile.responseText;
            document.getElementById('ItemList').innerHTML += allText;
            }
        }
        rawFile.send();
    }
    GetJSON(1)
}

async function AddItem() {
    let name = document.getElementById('AddItemName');
    let group = document.getElementById('AddItemGroup');
    let type = document.getElementById('AddItemType');
    let price = document.getElementById('AddItemPrice');
    let count = document.getElementById('AddItemCount');
    let description = document.getElementById('AddItemDescription');
    await fetch(apiURL + "Items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name":name.value,
            "group":group.value,
            "type":type.value,
            "price":price.value,
            "count":count.value,
            "description":description.value,
            "Img":"/Images/NikePolo.png"
            })
        })
    name.value = "";
    group.value = "";
    type.value = "";
    price.value = "";
    count.value = "";
    description.value = "";
    RefreshJSON();
}

async function editItem(element) {
    const ID = element.id.replace("itemEdit", "")
    const editButtons = document.querySelectorAll('[id*="editBtn"]');
    editButtons.forEach(button => {
        button.id = "editBtn" + ID;
    });
    const res = await fetch(apiURL + "Items/" + ID + "/");
    const item = await res.json();
    document.getElementById('popUpItemName').innerHTML = item.item.name;
    document.getElementById('popUpName').value = item.item.name;
    document.getElementById('popUpDesc').value = item.item.description;
    document.getElementById('popUpGroup').value = item.item.group;
    document.getElementById('popUpType').value = item.item.type;
    document.getElementById('popUpPrice').value = item.item.price;
    document.getElementById('popUpCount').value = item.item.count;
    document.getElementById('popUpDiv').style.display = "flex";
}

async function editClick(element) {
    const ID = element.id.replace("editBtn", "")
    const res = await fetch(apiURL + "Items/" + ID + "/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name":document.getElementById('popUpName').value,
            "group":document.getElementById('popUpGroup').value,
            "type":document.getElementById('popUpType').value,
            "price":document.getElementById('popUpPrice').value,
            "count":document.getElementById('popUpCount').value,
            "description":document.getElementById('popUpDesc').value
            })
        })
    document.getElementById('popUpDiv').style.display = "none";
    if (res.ok) {
        RefreshJSON()
    }
}

async function deleteItem(element) {
    const id = element.id.replace("itemDelete", "")
    fetch(apiURL + "Items/" + id + "/", {
        method: 'DELETE',
    })
    document.getElementById("")
    let parent = element.parentElement;
    parent.parentElement.remove();
}

async function searchItem() {
    let search = document.getElementById('listSearch').value;
    let name = search.replace(" ", "%20")
    if (search !=  null) {
    document.getElementById('ItemList').innerHTML = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "Elements/ItemListTitle.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
        document.getElementById('ItemList').innerHTML += allText;
        }
    }
    rawFile.send();
    const response = await fetch(apiURL + "Items/Name/" + name)
    const result = await response.json();
    for (let i = 0; i <= result.item.length; i++) {
        const res = await fetch(apiURL + "Items/Name/" + name + "/");
        const item = await res.json();
        const j = i++
        LoadItems(j, item.item.name, item.item.group, item.item.type, item.item.price, item.item.description, item.item.Img, item.item.ID, item.item.count);
        }
    }
}

function filterItem() {
    const filter = document.getElementById('filters').style.display;
    if (filter == "none") {
        document.getElementById('filters').style.display = "flex"
    } else {
        document.getElementById('filters').style.display = "none"
    }
}

async function filterChange() {
    
}

async function LoadGraphs() {
    const response = await fetch(apiURL + "Graphs/")
    const result = await response.json();
    const xValues2 = ["Férfi eladások (db)", "Női eladások (db)", "Gyerek eladások (db)"];
    const totalCount = result.Total;
    const manCount = result.Man;
    const womanCount = result.Woman;
    const kidCount = result.Kid;
    const yValues = [totalCount.Man, totalCount.Woman, totalCount.Kid];
    const barColors = ["green","red","blue",];
    new Chart("kor", {
        type: "pie",
        data: {
        labels: xValues2,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        title: {display: false}
        }
    });
    const xValues = ["Jan", "Feb", "Márc", "Ápr", "Máj", "Jún", "Júl", "Aug", "Szept", "Okt", "Nov", "Dec"];                        
    new Chart("csik", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{ 
                label: "Férfi eladások (db)",
                data: [manCount.Jan, manCount.Feb, manCount.Mar, manCount.Apr, manCount.May, manCount.Jun, manCount.Jul, manCount.Aug, manCount.Sept, manCount.Oct, manCount.Nov, manCount.Dec],
                borderColor: "green",
                fill: false
            }, 
            { 
                label: "Női eladások (db)",
                data: [womanCount.Jan, womanCount.Feb, womanCount.Mar, womanCount.Apr, womanCount.May, womanCount.Jun, womanCount.Jul, womanCount.Aug, womanCount.Sept, womanCount.Oct, womanCount.Nov, womanCount.Dec],
                borderColor: "red",
                fill: false
            }, 
            { 
                label: "Gyerek eladások (db)",
                data: [kidCount.Jan, kidCount.Feb, kidCount.Mar, kidCount.Apr, kidCount.May, kidCount.Jun, kidCount.Jul, kidCount.Aug, kidCount.Sept, kidCount.Oct, kidCount.Nov, kidCount.Dec],
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            legend: {display: true}
        }
    });
}