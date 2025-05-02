async function loginClick() {
    if (user) {
        const response = await fetch(apiURL + "Users/" + user);
        const result = await response.json();
        if (result.user.role === "admin") {
            if (!mobile) {
                window.location.replace("admin.html?platform=set");
            } else {
                window.location.replace("mobile-admin.html?platform=set");
            }
        } else {
            if (!mobile) {
                window.location.replace("account.html?platform=set");
            } else {
                window.location.replace("mobile-account.html?platform=set");
            }
        }
    } else {
        if (mobile) {
            document.getElementById("burger").checked = false
        }
        document.getElementById("login").style.display = "flex";
        document.getElementById("registration").style.display = "none";
    }
}

async function loginBtnClick() {
    const user = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const response = await fetch(apiURL + "Users/" + user)
    const result = await response.json();
    if (result) {
        if (password === result.user.password) {
            if (result.user.role === "admin") {
                if (document.getElementById('saveLogin').checked) {
                    window.localStorage.setItem("username", user)
                    window.localStorage.setItem("password", password)
                } else {
                    window.sessionStorage.setItem("username", user)
                    window.sessionStorage.setItem("password", password)
                }
                if (!mobile) {
                    window.location.replace("admin.html?platform=set")
                } else {
                    window.location.replace("mobile-admin.html?platform=set")
                }
            } else {
                if (document.getElementById('saveLogin').checked) {
                    window.localStorage.setItem("username", user)
                    window.localStorage.setItem("password", password)
                } else {
                    window.sessionStorage.setItem("username", user)
                    window.sessionStorage.setItem("password", password)
                }
                if (!mobile) {
                    window.location.replace("account.html?platform=set")
                } else {
                    window.location.replace("mobile-account.html?platform=set")
                }
            }
        } else {
            document.getElementById('loginPassword').style.borderColor = "red";
        }
    } else {
        document.getElementById('loginUsername').style.borderColor = "red";
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
    if (!mobile) {
        window.location.replace("cart.html?platform=set");
    } else {
        window.location.replace("mobile-cart.html?platform=set");
    }
}

function menuClick() {
    document.getElementById('menuBar').classList.toggle('show');
}

function searchItem(event) {
    event?.preventDefault();
    let cards;
    let item;
    let title;
    let description;
    document.getElementById("noItem").style.display = "none"
    const query = document.querySelector('.search-bar input[name="query"]').value.toLowerCase()
    const url = new URL(window.location);
    url.searchParams.set('kereses', query);
    window.history.pushState({}, '', url);
    cards = document.getElementsByClassName("cardItem").length || document.getElementsByClassName("product-card").length;
    for (let i = 1; i <= cards; i++) {
        item = document.getElementById("item" + [i])
        item.style.display = "flex";
        title = document.getElementById("item" + [i] + "_name").innerHTML.toLowerCase();
        description = document.getElementById("item" + [i] + "_description").innerHTML.toLowerCase();
        if (!title.includes(query) && !description.includes(query)) {
            item.style.display = "none"
        } else {
            item.style.display = "unset"
        }
    }
    const hidden = hiddenCount('.cardItem, .product-card');
    if (hidden.length == cards) {
        document.getElementById("noItem").style.display = "flex"
    }
}

async function searchBy(group, type) {
    document.getElementById("noItem").style.display = "none"
    let cards = document.getElementsByClassName("cardItem").length || document.getElementsByClassName("product-card").length;
    let item;
    for (let index = 1; index <= cards; index++) {
        item = document.getElementById("item" + [index])
        item.style.display = "none"
    }
    let response;
    if (type == "all") {
        response = await fetch(apiURL + "Items/Groups/" + group)
    } else {
        response = await fetch(apiURL + "Items/Groups/" + group + "/" + type)
    }
    if (response.ok) {
        const result = await response.json();
        if (result.item.length > 0) {
            for (let i = 0; i < result.item.length; i++) {
                item = document.getElementById("item" + [result.item[i].ID])
                if (!mobile) {
                    item.style.display = "flex"
                } else {
                    item.style.display = "unset"
                }
            }
        } else {
            document.getElementById("noItem").style.display = "flex"
        }
    } else {
        document.getElementById("noItem").style.display = "flex"
    }
    document.getElementById('menuBar')?.classList.toggle('show');
    document.getElementById('burger').checked = false;
}

function hiddenCount(selector) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).filter(el => getComputedStyle(el).display === 'none');
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
    if (url.includes("mobile")) {
        mobile = true;
    }
    if (user) {
        const ID = element.id.replace("toCartBtn", "")
        const req = await fetch(apiURL + "Items/" + ID)
        const res = await req.json();
        if (res.item.count > 0) {
            await fetch(apiURL + "Items/" + ID, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "count": res.item.count - 1,
                    })
            })
            const response = await fetch(apiURL + "Users/" + user);
            const result = await response.json();
            var inCartNow = result.user.inCart;
            let inCartIDs = result.user.inCartID;
            inCartIDs.push(ID)
            await fetch(apiURL + "Users/" + user, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "inCart": inCartNow + 1,
                    "inCartID": inCartIDs
                    })
            })
            inCartNow++ 
            if (inCartNow <= 9) {
                if (!mobile) {
                    document.getElementById("cartCount").innerHTML = inCartNow;
                } else {
                    document.getElementById("cartCount").innerHTML = "Kosár ("+ inCartNow + ")";
                    document.getElementById("cartCountH").innerHTML = inCartNow;
                }
            } else {
                if (!mobile) {
                    document.getElementById("cartCount").innerHTML = "9+"; 
                } else {
                    document.getElementById("cartCount").innerHTML = "Kosár (9+)";
                    document.getElementById("cartCountH").innerHTML = "9+";
                }
            }
        } else {
            alert("Valaki épp veszi ezt!")
        }
    } else {
        document.getElementById("login").style.display = "block";
    }
}

