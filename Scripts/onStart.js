const apiURL = "https://meet-amateur-denial-toe.trycloudflare.com/"

const url = window.location.href;

if (url.includes("cart")) {
  LoadCart(true);
} else {
  if (url.includes("main")) {
    GetJSON();
  }
  LoadCart(false);
}

async function LoadCart(isCart) {
  let user = window.sessionStorage.getItem('username') || window.localStorage.getItem('username')
  if (user) {
    const response = await fetch(apiURL + "Users/" + user);
    const result = await response.json();
    var inCartNow = result.user.inCart;
    if (inCartNow <= 9) {
      document.getElementById("cartCount").innerHTML = inCartNow;
    } else {
      document.getElementById("cartCount").innerHTML = "9+";
    }
    if (isCart) {
      for (let i = 0; i < inCartNow; i++) {
        const ID = result.user.inCartID[i];
        const req = await fetch(apiUrl + "Items/" + ID);
        const res = await req.json();
        if (!document.getElementById(`CartItem${ID}`)) {
          var rawFile = new XMLHttpRequest();
          rawFile.open("GET", "Elements/CartItem.html", true);
          rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4) {
            var allText = rawFile.responseText;
            if (!document.getElementById(`CartItem${ID}`)) { 
              const submitBtn = document.getElementById("beforeBtn");
              submitBtn.insertAdjacentHTML("beforebegin", allText);
              const idMap = {
                "newCartItem": `CartItem${ID}`,
                "newCartItemImg": `CartItemImg${ID}`,
                "newCartTitle": `CartTitle${ID}`,
                "newCartDescription": `CartDescription${ID}`,
                "newCartPrice": `CartPrice${ID}`,
                "newCartMinus": `CartMinus${ID}`,
                "newCartPlus": `CartPlus${ID}`,
                "newCartBin": `CartBin${ID}`
              };

              for (const [oldId, newId] of Object.entries(idMap)) {
                const el = document.getElementById(oldId);
                if (el) el.id = newId;
              }

              document.getElementById(`CartItemImg${ID}`).style.backgroundImage = `url(${res.item.Img})`;
              document.getElementById(`CartTitle${ID}`).innerHTML = res.item.name;
              document.getElementById(`CartDescription${ID}`).innerHTML = res.item.description;
              document.getElementById(`CartPrice${ID}`).innerHTML = res.item.price; 
            }
          }
        }
        rawFile.send();
        } else {
          const count = parseInt(document.getElementById(`CartItemImg${ID}`).innerHTML) + 1;
          document.getElementById(`CartItemImg${ID}`).innerHTML = count;
          const ItemPrice = parseInt(res.item.price.replace(/\./g, '').replace(/\s?Ft/g, ''))
          const price = parseInt(document.getElementById(`CartPrice${ID}`).innerHTML.replace(/\./g, '').replace(/\s?Ft/g, '')) + ItemPrice
          document.getElementById(`CartPrice${ID}`).innerHTML = price.toLocaleString('de-DE') + " Ft"
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
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "Elements/CardItem.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
            document.body.innerHTML += allText;
            const idMap = {
              "newCardItem": "item" + number,
              "toCartBtn": "toCartBtn" + number,
              "newCardItem_Name": "item" + number + "_name",
              "newCardItem_Description": "item" + number + "_description",
              "newCardItem_Price": "item" + number + "_price"
            };
            
            for (const [oldId, newId] of Object.entries(idMap)) {
              const el = document.getElementById(oldId);
              if (el) el.id = newId;
            }
            
            document.getElementById(`item${number}`).style.backgroundImage = `url(${img})`;
            document.getElementById(`item${number}_name`).innerHTML = name;
            document.getElementById(`item${number}_description`).innerHTML = description;
            document.getElementById(`item${number}_price`).innerHTML = price;
        }
    }
    rawFile.send();
}
