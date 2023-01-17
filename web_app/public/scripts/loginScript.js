class Login {
    constructor(loginForm, fields) {
      this.loginForm = loginForm;
      this.fields = fields;
      this.validateOnSubmit();
    }

    validateOnSubmit() {
      let self = this;
      this.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.querySelector("#email");
        const password = document.querySelector("#password");

        // console.log(encodeURIComponent(email.value).replace(/\./g, "%2E"));
        getId(
          encodeURIComponent(email.value).replace(/\./g, "%2E"),
          password.value
        );
      });
    }
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"; // no expires for session cookie expires=0
  }

  // function for getting the user data to check the login
  async function getId(mail, password) {
    const response = await fetch(
      `http://localhost:5000/api/users/login/${mail}/${password}`
    );
    const data = await response.json();
    if (mail != "turbinemanager13%40gmail%2Ecom") {
      console.log(mail)
      if (mail != "" || password != "") {
        console.log(data.message);
        if (response.status == 200) {
          console.log("Login successful");
          setCookie("user_id", data._id, 0);
          window.location.href = 'http://localhost:5001/pages/owned';
        } else {
          const printError = document.getElementById("errormessage");
          printError.innerHTML = `${data.message}`;
        }
      } else {
        const printError = document.getElementById("errormessage");
        printError.innerHTML = "Fields are required";
      }
    }
    else
    {
     
      if (response.status==200)
      {
        
        setCookie("admin_id",data._id,0)
        window.location.href=`http://localhost:5001/pages/admin`
      }
      else
      {
        const printError = document.getElementById("errormessage");
          printError.innerHTML = `${data.message}`;
      }
    }
  }

  const loginForm = document.querySelector(".login");

  if (loginForm) {
    console.log("login");
    const fields = ["email", "password"];
    const validator = new Login(loginForm, fields);
  }