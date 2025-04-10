const apiURL = "https://chargers-baby-salaries-artistic.trycloudflare.com/"

GetJSON(1);
GetJSON(2);
LoadGraphs()

async function GetJSON(type) {
    let xd = "";
    if (type == 1) {
        xd = "Items/";
    } else {
        xd = "Datas/"
    }
    const response = await fetch(apiURL + xd)
    const result = await response.json();
    for (let i = 1; i <= result.length; i++) {
        const res = await fetch(apiURL + xd + i + "/");
        const item = await res.json();
        if (type == 1) {
            LoadItems(i, item.item.name, item.item.group, item.item.type, item.item.price, item.item.description, item.item.Img, item.item.ID, item.item.count);
        } else {
            LoadData(i, item.item.Customer, item.item.Price, item.item.Count, item.item.Date);
        }
    }
}

let income = 0;

function LoadData(number, customer, price, count, date) {
    let newIncome = parseInt(price.replace("Ft", "").replace(/\./g, "").trim(), 10);
    income += newIncome;
    document.getElementById('income').innerHTML = "Teljes Bevétel: " + income.toLocaleString('de-DE')  + " Ft";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/Elements/DataListItem.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
            document.getElementById('DataList').innerHTML += allText;
            document.getElementById("newDataListItem").id = "dataListItem" + number;
            document.getElementById("newDataCustomer").id = "dataCustomer" + number;
            document.getElementById("dataCustomer" + number).innerHTML = customer;
            document.getElementById("newDataPrice").id = "dataPrice" + number;
            document.getElementById("dataPrice" + number).innerHTML = price;
            document.getElementById("newDataCount").id = "dataCount" + number;
            document.getElementById("dataCount" + number).innerHTML = count;
            document.getElementById("newDataDate").id = "dataDate" + number;
            document.getElementById("dataDate" + number).innerHTML = date;
        }
    }
    rawFile.send();
}

function LoadItems(number, name, group, type, price, description, img, id, count) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/Elements/ListItem.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
            document.getElementById('ItemList').innerHTML += allText;
            document.getElementById("newListItemImg").id = "item" + number;
            document.getElementById("item" + number).innerHTML = count;
            document.getElementById("item" + number).style.backgroundImage = 'url('+img+')';
            document.getElementById("newListItemTitle").id = "item" + number + "_name";
            document.getElementById("item" + number + "_name").innerHTML = name;
            document.getElementById("newListItemDescription").id = "item" + number + "_description";
            document.getElementById("item" + number + "_description").innerHTML = description;
            document.getElementById("newListPrice").id = "item" + number + "_price";
            document.getElementById("item" + number + "_price").innerHTML = price;
            document.getElementById("NewListItemEdit").id = "itemEdit" + number;
            document.getElementById("NewListItemDelete").id = "itemDelete" + number;
        }
    }
    rawFile.send();
}

function RefreshJSON() {
    document.getElementById('ItemList').innerHTML = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/Elements/ItemListTitle.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
        document.getElementById('ItemList').innerHTML += allText;
        }
    }
    rawFile.send();
    GetJSON(1)
}

async function AddItem() {
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
            "name":name,
            "group":group,
            "type":type,
            "price":price,
            "count":count,
            "description":description,
            "Img":"/Images/NikePolo.png"
            })
        })
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
            "description":document.getElementById('popUpDesc').value,
            "Img":"/Images/NikePolo.png"
            })
        })
        document.getElementById('popUpDiv').style.display = "none";
}

async function deleteItem(element) {
    const id = element.id.replace("itemDelete", "")
    fetch(apiURL + "Items/" + id + "/", {
        method: 'DELETE',
      })
      .then(res => res.json())
}

async function searchItem() {
    let search = document.getElementById('listSearch').value;
    let name = search.replace(" ", "%20")
    if (search !=  null) {
    document.getElementById('ItemList').innerHTML = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/Elements/ItemListTitle.html", true);
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
