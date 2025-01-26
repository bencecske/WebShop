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
    window.location.replace("login.html");
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