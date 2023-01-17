const buttons = [
  document.getElementById("state"),
  document.getElementById("wind"),
  document.getElementById("energy"),
  document.getElementById("efficiency"),
];

const panels = [
  document.getElementById("statePan"),
  document.getElementById("windPan"),
  document.getElementById("energyPan"),
  document.getElementById("efficiencyPan"),
]

for(let index = 0; index < buttons.length; index++) {
  buttons[index].addEventListener('click', event => {
      panels[index].scrollIntoView({behavior: 'smooth'});
  })
}

async function maintainTurbine(id) {
  const put_turbine_api_url = `http://localhost:5000/api/turbines/${id}`;
  const newState = {
    turbineState: 'Maintenance'
  }

  await fetch(put_turbine_api_url, {
    method: "PUT",
    body: JSON.stringify(newState)
  });

  location.reload();
}

async function startTurbine(id) {
  const put_turbine_api_url = `http://localhost:5000/api/turbines/${id}`;
  const newState = {
    turbineState: 'Running'
  }

  await fetch(put_turbine_api_url, {
    method: "PUT",
    body: JSON.stringify(newState)
  });

  location.reload();
}

async function setPublic(id) {
  const put_turbine_api_url = `http://localhost:5000/api/turbines/${id}`;
  const newState = {
    isPublic: true
  }

  await fetch(put_turbine_api_url, {
    method: "PUT",
    body: JSON.stringify(newState)
  });

  location.reload();
}

async function setPrivate (id) {
  const put_turbine_api_url = `http://localhost:5000/api/turbines/${id}`;
  const newState = {
    isPublic: false
  }

  await fetch(put_turbine_api_url, {
    method: "PUT",
    body: JSON.stringify(newState)
  });

  location.reload();
}

async function deleteTurbine(id) {
  const put_turbine_api_url = `http://localhost:5000/api/turbines/${id}`;

  await fetch(put_turbine_api_url, {
    method: "DELETE",
  });

  location.href = '/pages/owned';
}
