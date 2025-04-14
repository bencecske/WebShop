const apiUrl = 'https://meet-amateur-denial-toe.trycloudflare.com/';

async function loginClick() {
    let user = window.localStorage.getItem('username') || window.sessionStorage.getItem('username');
    if (user) {
        const response = await fetch(apiUrl + "Users/" + user);
        const result = await response.json();
        if (result.user.role === "admin") {
            window.location.replace("admin.html");
        } else {
            window.location.replace("account.html");
        }
    } else {
        document.getElementById("login").style.display = "flex";
        document.getElementById("registration").style.display = "none";
    }
}

function registerClick() {
    document.getElementById("login").style.display = "none";
    document.getElementById("registration").style.display = "flex";
}

function closeForm() {
    document.getElementById("login").style.display = "none";
    document.getElementById("registration").style.display = "none";
}

function cartClick() {
    window.location.replace("cart.html");
}

function menuClick() {
    document.getElementById('menuBar').classList.toggle('show');
}

async function loginBtnClick() {
    const user = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const response = await fetch(apiUrl + "Users/" + user)
    const result = await response.json();
    if (result) {
        if (password === result.user.password) {
            if (result.user.role === "admin") {
                if (document.getElementById('saveLogin').checked) {
                    window.localStorage.setItem("username", user)
                } else {
                    window.sessionStorage.setItem("username", user)
                }
                window.location.replace("admin.html")
            } else {
                if (document.getElementById('saveLogin').checked) {
                    window.localStorage.setItem("username", user)
                } else {
                    window.sessionStorage.setItem("username", user)
                }
                window.location.replace("account.html")
            }
        } else {
            document.getElementById('loginPassword').style.borderColor = "red";
        }
    } else {
        document.getElementById('loginUsername').style.borderColor = "red";
    }
}

function editClick() {
    const elements = document.getElementsByClassName("editTable");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "contents";
    }
    const elementz = document.getElementsByClassName("editTableBtn");
    for (let i = 0; i < elementz.length; i++) {
        elementz[i].style.display = "flex";
    }
}

function saveClick() {
    const elements = document.getElementsByClassName("editTable");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
    const elementz = document.getElementsByClassName("editTableBtn");
    for (let i = 0; i < elementz.length; i++) {
        elementz[i].style.display = "none";
    }
}

function ShowHide(element){
    const SalesCheckBox = document.getElementById('SalesCheckBox');
    const GraphCheckBox = document.getElementById('GraphCheckBox');
    if (element.id == 'Sales-eye' || element.id == 'Sales-slash') {
        if (SalesCheckBox.checked) {
            document.getElementById('Sales').style.display = "none";
        } else {
            document.getElementById('Sales').style.display = "flex";
        }
    } else {
        if (GraphCheckBox.checked) {
            document.getElementById('Graphs').style.display = "none";
        } else {
            document.getElementById('Graphs').style.display = "grid";
        }
    }
}

function switchPanels(element) {
    const DataPanel = document.getElementById('Datas');
    const ListPanel = document.getElementById('ItemList');
    const AddPanel = document.getElementById('AddItem');

    const ID = element.id;

    if (ID == 'DatasBtn') {
        DataPanel.style.display = 'inline';
        ListPanel.style.display = 'none';
        AddPanel.style.display = 'none';
    } else if (ID == 'ItemListBtn') {
        DataPanel.style.display = 'none';
        ListPanel.style.display = 'inline';
        AddPanel.style.display = 'none';
    } else {
        DataPanel.style.display = 'none';
        ListPanel.style.display = 'none';
        AddPanel.style.display = 'inline';
    }
}

async function cartAdd(element) {
    let user = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
    if (user) {
        const ID = element.id.replace("toCartBtn", "")
        const req = await fetch(apiUrl + "Items/" + ID)
        const res = await req.json();
        if (res.item.count > 0) {
            await fetch(apiUrl + "Items/" + ID, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "count": res.item.count - 1,
                    })
            })
            const response = await fetch(apiUrl + "Users/" + user);
            const result = await response.json();
            var inCartNow = result.user.inCart;
            let inCartIDs = result.user.inCartID;
            inCartIDs.push(ID)
            await fetch(apiUrl + "Users/" + user, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "inCart": inCartNow + 1,
                    "inCartID": inCartIDs
                    })
            })
            if (inCartNow <= 9) {
                document.getElementById("cartCount").innerHTML = inCartNow + 1;
            } else {
                document.getElementById("cartCount").innerHTML = "9+";
            }
        } else {
            alert("Valaki épp veszi ezt!")
        }
    } else {
        document.getElementById("login").style.display = "flex";
    }
}

async function cartRemove(element, type) {
    let user = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
    if (user) {
        let ID;
        if (type == 'byFunc') {
            ID = element
        } else {
            ID = element.id.replace("CartBin", "");
        }
        const response = await fetch(apiUrl + "Users/" + user);
        const result = await response.json();
        let InCartIDs = result.user.inCartID;
        InCartIDs = InCartIDs.filter(item => item != ID);
        let deleted = result.user.inCartID.length - InCartIDs.length
        await fetch(apiUrl + "Users/" + user, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "inCart": result.user.inCart - deleted,
                "inCartID": InCartIDs
            })
        })
        const req = await fetch(apiUrl + "Items/" + ID);
        const res = await req.json();
        await fetch(apiUrl + "Items/" + ID, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "count": res.item.count + deleted
            })
        })
        document.getElementById("CartItem" + ID).remove();
    }
}

async function cartPlus(element) {
    let user = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
    if (user) {
        const ID = element.id.replace("CartPlus", "");
        const req = await fetch(apiUrl + "Items/" + ID);
        const res = await req.json();
        if (res.item.count > 0) {
            let count = parseInt(document.getElementById("CartItemImg" + ID).innerHTML)
            const response = await fetch(apiUrl + "Users/" + user);
            const result = await response.json();
            let InCartIDs = result.user.inCartID;
            InCartIDs.push(ID);
            await fetch(apiUrl + "Users/" + user, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "inCart": result.user.inCart + 1,
                    "inCartID": InCartIDs
                })
            })
            await fetch(apiUrl + "Items/" + ID, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "count": res.item.count - 1
                })
            })
            document.getElementById("CartItemImg" + ID).innerHTML = count + 1;
        }
    }
}

async function cartMinus(element) {
    let user = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
    if (user) {
        const ID = element.id.replace("CartMinus", "");
        let count = parseInt(document.getElementById("CartItemImg" + ID).innerHTML)
        if (count > 1) {
            document.getElementById("CartItemImg" + ID).innerHTML = count - 1;
        } else {
            cartRemove(3, 'byFunc')
        }
    }
}

async function cartPay() {

}