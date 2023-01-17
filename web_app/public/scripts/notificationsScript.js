function accept(turbineId, buyerId, notificationId) { 
    transferTurbine(turbineId, buyerId);

    removeNotification(notificationId);
}

function refuse(notificationId) {
    removeNotification(notificationId);
}

async function removeNotification(notificationId) {
    const notification = document.getElementById('id' + notificationId);
    notification.parentNode.removeChild(notification);
    
    const delete_notification_api_url = `http://localhost:5000/api/users/notifications/${notificationId}`;
    const response = await fetch(delete_notification_api_url, {
        method: 'DELETE'
    });
}

async function transferTurbine(turbineId, buyerId) {
    const put_new_user_api_url = `http://localhost:5000/api/turbines/${turbineId}`;
    const response = await fetch(put_new_user_api_url, {
        method: 'PUT',
        body : JSON.stringify({userId: buyerId})
    });
}