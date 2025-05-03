function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  document.getElementById("cookie-banner").style.display = "none";
}

function acceptTerms() {
  localStorage.setItem("termsAccepted", "true");
  document.getElementById("terms-banner").style.display = "none";
  if (document.getElementById("cookie-banner").style.display != "none") {
	document.getElementById("cookie-banner").style.bottom = 0;
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

window.addEventListener("load", () => {
  if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookie-banner").style.display = "block";
  }
  if (!localStorage.getItem("termsAccepted")) {
    document.getElementById("terms-banner").style.display = "block";
  }
});
