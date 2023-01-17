class Register {
  constructor(registerForm, fields) {
    this.registerForm = registerForm;
    this.fields = fields;

    this.validateOnSubmit();
  }

  validateOnSubmit() {
    let self = this;

    this.registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      var nume = document.querySelector("#nume").value;
      var prenume = document.querySelector("#prenume").value;
      var firma = document.querySelector("#firma").value;
      var cnp = document.querySelector("#cnp").value;
      var mail = document.querySelector("#registermail").value;
      var phone = document.querySelector("#phone").value;
      var adresa = document.querySelector("#adresa").value;
      var pass = document.querySelector("#registerpass").value;
      if (mail != "turbinemanager13@gmail.com") {
        if (
          nume == "" ||
          prenume == "" ||
          firma == "" ||
          cnp == "" ||
          mail == "" ||
          phone == "" ||
          adresa == "" ||
          pass == ""
        ) {
          const displayError = document.getElementById("errormessage");
          displayError.innerHTML = "The fields must be completed";
        } else {
          var validationMessage = "";

          //validation for name

          if (!nume.match(/^[A-Za-z ]+$/)) {
            validationMessage =
              "First name is not correct! It should contain only letters";
          }
          if (!prenume.match(/^[A-Za-z ]+$/)) {
            validationMessage =
              "Second name is not correct! It should contain only letters";
          }
          if (!firma.match(/[a-zA-Z0-9_/-/.]+$/)) {
            validationMessage = "Company name is not correct!";
          }
          if (!cnp.match(/[0-9]{13}/)) {
            validationMessage = "Cnp should have 13 digits";
          }
          if (!phone.match(/[0-9]{10}/)) {
            validationMessage = "Phone should have 10 digits";
          }
          if (!adresa.match(/[a-zA-Z0-9_/-/./_ ]+$/)) {
            validationMessage = "Address should be correct";
          }
          if (!pass.match(/^[a-zA-Z0-9_/-/./=/_]{8}/)) {
            validationMessage = "Password must be 8 characters long";
          }
          const displayError = document.getElementById("errormessage");
          displayError.innerHTML = validationMessage;
          // check if all the tests passed

          if (validationMessage == "") {
            postTheData(nume, prenume, firma, cnp, mail, phone, adresa, pass);
          }
        }
      } else {
        const displayError = document.getElementById("errormessage");
        displayError.innerHTML = "You can't use this email";
      }
    });
  }
}

async function postTheData(
  nume,
  prenume,
  firma,
  cnp,
  mail,
  phone,
  adresa,
  pass
) {
  const response = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstName: nume,
      lastName: prenume,
      company: firma,
      CNP: cnp,
      mail: mail,
      phone: phone,
      adress: adresa,
      password: pass,
    }),
    headers: {
      "Content-type": "application/json;",
    },
  });

  const data = await response.json();
  console.log(response);
  if (response.status == 201) {
    console.log("Register successful");
    window.location.href = "http://localhost:5001/pages/login";
  } else {
    console.log("User with this data already exists");

    const displayError = document.getElementById("errormessage");
    displayError.innerHTML = "A field is duplicate";
  }
}

const registerForm = document.querySelector(".signup");

if (registerForm) {
  const fields = [
    "nume",
    "prenume",
    "firma",
    "cnp",
    "mail",
    "phone",
    "adresa",
    "pass",
  ];
  const validator = new Register(registerForm, fields);
}
