async function makeOffer(buyerId, sellerId, turbineId) {
  if (buyerId !== sellerId) {
    const existence = await checkIfExists(buyerId, turbineId);
    if (existence === false) {
      console.log("Creating");
      await createNotification(buyerId, sellerId, turbineId);
    }
  }
}

async function checkIfExists(buyerId, turbineId) {
  const notifications_api_url = "http://localhost:5000/api/users/notifications";
  const data = await fetch(notifications_api_url);
  const notifications = await data.json();
  console.log(notifications);
  for (notification of notifications) {
    if (
      notification.idBuyer === buyerId &&
      notification.idTurbine === turbineId
    ) {
      console.log("Offer already made");
      return true;
    }
  }

  return false;
}

async function createNotification(buyerId, sellerId, turbineId) {
  const post_notification_api_url =
    "http://localhost:5000/api/users/notifications";

  const requestBody = {
    idBuyer: buyerId,
    idSeller: sellerId,
    idTurbine: turbineId,
  };

  const response = await fetch(post_notification_api_url, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  const userName = await fetch(`http://localhost:5000/api/users/${sellerId}`);
  const data = await userName.json();

  const turbineName = await fetch(
    `http://localhost:5000/api/turbines/${turbineId}`
  );
  const turbineData = await turbineName.json();

  var params = {
    username: data.firstName,
    turbinename: turbineData.name,
    email: data.mail,
  };
  console.log(params);
  emailjs
    .send("service_wih0602", "template_n6lzaru", params)
    .then(function (res) {
      console.log("succes", res.status);
    });
}

function setSpinnersAttributes(turbines) {
  for (turbine of turbines) {
    let id = turbine.turbineData._id;
    let windSpeed = turbine.newestData.windSpeed;
    let turbineWear = turbine.newestData.turbineWear;

    let spinner = document.getElementById("id" + id);
    if (windSpeed > 0) {
      spinner.style.animationDuration = 1 / windSpeed + "s";
    }

    let turbineWearMapped = Math.floor(mapTurbineWear(turbineWear));

    let blue = 0;
    let red = 0 + turbineWearMapped;
    let green = 255 - turbineWearMapped;
    spinner.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }
}

function mapTurbineWear(turbineWear) {
  return (255 / 10) * turbineWear;
}
