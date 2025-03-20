let geci;

async function get(request) {
  try {
    const response = await fetch(request);
    const result = await response.json();
    console.log("Success:", result);
    geci = result;
  } catch (error) {
    console.log("Error:", error);
    geci = error.stack;
  }
  alert(geci)
}

const getJSON = new Request("https://1645-2001-4c4c-22e1-d400-c897-dc25-fe5d-61d9.ngrok-free.app/Items/1")

get(getJSON);