async function cartRemove(element, type) {
    if (user) {
        let ID;
        if (type == 'byFunc') {
            ID = element
        } else {
            ID = element.id.replace("CartBin", "");
        }
        const response = await fetch(apiURL + "Users/" + user);
        const result = await response.json();
        let InCartIDs = result.user.inCartID;
        InCartIDs = InCartIDs.filter(item => item != ID);
        let deleted = result.user.inCartID.length - InCartIDs.length
        await fetch(apiURL + "Users/" + user, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "inCart": result.user.inCart - deleted,
                "inCartID": InCartIDs
            })
        })
        const req = await fetch(apiURL + "Items/" + ID);
        const res = await req.json();
        await fetch(apiURL + "Items/" + ID, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "count": res.item.count + deleted
            })
        })
        document.getElementById("CartItem" + ID).remove();
        document.getElementById("maxPrice").innerHTML = "Végösszeg: 0 Ft"
        LoadCart(false)
    }
}

async function cartPlus(element) {
    if (user) {
        const ID = element.id.replace("CartPlus", "");
        const req = await fetch(apiURL + "Items/" + ID);
        const res = await req.json();
        if (res.item.count > 0) {
            let count;
            if (!mobile) {
                count = parseInt(document.getElementById("CartItemImg" + ID).innerHTML)
            } else {
                count = document.getElementById("CartCount" + ID).innerHTML.replace("Mennyiség: ", "")
            }
            const response = await fetch(apiURL + "Users/" + user);
            const result = await response.json();
            let InCartIDs = result.user.inCartID;
            InCartIDs.push(ID);
            await fetch(apiURL + "Users/" + user, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "inCart": result.user.inCart + 1,
                    "inCartID": InCartIDs
                })
            })
            await fetch(apiURL + "Items/" + ID, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "count": res.item.count - 1
                })
            })
            count++
            let newPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, '')) * count
            document.getElementById("CartPrice" + ID).innerHTML = newPrice.toLocaleString("de-DE") + " Ft";
            if (!mobile) {
                document.getElementById("CartItemImg" + ID).innerHTML = count;
            } else {
                document.getElementById("CartCount" + ID).innerHTML = "Mennyiség: " + count;
                document.getElementById("CartPrice" + ID).innerHTML = newPrice.toLocaleString("de-DE") + " Ft";
                let priceNow = document.getElementById("maxPrice").innerHTML.replace(/\./g, '').replace(/\s?Ft/g, '').replace("Végösszeg:", "")
                let addPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
                const newMaxPrice = parseInt(priceNow) + addPrice
                document.getElementById("maxPrice").innerHTML = "Végösszeg: " + newMaxPrice.toLocaleString("de-DE") + " Ft"
                LoadCart(false)
            }
        }
    }
}

async function cartMinus(element) {
    if (user) {
        const ID = element.id.replace("CartMinus", "");
        if (!mobile) {
            count = parseInt(document.getElementById("CartItemImg" + ID).innerHTML)
        } else {
            count = document.getElementById("CartCount" + ID).innerHTML.replace("Mennyiség: ", "")
        }
        if (count > 1) {
            const req = await fetch(apiURL + "Items/" + ID);
            const res = await req.json();
            const response = await fetch(apiURL + "Users/" + user);
            const result = await response.json();
            if (result.user.inCart > 0) {
                let InCartIDs = result.user.inCartID;
                const index = InCartIDs.indexOf(ID);
                if (index !== -1) {
                    InCartIDs.splice(index, 1);
                }
                await fetch(apiURL + "Users/" + user, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "inCart": result.user.inCart - 1,
                        "inCartID": InCartIDs
                    })
                })
                await fetch(apiURL + "Items/" + ID, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "count": res.item.count + 1
                    })
                })
            }
            count--;
            let newPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, '')) * count
            if (!mobile) {
                document.getElementById("CartItemImg" + ID).innerHTML = count;
                document.getElementById("CartPrice" + ID).innerHTML = newPrice.toLocaleString("de-DE") + " Ft";
            } else {
                document.getElementById("CartCount" + ID).innerHTML = "Mennyiség: " + count;
                document.getElementById("CartPrice" + ID).innerHTML = newPrice.toLocaleString("de-DE") + " Ft";
                let priceNow = document.getElementById("maxPrice").innerHTML.replace(/\./g, '').replace(/\s?Ft/g, '').replace("Végösszeg:", "")
                let addPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
                const newMaxPrice = parseInt(priceNow) - addPrice
                document.getElementById("maxPrice").innerHTML = "Végösszeg: " + newMaxPrice.toLocaleString("de-DE") + " Ft"
                LoadCart(false)
            }  
        } else {
            cartRemove(ID, 'byFunc')
        }
    }
}

