var JSONCount = 1;
var JSONName = "item" + JSONCount + ".json";

LoadJSON();

function LoadJSON() {
    var rawJSON = new XMLHttpRequest();
        rawJSON.open("GET", "/JSONs/" + JSONName, true);
        rawJSON.onreadystatechange = function() {
        if (rawJSON.readyState === 4) {
            var JSONallText = rawJSON.responseText;
            Item = JSON.parse(JSONallText);
            LoadItems(JSONCount, Item.name, Item.group, Item.type, Item.price, Item.description, Item.Img, Item.ID);
        }
    }
rawJSON.send();
}

function LoadItems(number, name, group, type, price, description, img, id) {
alert("Loading Items...");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "/Elements/CardItem.html", true);
    rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
        var allText = rawFile.responseText;
            document.body.innerHTML += allText;
            document.getElementById("newCardItem").id = "item" + number;
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
    JSONCount++;
    JSONName = "item" + JSONCount + ".json";
    LoadJSON();
}
