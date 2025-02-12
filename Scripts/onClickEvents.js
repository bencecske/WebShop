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
    document.getElementById('login').classList.toggle('show');
}

function registerClick() {
    document.getElementById('registration').classList.toggle('show');
}

function closeForm() {
    document.getElementById('login').classList.toggle('show');
    document.getElementById('registration').classList.toggle('show');
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

function testAPI() {
    const APIUrl = new URL("http://localhost:3000/api/v1/products");
    // Make a GET request
    fetch(APIUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
    }
    })
    .then(data => {
        alert(data)
    })
    .catch(error => {
        alert(error)
    });
}

function outClick() {
    const loginForm = document.getElementById("login").style.display;
    const registerForm = document.getElementById("registration").style.display;
    const menuBar = document.getElementById("menuBar").style.visibility;

    if (loginForm != "none" || reigsterForm != "none" || menuBar != "hidden") {
        document.getElementById("login").style.display = "none";
        document.getElementById("registration").style.display = "none";
        document.getElementById("menuBar").style.visibility = "hidden";
    }
}
