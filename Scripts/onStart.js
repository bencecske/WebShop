let url;

let mobile;

let user;

async function onStart() {
  await LoadUser();

  const params = new URLSearchParams(window.location.search);

  if (params.get("platform") != "set") {
    window.location.replace("index.html");
  }

  url = window.location.href;

  if (url.includes("mobile")) {
    mobile = true;
  }
  
  if (url.includes("account") && !user) {
    window.location.replace("index.html")
  }

  if (!url.includes("admin")) {
    if (url.includes("pay")) {
      LoadPay();
      LoadCart(false);
    } else if (url.includes("account")) {
      LoadAccount()
      LoadCart(false);
    } else {
      if (url.includes("cart")) {
        LoadCart(true);
      } else {
        if (url.includes("main")) {
          GetJSON();
        }
        LoadCart(false);
      }
    }
  }
}

async function LoadUser() {
  let checkUser = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
  let checkPassword = window.sessionStorage.getItem('password') || window.localStorage.getItem('password')
  let result
  if (checkUser && checkPassword) {
    const response = await fetch(apiURL + "users/" + checkUser)
    result = await response.json();
    if (response.ok) {
      if (result.user.password == checkPassword) {
        user = checkUser
      } else {
        user = null
      }
    } else {
      user = null
    }
  } else {
    user = null
  }
  url = window.location.href;
  if (url.includes("account")) {
    if (!user) {
      window.location.replace("index.html")
    }
    let username
    let email
    let address
    let phone
    username = result.user.name
    email = result.user.email
    address = result.user.address
    phone = result.user.phone
    if (!address) {
      address = "Add meg a szállítási címet!"
    }
    document.getElementById("user").innerHTML = username
    document.getElementById("email").innerHTML = email
    document.getElementById("address").innerHTML = address
    document.getElementById("phone").innerHTML = phone
  }
}

async function LoadAccount() {
  if (user) {
    const response = await fetch(apiURL + "Users/" + user);
    const result = await response.json();
    let length = result.user.orders.length - 1;
    for (let i = length; i >= 0; i--) {
      let ID = result.user.orders[i]
      const req = await fetch(apiURL + "Datas/" + ID)
      const res = await req.json();
      const order = res.order;
      if (order) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", "Elements/AccountList.html", true);
        rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4) {
            var allText = rawFile.responseText;
            if (mobile) {
              allText = allText.replace(`<td id="Date">2025.04.21</td>`, "")
            }
            document.getElementById("orderList").innerHTML += allText;
            const idMap = {
              "Order": `Order${ID}`,
              "Date": `Date${ID}`,
              "Status": `Status${ID}`,
              "checkOrder": `checkOrder${ID}`,
              "cancelOrder": `cancelOrder${ID}`,
            };
            for (const [oldId, newId] of Object.entries(idMap)) {
              const el = document.getElementById(oldId);
              if (el) el.id = newId;
            }
            document.getElementById(`Order${ID}`).innerHTML = `#${ID}`
            if (!mobile) {
              document.getElementById(`Date${ID}`).innerHTML = new Date(order.date * 1000).toLocaleString("hu-HU");
            }
            const statusTexts = {
              0: `Feldolgozás alatt`,
              1: `Kiszállítás alatt`,
              2: `Kézbesítve`,
              3: `Lezárva`
            };
            let status = statusTexts[order.status] || "Ismeretlen státusz";
            document.getElementById(`Status${ID}`).innerHTML = status
          }
        }
        rawFile.send();
      }
    }
  }
}

