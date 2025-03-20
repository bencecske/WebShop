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

async function loginBtnClick() {
    const apiUrl = 'https://cb5f-2001-4c4c-22e1-d400-c897-dc25-fe5d-61d9.ngrok-free.app/login/';
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(userData => {
        alert('User Data:', userData);
      })
      .catch(error => {
        alert('Error:', error);
      });
    //window.location.replace("account.html");
    }

function editClick() {
    const elements = document.getElementsByClassName("editTable");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "contents";
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