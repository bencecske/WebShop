async function fetchData(){

    try{

        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://cb5f-2001-4c4c-22e1-d400-c897-dc25-fe5d-61d9.ngrok-free.app/items/3`);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const pokemonSprite = data.ID;
        const imgElement = document.getElementById("gecisfaszu");

        imgElement.innerHTML = pokemonSprite;
        imgElement.style.display = "block";
    }
    catch(error){
        alert(error)
    }
}