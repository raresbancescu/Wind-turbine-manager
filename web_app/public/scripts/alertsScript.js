function redirectToDetailsPage(id, alertId) {
    removeAlert(alertId);   
    location.href = `http://localhost:5001/pages/turbineDetails/${id}`;
}

async function removeAlert(alertId) {
    const alert = document.getElementById('id' + alertId);
    console.log(alert);
    alert.parentNode.removeChild(alert);
    const delete_alert_api_url = `http://localhost:5000/api/users/alerts/${alertId}`;

    const response = await fetch(delete_alert_api_url, {
        method: 'DELETE'
    });

    console.log(response);
}