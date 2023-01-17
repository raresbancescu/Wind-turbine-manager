function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
async function putUserData() {
  const user_id = getCookie("user_id");
  const data = await fetch("http://localhost:5000/api/users/" + user_id);
  const user_data = await data.json();
  console.log(user_data);
  var birthdate = new Date(user_data.birthDate);
  var day = birthdate.getDay();
  if (day < 10) {
    day = "0" + day;
  }
  var month = birthdate.getMonth();
  if (month < 10) {
    month = "0" + month;
  }
  const year = birthdate.getFullYear();
  const formedData = year + "-" + month + "-" + day;
  console.log(formedData);
  //put the current values in first form fields
  document
    .getElementById("firstname")
    .setAttribute("value", user_data.firstName);
  document
    .getElementById("secondname")
    .setAttribute("value", user_data.lastName);
  document.getElementById("company").setAttribute("value", user_data.company);
  document.getElementById("cnp").setAttribute("value", user_data.CNP);
  document.getElementById("mail").setAttribute("value", user_data.mail);
  document.getElementById("phone").setAttribute("value", user_data.phone);
  document.getElementById("address").setAttribute("value", user_data.adress);
  document.getElementById("date").setAttribute("value", `${formedData}`);
}
async function changeDetailsFirstForm() {
  var firstName = document.getElementById("firstname").value;
  var secondName = document.getElementById("secondname").value;
  var company = document.getElementById("company").value;
  var mail = document.getElementById("mail").value;
  var phone = document.getElementById("phone").value;
  var address = document.getElementById("address").value;
  var validationMessage = "";
  console.log(mail);
  if (
    firstName == "" ||
    secondName == "" ||
    company == "" ||
    cnp == "" ||
    mail == "" ||
    phone == "" ||
    address == ""
  ) {
    document.getElementById("error").innerText = "All fields should be filled";
  } else {
    if (!firstName.match(/^[A-Za-z ]+$/)) {
      validationMessage =
        "First name is not correct! It should contain only letters";
    }
    if (!secondName.match(/^[A-Za-z ]+$/)) {
      validationMessage =
        "Second name is not correct! It should contain only letters";
    }
    if (!company.match(/[a-zA-Z0-9_/-/.]+$/)) {
      validationMessage = "Company name is not correct!";
    }
    if (!phone.match(/[0-9]{10}/)) {
      validationMessage = "Phone should have 10 digits";
    }
    if (!address.match(/[a-zA-Z0-9_/-/./_ ]+$/)) {
      validationMessage = "Address should be correct";
    }
  }
  if (validationMessage != "") {
    document.getElementById("error").innerText = validationMessage;
  } else {
    putTheDataFirstForm(firstName, secondName, company, mail, phone, address);
    document.getElementById("error").innerText = "User details changed";
  }
}

async function putTheDataFirstForm(
  firstName,
  secondName,
  company,
  mail,
  phone,
  address
) {
  const id = getCookie("user_id").valueOf();
  const newUserData = {
    firstName: firstName,
    lastName: secondName,
    company: company,
    mail: mail,
    phone: phone,
    adress: address,
  };
  console.log(newUserData);
  const response = await axios({
    method: "put",
    url: `http://localhost:5000/api/users/${id}`,
    data: JSON.stringify(newUserData),
  });
}

async function putTheDataSecondForm(password) {
  const id = getCookie("user_id").valueOf();
  const newUserData = {
    password: password,
  };
  const response = await axios({
    method: "put",
    url: `http://localhost:5000/api/users/${id}`,
    data: JSON.stringify(newUserData),
  });
}

function changeDetailsSecondForm() {
  password = document.getElementById("newpass").value;
  confirmPassword = document.getElementById("confpass").value;
  if (password != "") {
    if (!password.match(/^[a-zA-Z0-9_/-/./=/_]{8}/)) {
      document.getElementById("passvalidation").innerText =
        "8 characters minimum";
    } else {
      if (password == confirmPassword) {
        document.getElementById("passvalidation").innerText = "";
        putTheDataSecondForm(password);
        document.getElementById("passvalidation").innerText =
          "Password changed";
        console.log("s a reusit");
      } else {
        document.getElementById("passvalidation").innerText =
          "password must match";
      }
    }
  }
}

function preventForm() {
  document.getElementById("firstForm").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  document.getElementById("secondForm").addEventListener("submit", (e) => {
    e.preventDefault();
  });
}
preventForm();
putUserData();
function firstForm() {
  console.log("apasat");
  changeDetailsFirstForm();
}

function secondForm() {
  console.log("apasat");
  changeDetailsSecondForm();
}