function toPay() {
  if (document.getElementById("CartForm").innerHTML.includes("CartItem")) {
    window.location.replace("pay.html?platform=set")
  }
}

async function orderEvent(element) {
    let id = element.id.replace(/^(checkOrder|cancelOrder)/, "");

    document.getElementById("checkOrderItems").innerHTML = "";
    document.getElementById("popUp").style.display = "none";

    const req = await fetch(apiURL + "Datas/" + id)
    const res = await req.json();

    let orderID = "#" + res.order.ID;
    let orderStatusNum = res.order.status;
    let orderDate = new Date(res.order.date * 1000).toLocaleString("hu-HU");
    let orderPrice = res.order.price.toLocaleString("de-DE") + " Ft";
    let orderItemIDs = res.order.itemIDs;
    let orderItems = [];

    for (let i = 0; i < orderItemIDs.length; i++) {
        const response = await fetch(apiURL + "Items/" + orderItemIDs[i])
        const result = await response.json();
        let index = orderItems.findIndex(item => item.startsWith(result.item.name));
        if (index === -1) {
            orderItems.push(result.item.name + " x1");
        } else {
            let parts = orderItems[index].split(" x");
            let count = parseInt(parts[1]) + 1;
            orderItems[index] = result.item.name + " x" + count;
        }
    }

    const statusTexts = {
        0: `Feldolgozás alatt`,
        1: `Kiszállítás alatt`,
        2: `Kézbesítve`,
        3: `Lezárva`
    };
    
    let orderStatus = statusTexts[orderStatusNum] || "Ismeretlen státusz";
    
    if (element.id.includes("checkOrder")) {
        for (let index = 0; index < orderItems.length; index++) {
            document.getElementById("checkOrderItems").innerHTML += `<li>${orderItems[index]}</li>`;
        }
        document.getElementById("checkList").style.display = ""
        document.getElementById("checkOrderID").innerHTML = orderID
        document.getElementById("checkOrderStatus").innerHTML = orderStatus
        document.getElementById("checkOrderDate").innerHTML = orderDate
        document.getElementById("checkOrderPrice").innerHTML = orderPrice
        document.getElementById("popUpYes").style.display = "none"
        document.getElementById("popUpCancel").innerHTML = "Vissza"
        document.getElementById("popUpTitle").innerHTML = "Rendelés Infomáció";
        if (!mobile) {
            document.getElementById("popUp").style.display = "flex";
        } else {
            document.getElementById("overlay").style.opacity = 1;
            document.getElementById("overlay").style.pointerEvents = "all";
            document.getElementById("popUp").style.display = "unset";
        }
    } else {
        document.getElementById("checkList").style.display = "none"
        document.getElementById("popUpYes").style.display = "block"
        document.getElementById("popUpCancel").innerHTML = "Mégse"
        document.getElementById("popUpYes").innerHTML = "Törlés"
        document.getElementById("popUpTitle").innerHTML = "Rendelés Törlése";
        if (!mobile) {
            document.getElementById("popUp").style.display = "flex";
        } else {
            document.getElementById("overlay").style.opacity = 1;
            document.getElementById("overlay").style.pointerEvents = "all";
            document.getElementById("popUp").style.display = "unset";
        }
    }
}

function popUpBtn(element) {
    if (element.id.includes("Cancel")) {
        document.getElementById("popUp").style.display = "none";
        if (mobile) {
            document.getElementById("overlay").style.opacity = 0;
            document.getElementById("overlay").style.pointerEvents = "none";
        }
    } else {

    }
}

async function logOut() {
    
}

function toggleAccountEdit(editMode) {
    if (!mobile) {
        const tableElements = document.getElementsByClassName("editTable");
        const tableButtons = document.getElementsByClassName("editTableBtn");

        for (let el of tableElements) {
            el.style.display = editMode ? "contents" : "none";
        }

        for (let btn of tableButtons) {
            btn.style.display = editMode ? "flex" : "none";
        }
    } else {
        const editElements = document.getElementsByClassName("editAccount");
        const nonEditElements = document.getElementsByClassName("nonEditAccount");

        for (let el of editElements) {
            el.style.display = editMode ? "inline" : "none";
        }

        for (let el of nonEditElements) {
            el.style.display = editMode ? "none" : "inline";
        }
    }
}