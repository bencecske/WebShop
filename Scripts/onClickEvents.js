function toCartClick() {
    let inCart = Number(document.getElementById("cartCount").innerHTML);
    var inCartNow = inCart + 1;
    if (inCartNow <= 9) {
        document.getElementById("cartCount").innerHTML = inCartNow;
    } else {
        document.getElementById("cartCount").innerHTML = "9+";
    }
}

function loginClick() {
    document.getElementById("login").style.display = "flex";
    document.getElementById("registration").style.display = "none";
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

function loginBtnClick() {
    window.location.replace("account.html");
}

function editClick() {
    const elements = document.getElementsByClassName("editTable");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "flex";
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


async function testAPI() {
    const url = "https://pokeapi.co/api/v2/pokemon/1";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      alert(json.id);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  }