async function LoadPay() {
  if (user) {
    const response = await fetch(apiURL + "Users/" + user);
    const result = await response.json();
    const inCart = result.user.inCart;
    const cartItem = result.user.inCartID;
    for (let i = 0; i < inCart; i++) {
      const req = await fetch(apiURL + "Items/" + cartItem[i])
      const res = await req.json();
      if (!document.getElementById(`item${cartItem[i]}`)) {
        document.getElementById("items").innerHTML += `
          <tr>
            <td id="item${cartItem[i]}">${res.item.name}</td>
            <td id="itemCount${cartItem[i]}">1</td>
            <td id="perItem${cartItem[i]}">${res.item.price}</td>
            <td id="allItem${cartItem[i]}">${res.item.price}</td>
          </tr>
        `;
        let price = parseInt(document.getElementById("endPrice").innerHTML.replace(/\./g, '').replace(/\s?Ft/g, ''))
        let newPrice = price + parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
        document.getElementById("endPrice").innerHTML = newPrice.toLocaleString('de-DE') + " Ft"
      } else {
        let count = Number(document.getElementById(`itemCount${cartItem[i]}`).innerHTML) + 1
        document.getElementById(`itemCount${cartItem[i]}`).innerHTML = count;
        let price = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
        let allPrice = price * count
        document.getElementById(`allItem${cartItem[i]}`).innerHTML = allPrice.toLocaleString('de-DE') + " Ft"
        let OldPrice = parseInt(document.getElementById("endPrice").innerHTML.replace(/\./g, '').replace(/\s?Ft/g, ''))
        let newPrice = OldPrice + parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
        document.getElementById("endPrice").innerHTML = newPrice.toLocaleString('de-DE') + " Ft"
      }
    }
  }
}

async function LoadCart(isCart) {
  if (user) {
    const response = await fetch(apiURL + "Users/" + user);
    const result = await response.json();
    var inCartNow = result.user.inCart;
    if (inCartNow <= 9) {
      if (!mobile) {
        document.getElementById("cartCount").innerHTML = inCartNow;
      } else {
        document.getElementById("cartCount").innerHTML = "Kosár (" + inCartNow + ")";
        if (document.getElementById("cartCountH")) {
          document.getElementById("cartCountH").innerHTML = inCartNow;
        }
      }
    } else {
      if (!mobile) {
        document.getElementById("cartCount").innerHTML = "9+";
      } else {
        document.getElementById("cartCount").innerHTML = "Kosár (9+)";
        if (document.getElementById("cartCountH")) {
          document.getElementById("cartCountH").innerHTML = "9+";
        }
      }
    }
    if (isCart) {
      for (let i = 0; i < inCartNow; i++) {
        const ID = result.user.inCartID[i];
        const req = await fetch(apiURL + "Items/" + ID);
        const res = await req.json();
        if (!document.getElementById(`CartItem${ID}`)) {
          var rawFile = new XMLHttpRequest();
          if (!mobile) {
            rawFile.open("GET", "Elements/CartItem.html", true);
          } else {
            rawFile.open("GET", "Elements/MobileCartItem.html", true);
          }
          rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4) {
            var allText = rawFile.responseText;
            if (!document.getElementById(`CartItem${ID}`)) { 
              let submitBtn = document.getElementById("beforeBtn");
              if (mobile) {
                submitBtn = document.getElementById("fullPrice");
              }
              submitBtn.insertAdjacentHTML("beforebegin", allText);
              const idMap = {
                "newCartItem": `CartItem${ID}`,
                "newCartItemImg": `CartItemImg${ID}`,
                "newCartTitle": `CartTitle${ID}`,
                "newCartDescription": `CartDescription${ID}`,
                "newCartPrice": `CartPrice${ID}`,
                "newCartMinus": `CartMinus${ID}`,
                "newCartPlus": `CartPlus${ID}`,
                "newCartBin": `CartBin${ID}`,
                "newCartCount":`CartCount${ID}`
              };

              for (const [oldId, newId] of Object.entries(idMap)) {
                const el = document.getElementById(oldId);
                if (el) el.id = newId;
              }

              if (!mobile) {
                document.getElementById(`CartItemImg${ID}`).style.backgroundImage = `url(${apiURL}Images/${res.item.Img})`;
                document.getElementById(`CartTitle${ID}`).innerHTML = res.item.name;
                document.getElementById(`CartDescription${ID}`).innerHTML = res.item.description;
                document.getElementById(`CartPrice${ID}`).innerHTML = res.item.price; 
              } else {
                document.getElementById(`CartTitle${ID}`).innerHTML = res.item.name;
                document.getElementById(`CartDescription${ID}`).innerHTML = res.item.description;
                document.getElementById(`CartPrice${ID}`).innerHTML = res.item.price;
                const endPrice = parseInt(document.getElementById("maxPrice").innerHTML.replace("Végösszeg: ", "").replace(/\./g, '').replace(/\s?Ft/g, '')) + parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
                document.getElementById("maxPrice").innerHTML = "Végösszeg: " + endPrice.toLocaleString('de-DE') + " Ft"
              }
            }
          }
        }
        rawFile.send();
        } else {
          if (!mobile) {
            const count = parseInt(document.getElementById(`CartItemImg${ID}`).innerHTML) + 1;
            document.getElementById(`CartItemImg${ID}`).innerHTML = count;
            const ItemPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
            const price = parseInt(document.getElementById(`CartPrice${ID}`).innerHTML.replace(/\./g, '').replace(/\s?Ft/g, '')) + ItemPrice
            document.getElementById(`CartPrice${ID}`).innerHTML = price.toLocaleString('de-DE') + " Ft"
          } else {
            const count = parseInt(document.getElementById(`CartCount${ID}`).innerHTML.replace("Mennyiség: ", "")) + 1
            const ItemPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
            const price = parseInt(document.getElementById(`CartPrice${ID}`).innerHTML.replace(/\./g, '').replace(/\s?Ft/g, '')) + ItemPrice
            document.getElementById(`CartCount${ID}`).innerHTML = "Mennyiség: " + count
            document.getElementById(`CartPrice${ID}`).innerHTML = price.toLocaleString('de-DE') + " Ft"
            const endPrice = parseInt(document.getElementById("maxPrice").innerHTML.replace("Végösszeg: ", "").replace(/\./g, '').replace(/\s?Ft/g, '')) + parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
            document.getElementById("maxPrice").innerHTML = "Végösszeg: " + endPrice.toLocaleString('de-DE') + " Ft"
          }
        }
      }
    }
  }
}

