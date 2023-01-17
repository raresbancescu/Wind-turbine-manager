document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
});
async function sendEmail() {
  //to this email we send the generated password
  var sendEmail = document.getElementById("email").value;

  //generate new password

  let randomPassword = Math.random().toString(16).substring(2, 32);
  

  //get the user data
  const formedEmail = encodeURIComponent(sendEmail).replace(/\./g, "%2E");
  console.log(formedEmail);
  const response = await fetch(
    `http://localhost:5000/api/users/mail/${formedEmail}`
  );
  const data = await response.json();
  console.log(data);

  //change user password

  var params = {
    to_name: data.firstName,
    message: randomPassword,
    email: sendEmail,
  };

  emailjs
    .send("service_wih0602", "template_w62kr88", params)
    .then(function (res) {
      console.log("succes", res.status);
    });
  changePassword(data._id,randomPassword)
  window.location.href="http://localhost:5001/pages/login"
  console.log(randomPassword)
}

async function changePassword(user_id,pass) {
  const id = user_id
  const newUserData = {
    password: pass,
  };
  const response = await axios({
    method: "put",
    url: `http://localhost:5000/api/users/${id}`,
    data: JSON.stringify(newUserData),
  });
}
