let change = true

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
			document.getElementById("login").style.display = "flex";
			document.getElementById("registration").style.display = "none";
        }
        document.getElementById("login").style.display = "flex";
        document.getElementById("registration").style.display = "none";
    }
}

async function loginBtnClick() {
    document.getElementById('loginPassword').style.borderColor = "#2e2e2e";
    document.getElementById('loginUsername').style.borderColor = "#2e2e2e";
    const loginUser = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (!loginUser) {
        document.getElementById('loginUsername').style.borderColor = "red";
        return
    }
    if (!password) {
        document.getElementById('loginPassword').style.borderColor = "red";
        return
    }
    const response = await fetch(apiURL + "Users/" + loginUser)
    const result = await response.json();
    if (response.ok) {
        if (password === result.user.password) {
            if (result.user.role === "admin") {
                if (document.getElementById('saveLogin').checked) {
                    window.localStorage.setItem("username", loginUser)
                    window.localStorage.setItem("password", password)
                } else {
                    window.sessionStorage.setItem("username", loginUser)
                    window.sessionStorage.setItem("password", password)
                }
                if (!mobile) {
                    window.location.replace("admin.html?platform=set")
                } else {
                    window.location.replace("mobile-admin.html?platform=set")
                }
            } else {
                if (document.getElementById('saveLogin').checked) {
                    window.localStorage.setItem("username", loginUser)
                    window.localStorage.setItem("password", password)
                } else {
                    window.sessionStorage.setItem("username", loginUser)
                    window.sessionStorage.setItem("password", password)
                }
                if (change) {
                    if (!mobile) {
                        window.location.replace("account.html?platform=set")
                    } else {
                        window.location.replace("mobile-account.html?platform=set")
                    }
                } else {
                    change = true
                    await LoadUser()
                    document.getElementById("login").style.display = "none"
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

async function registerBtnClick() {
	let empty = document.getElementById("empty")
	let takenUser = document.getElementById("takenUser")
	let takenMail = document.getElementById("takenMail")
	let wrongMail = document.getElementById("wrongMail")
	let passNotMatch = document.getElementById("passNotMatch")
    let takenPhone = document.getElementById("takenPhone")
    let wrongPhone = document.getElementById("wrongPhone")
    let wrongAddress = document.getElementById("wrongAddress")

	empty.style.display = "none"
	takenUser.style.display = "none"
	takenMail.style.display = "none"
	wrongMail.style.display = "none"
	passNotMatch.style.display = "none"
    takenPhone.style.display = "none"
    wrongPhone.style.display = "none"
    wrongAddress.style.display = "none"
	
	let username = document.getElementById("registerUsername").value
	let email = document.getElementById("registerEmail").value
	let pass = document.getElementById("registerPassword").value
	let passAgain = document.getElementById("registerPasswordAgain").value
    let phone = document.getElementById("registerPhone").value
    let code = document.getElementById("registerCode").value
    let city = document.getElementById("registerCity").value
    let street = document.getElementById("registerStreet").value

	let user = []
	let mail = []
    let phoneNums = []
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+36|06)\d{9}$/;
    const streetRegex = /^[\p{L}\s\.\-]+ \d+[a-zA-Z]?$/u;
    const codeIsValid = /^\d{4}$/.test(code);
	
	const response = await fetch(apiURL + "Users")
	const result = await response.json()

	for (let i = 0; i < result.length; i++) {
		user.push(result[i].name)
        mail.push(result[i].email)
        phoneNums.push(result[i].phone)
	}

	if (!username || !email || !pass || !passAgain || !code || !city || !street || !phone) {
		empty.style.display = "unset" 
		return
	}
    if (!emailPattern.test(email)) {
		wrongMail.style.display = "unset" 
		return 
    }
	if (user.includes(username)) {
		takenUser.style.display = "unset" 
		return 
	}
	if (mail.includes(email)) {
		takenMail.style.display = "unset" 
		return
	}
	if (pass != passAgain) {
		passNotMatch.style.display = "unset" 
		return
	}
    if (phoneNums.includes(phone)) {
        takenPhone.style.display = "unset"
        return
    }
    if (!phoneRegex.test(phone)) {
        wrongPhone.style.display = "unset";
        return;
    }
    if (!codeIsValid || !streetRegex.test(street)) {
        wrongAddress.style.display = "unset";
        return;
    }

	const req = await fetch(apiURL + "register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name":username,
            "password":pass,
            "email":email,
            "phone":phone,
            "address":code + " " + city + ", " + street
        })
    })
    document.getElementById("registration").style.display = "none"
    window.sessionStorage.setItem("password", pass)
    window.sessionStorage.setItem("username", username)
}

function closeForm() {
    document.getElementById("login").style.display = "none";
    document.getElementById("registration").style.display = "none";
}

function cartClick() {
    if (user) {
        if (!mobile) {
            window.location.replace("cart.html?platform=set");
        } else {
            window.location.replace("mobile-cart.html?platform=set");
        }
    } else {
        change = false
        document.getElementById("login").style.display = "flex"
    }
}

function menuClick() {
    document.getElementById('menuBar').classList.toggle('show');
}

let hiddenCards = [];

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
        if (!hiddenCards.includes(item)) {
            item.style.display = "flex";
        }
        title = document.getElementById("item" + [i] + "_name").innerHTML.toLowerCase();
        description = document.getElementById("item" + [i] + "_description").innerHTML.toLowerCase();
        if (!title.includes(query) && !description.includes(query)) {
            item.style.display = "none"
        } else {
            if (!hiddenCards.includes(item)) {
                item.style.display = "unset"
            }
        }
    }
    const hidden = hiddenCount('.cardItem, .product-card');
    if (hidden.length == cards) {
        document.getElementById("noItem").style.display = "flex"
    }
}

