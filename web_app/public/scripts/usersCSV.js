async function downloadUsersCSV(){
  const previousLink = document.getElementById('downloadLink')
  if(previousLink != null){previousLink.parentNode.removeChild()}
  const endpoint = 'http://localhost:5000/api/users/csv'
  const data = await fetch(endpoint)
  const csvData = await data.blob()
  let a = document.createElement("a")
  a.style.display = 'none'
  a.setAttribute('id', 'downloadLink')
  a.href = window.URL.createObjectURL(csvData)
  a.download = "users.csv"
  a.click()
}