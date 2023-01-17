function expand(img, id) {
    const content = document.getElementById('id' + id);
    content.classList.toggle('expand');
    img.classList.toggle('rotate');
}

function setCookie(name, value, days) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/' // no expires for session cookie expires=0
}

async function deleteUser(id) {
    const delete_user_api_url = `http://localhost:5000/api/users/${id}`;

    const div = document.getElementById('uid' + id);
    div.parentElement.removeChild(div);

    const response = await fetch(delete_user_api_url, {
        method: "DELETE"
    });
    console.log(response);
}

function backToLogin(){
    setCookie('admin_id', "", -1)
    window.location.href = '/pages/login'
}