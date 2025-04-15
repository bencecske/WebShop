const apiURL = "https://locator-dat-freebsd-wrapping.trycloudflare.com/"

const platform = localStorage.getItem("platform");

const params = new URLSearchParams(window.location.search);

if (params.get("platform") != "set") {
  window.location.replace("index.html");
}

const url = window.location.href;

let mobile;

if (url.includes("cart")) {
  LoadCart(true);
} else {
  if (url.includes("main")) {
    GetJSON();
  }
  LoadCart(false);
}

async function LoadCart(isCart) {
  if (url.includes("mobile")) {
    mobile = true;
  }
  let user = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
  if (user) {
    const response = await fetch(apiURL + "Users/" + user);
    const result = await response.json();
    var inCartNow = result.user.inCart;
    if (inCartNow <= 9) {
      if (!mobile) {
        document.getElementById("cartCount").innerHTML = inCartNow;
      } else {
        document.getElementById("cartCount").innerHTML = "Kosár (" + inCartNow + ")";
      }
    } else {
      if (!mobile) {
        document.getElementById("cartCount").innerHTML = "9+";
      } else {
        document.getElementById("cartCount").innerHTML = "Kosár (9+)";
      }
    }
    if (isCart) {
      for (let i = 0; i < inCartNow; i++) {
        const ID = result.user.inCartID[i];
        const req = await fetch(apiUrl + "Items/" + ID);
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
                document.getElementById(`CartItemImg${ID}`).style.backgroundImage = `url(${res.item.Img})`;
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
        LoadItems(i, item.item.name, item.item.group, item.item.type, item.item.price, item.item.description, item.item.Img, item.item.ID);
      }
    } catch (error) {
      //baj
    }
}

function LoadItems(number, name, group, type, price, description, img, id) {
    if (url.includes("mobile")) {
      mobile = true;
    }
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
              document.getElementById(`item${number}`).style.backgroundImage = `url(${img})`;
              document.getElementById(`item${number}_name`).innerHTML = name;
              document.getElementById(`item${number}_description`).innerHTML = description;
              document.getElementById(`item${number}_price`).innerHTML = price;
            } else {
              document.getElementById(`item${number}_img`).src = img;
              document.getElementById(`item${number}_name`).innerHTML = name;
              document.getElementById(`item${number}_description`).innerHTML = description;
              document.getElementById(`item${number}_price`).innerHTML = price;
            }
        }
    }
    rawFile.send();
}
