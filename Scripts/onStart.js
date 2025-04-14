const apiURL = "https://meet-amateur-denial-toe.trycloudflare.com/"

GetJSON();
LoadCart();

async function LoadCart() {
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
  }
}

async function GetJSON(request) {
    try {
      const response = await fetch(apiURL + "Items/");
      const result = await response.json();
      for (let i = 1; i <= result.length; i++) {
        const res = await fetch(apiURL + "Items/" + i + "/");
        const item = await res.json();
        LoadItems(i, item.item.name, item.item.group, item.item.type, item.item.price, item.item.description, item.item.Img, item.item.ID);
      }
    } catch (error) {
      //baj xd
    }
}

function LoadItems(number, name, group, type, price, description, img, id) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "Elements/CardItem.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
            document.body.innerHTML += allText;
            document.getElementById("newCardItem").id = "item" + number;
            document.getElementById("toCartBtn").id = "toCartBtn" + number;
            document.getElementById("item" + number).style.backgroundImage = 'url('+img+')';
            document.getElementById("newCardItem_Name").id = "item" + number + "_name";
            document.getElementById("item" + number + "_name").innerHTML = name;
            document.getElementById("newCardItem_Description").id = "item" + number + "_description";
            document.getElementById("item" + number + "_description").innerHTML = description;
            document.getElementById("newCardItem_Price").id = "item" + number + "_price";
            document.getElementById("item" + number + "_price").innerHTML = price;
        }
    }
    rawFile.send();
}

async function get(request) {
    try {
      const response = await fetch(request);
      const result = await response.json();
      alert(result.item.name);
    } catch (error) {
      //baj
    }
}