async function GetJSON() {
    try {
      const response = await fetch(apiURL + "Items/");
      const result = await response.json();
      for (let i = 1; i <= result.length; i++) {
        const res = await fetch(apiURL + "Items/" + i + "/");
        const item = await res.json();
        if (item.item.count > 0) {
          LoadItems(i, item.item.name, item.item.group, item.item.type, item.item.price, item.item.description, item.item.Img, item.item.ID);
        }
      }
      url = window.location.href;
      if (!mobile) {
        if (!document.body.innerHTML.includes("cardItem") && url.includes("main")) {
          document.body.innerHTML += 
          `<div style="top: 80px; position: absolute; text-align: center;">
            <h1>Sajnos jelenleg nincs semmilyen termék raktáron!</h1>
          </div>`
        }
      } else {
        if (!document.getElementById("main-container").innerHTML.includes("product-card") && url.includes("main")) {
          document.getElementById("main-container").innerHTML += 
          `<div style="top: 80px; position: absolute; text-align: center;">
            <h1>Sajnos jelenleg nincs semmilyen termék raktáron!</h1>
          </div>`
        }
      }
    } catch (error) {
      //baj
    }
}

function LoadItems(number, name, group, type, price, description, img, id) {
    var rawFile = new XMLHttpRequest();
    if (!mobile) {
      rawFile.open("GET", "Elements/CardItem.html", true);
    } else {
      rawFile.open("GET", "Elements/MobileCardItem.html", true);
    }
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
            if (!mobile) {
              document.body.innerHTML += allText;
            } else {
              document.getElementById("main-container").innerHTML += allText;
            }
            const idMap = {
              "NewCardItem": "item" + number,
              "NewCardImg": "item" + number + "_img",
              "toCartBtn": "toCartBtn" + number,
              "NewCardTitle": "item" + number + "_name",
              "NewCardDescription": "item" + number + "_description",
              "NewCardPrice": "item" + number + "_price"
            };
            
            for (const [oldId, newId] of Object.entries(idMap)) {
              const el = document.getElementById(oldId);
              if (el) el.id = newId;
            }
            
            if (!mobile) {
              document.getElementById(`item${number}`).style.backgroundImage = `url(${apiURL}Images/${img})`;
              document.getElementById(`item${number}_name`).innerHTML = name;
              document.getElementById(`item${number}_description`).innerHTML = description;
              document.getElementById(`item${number}_price`).innerHTML = price;
            } else {
              document.getElementById(`item${number}_img`).src = `${apiURL}Images/${img}`;
              document.getElementById(`item${number}_name`).innerHTML = name;
              document.getElementById(`item${number}_description`).innerHTML = description;
              document.getElementById(`item${number}_price`).innerHTML = price;
            }
        }
    }
    rawFile.send();
  }