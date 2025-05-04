function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-banner").style.display = "none";
  if (document.getElementById("terms-banner").style.display == "none") {
    document.getElementById("overlayBanner").style.display = "none"
  }
}

function acceptTerms() {
  localStorage.setItem("termsAccepted", "true");
  document.getElementById("terms-banner").style.display = "none";
  if (document.getElementById("cookie-banner").style.display == "none") {
	  document.getElementById("overlayBanner").style.display = "none"
  }
}

function openCookieDetails() {
  document.getElementById("cookie-details-popup").style.display = "block";
}
function closeCookieDetails() {
  document.getElementById("cookie-details-popup").style.display = "none";
}

function openTermsPopup() {
  document.getElementById("terms-popup").style.display = "block";
}
function closeTermsPopup() {
  document.getElementById("terms-popup").style.display = "none";
}

window.addEventListener("load", async () => {
  const respone = await fetch(apiURL + "aszf")
  const result = await respone.text()
  document.getElementById("aszf").innerHTML = result
  if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookie-banner").style.display = "block";
    document.getElementById("overlayBanner").style.display = "flex"
  }
  if (!localStorage.getItem("termsAccepted")) {
    document.getElementById("terms-banner").style.display = "block";
    document.getElementById("overlayBanner").style.display = "flex"
  }
});