async function searchBy(group, type) {
    hiddenCards = []
    const url = new URL(window.location);
    url.searchParams.set('csoport', group);
    url.searchParams.set('tipus', type);
    const translations = {
        Man: 'Férfi',
        Woman: 'Női',
        Kid: 'Gyerek'
    };
    let displayGroup = translations[group] || group;
    document.getElementById("mainsearch").placeholder = `Keresés (${displayGroup} csoportban)...`
    window.history.pushState({}, '', url);
    document.getElementById("noItem").style.display = "none"
    let cards = document.getElementsByClassName("cardItem").length || document.getElementsByClassName("product-card").length;
    let item;
    for (let index = 1; index <= cards; index++) {
        item = document.getElementById("item" + [index])
        item.style.display = "none"
        hiddenCards.push(item);
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
                    let index = hiddenCards.indexOf(item)
                    hiddenCards.splice(index, 1)
                } else {
                    item.style.display = "unset"
                    let index = hiddenCards.indexOf(item)
                    hiddenCards.splice(index, 1)
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

function resetSearch(event) {
    event?.preventDefault();
    const url = new URL(window.location);
    url.search = "?platform=set";
    window.history.replaceState(null, "", url);
    document.getElementById("mainsearch").placeholder = `Keresés...`
    document.getElementById("mainsearch").value = ""
    hiddenCards = []
    searchItem()
}

function hiddenCount(selector) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).filter(el => getComputedStyle(el).display === 'none');
}

