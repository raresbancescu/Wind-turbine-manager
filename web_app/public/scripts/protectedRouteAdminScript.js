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

async function check()
{
    const response = await fetch(
        'http://localhost:5000/api/users/mail/turbinemanager13%40gmail%2Ecom'
    );
    const data = await response.json();
    var checkCookie = getCookie("admin_id");
        console.log(data._id)
    if (!checkCookie || checkCookie.valueOf() != data._id) {
      window.location.href = 'http://localhost:5001/unauthorized'
    }
}
check()