let public = false;

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

async function postTurbine(turbine) {
  const turbine_post_new_data_api_url = `http://localhost:5000/api/turbines`;
  const response = await fetch(turbine_post_new_data_api_url, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(turbine),
    headers: { "Content-Type": "application/json" },
  });

  console.log(response);
}

function getCreateTurbineData() {
  const form = document.querySelector("form");
  let err = document.getElementById("err");
  let fields = [
    document.getElementById("lat"),
    document.getElementById("lng"),
    document.getElementById("altitude"),
    document.getElementById("soil-type"),
    document.getElementById("suitability"),
  ];

  let formFields = [
    document.getElementById("name"),
    document.getElementById("cons-date"),
    document.getElementById("image"),
  ];

  for (field of fields) {
    field.innerText = "";
  }

  for (field of formFields) {
    field.value = "";
  }

  document.addEventListener("click", (e) => {
    err.innerHTML = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let canPost = true;

    for (field of fields) {
      const text = field.innerText;
      if (text.length === 0) {
        err.innerHTML = "*Fields can't be empty";
        canPost = false;
      }
    }

    for (field of formFields) {
      const value = field.value;
      if (value.length === 0) {
        err.innerHTML = "*Fields can't be empty";
        canPost = false;
      }
    }

    var uid = getCookie("user_id");

    if (canPost) {
      const creatationDate = new Date(formFields[1].value);
      const turbine = {
        userId: uid,
        name: formFields[0].value,
        constructionYear: creatationDate.valueOf(),
        imageLink: formFields[2].value,
        latitude: fields[0].innerText,
        longitude: fields[1].innerText,
        altitude: fields[2].innerText,
        terrain: fields[3].innerText,
        suitability: fields[4].innerText,
        isPublic: public,
        turbineState: "Running",
      };

      console.log(turbine);
      postTurbine(turbine);

      window.location.href = "/pages/owned";
      console.log(turbine);
    }
  });
}

function togglePublic() {
  const checkbox = document.getElementById('public');
  public = !public;

  if(public) {
    checkbox.style.backgroundColor = '#7dd7bd';
  }
  else {
    checkbox.style.backgroundColor = 'white';
  }

  console.log(public);
}

getCreateTurbineData();