function ShowHide(element){
    const SalesCheckBox = document.getElementById('SalesCheckBox');
    const GraphCheckBox = document.getElementById('GraphCheckBox');
    const UsersCheckBox = document.getElementById('UsersCheckBox');
    if (element.id == 'Sales-eye' || element.id == 'Sales-slash') {
        if (SalesCheckBox.checked) {
            document.getElementById('Sales').style.display = "none";
        } else {
            document.getElementById('Sales').style.display = "flex";
        }
    } else if (element.id == 'Users-eye' || element.id == 'Users-slash') {
        if (UsersCheckBox.checked) {
            document.getElementById('Users').style.display = "none";
        } else {
            document.getElementById('Users').style.display = "grid";
        }
    } else if (element.id == 'Graphs-eye' || element.id == 'Graphs-slash') {
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
            }).then(response => response.json().then(result => {
                if (result.item.count == 0) {
                    document.getElementById(element.id).disabled = "true"
                    document.getElementById(element.id).innerHTML = "Elfogyott"
                    document.getElementById(element.id).style.backgroundColor = "red"
                }
            }))

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
            document.getElementById(element.id).disabled = "true"
            document.getElementById(element.id).innerHTML = "Elfogyott"
            document.getElementById(element.id).style.backgroundColor = "red"
        }
    } else {
        change = false
        document.getElementById("login").style.display = "flex";
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

async function toggleAccountEdit(editMode, error) {
    const errorMsg = document.getElementsByClassName("errorMsg")
    for (let el of errorMsg) {
        el.style.display = "none"
    }

    if (error) {
        switch (error) {
            default:
                document.getElementById(error).style.display = "unset"
                return
        }
    }

    let user = document.getElementById("user")
    let email = document.getElementById("email")
    let address = document.getElementById("address")
    let phone = document.getElementById("phone")
    let newUser = document.getElementById("newUsername")
    let newEmail = document.getElementById("newEmail")
    let newAddress = document.getElementById("newAddress")
    let newPhone = document.getElementById("newPhone")
    
        if (editMode) {
            newUser.value = user.innerHTML
            newEmail.value = email.innerHTML
            newAddress.value = address.innerHTML
            newPhone.value = phone.innerHTML
        }
    
        if (!mobile) {
            const tableElements = document.getElementsByClassName("editTable");
            const tableButtons = document.getElementsByClassName("editTableBtn");
            document.getElementById("nonEditTable").style.display = editMode ? "none" : "table"
            document.getElementById("nonEditBtn").style.display = editMode ? "none" : "unset"
    
            for (let el of tableElements) {
                el.style.display = editMode ? "table" : "none";
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

async function editAccount() {
    let user = document.getElementById("user").innerHTML
    let email = document.getElementById("email").innerHTML
    let address = document.getElementById("address").innerHTML
    let phone = document.getElementById("phone").innerHTML
    let newUser = document.getElementById("newUsername").value
    let newEmail = document.getElementById("newEmail").value
    let newAddress = document.getElementById("newAddress").value
    let newPhone = document.getElementById("newPhone").value
    let oldPass = document.getElementById("oldPass").value
    let newPass = document.getElementById("newPass").value
    let takenUsers = []
    let takenPhones = []
    let takenMails = []

    const oldData = { user, email, address, phone };
    const newData = { user: newUser, email: newEmail, address: newAddress, phone: newPhone };

    const isSame = Object.keys(oldData).every(key => oldData[key] === newData[key]);

    if (isSame) return toggleAccountEdit(false, false)

    if (!newUser || !newPhone || !newEmail || !newAddress || !oldPass) return toggleAccountEdit(true, "empty")

    const validMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    const validPhone = /^(?:\+36|06)\d{9}$/.test(newPhone);
    const validAddress = /^\d{4} [\p{L}\s\-]+, [\p{L}\s\-]+ \d+[a-zA-Z]?\.?$/u.test(newAddress);

    if (!validPhone) return toggleAccountEdit(true, "wrongPhone") 
    if (!validMail) return toggleAccountEdit(true, "wrongMail")
    if (!validAddress) return toggleAccountEdit(true, "wrongAddress")
    
    if (oldPass == newPass) return toggleAccountEdit(true, "passMatch")

    const response = await fetch(apiURL + "Users/" + user)
    const result = await response.json()
    
    if (oldPass != result.user.password) return toggleAccountEdit(true, "wrongPass")

    await fetch(apiURL + "Users")
    .then(response => response.json())
    .then(result => {
        for (let index = 0; index < result.length; index++) {
            takenUsers.push(result[index].name);
            takenMails.push(result[index].email);
            takenPhones.push(result[index].phone);
        };
    });

    if (takenUsers.includes(newUser) && newUser != user) return toggleAccountEdit(true, "takenUser") 

    if (takenPhones.includes(newPhone) && newPhone != phone) return toggleAccountEdit(true, "takenPhone") 

    if (takenMails.includes(newEmail) && newEmail != email) return toggleAccountEdit(true, "takenMail")

    alert("Siker")

    if (!newPass) {
        newPass = oldPass
    }

    await fetch(apiURL + "Users/" + user, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": newUser,
            "password": newPass,
            "address": newAddress,
            "email": newEmail,
            "phone": newPhone
        })
    })
    document.getElementById("newPass").value = ""
    document.getElementById("oldPass").value = ""
    await LoadUser()
    toggleAccountEdit(false, false)
}

async function logOut() {
    let user = window.sessionStorage.getItem("username") || window.localStorage.getItem("username")
    let pass = window.sessionStorage.getItem("password") || window.localStorage.getItem("password")
    if (user && pass) {
        window.localStorage.removeItem("username")
        window.localStorage.removeItem("password")
        window.sessionStorage.removeItem("username")
        window.sessionStorage.removeItem("password")
        if (!mobile) {
            window.location.replace("main.html?platform=set")
        } else {
            window.location.replace("mobile-main.html?platform=set")
        }
    } else {
        window.location.replace("index.html")
    }
}