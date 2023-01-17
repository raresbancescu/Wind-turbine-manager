//function for showing more details(3 lines)
function showMapOnClick(id) {
  console.log("test");
  var popUp = document.getElementById(id);
  if (popUp.classList.contains("show")) {
    popUp.classList.remove("show");
    popUp.classList.toggle("hidden");
  } else {
    popUp.classList.remove("hidden");
    popUp.classList.toggle("show");
  }
}
//function for delete the cookie when logout button is pressed
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"; // no expires for session cookie expires=0
}

//function for popup ( get the turbine owner and add his info to the popup)
async function showPublicTurbine(id, userId) {
  //starting the popup or closing
  var popUp = document.getElementById(id);

  popUp.classList.remove("hidden");
  popUp.classList.toggle("show");

  //get the data for the user
  const data = await fetch("http://localhost:5000/api/users/" + userId);
  const user = await data.json();
  //add the user data to the popup
  document.getElementById(id).getElementsByTagName("p")[1].innerHTML =
    "Company: " + user.company;
  document.getElementById(id).getElementsByTagName("p")[3].innerHTML =
    "Email: " + user.mail;
  document.getElementById(id).getElementsByTagName("p")[4].innerHTML =
    "Phone: " + user.phone;
}

function closePopup(id) {
  var popUp = document.getElementById(id);

  popUp.classList.remove("show");
  popUp.classList.toggle("hidden");
}

function logoutFunction() {
  setCookie("user_id", "", -1);
  window.location.href = `http://localhost:5001/pages/login`;
}

function accountPage() {
  window.location.href = `http://localhost:5001/pages/userDetails`;
}
