async function downloadTurbinesCSV(userId){
  const previousLink = document.getElementById('downloadLink')
  if(previousLink != null){previousLink.parentNode.removeChild()}
  const endpoint = "http://localhost:5000/api/turbines/private/" + userId + "/csv"
  const data = await fetch(endpoint)
  const csvData = await data.blob()
  let a = document.createElement("a")
  a.style.display = 'none'
  a.setAttribute('id', 'downloadLink')
  a.href = window.URL.createObjectURL(csvData)
  a.download = "turbines" + userId
  a.click()
}

const importInput = document.getElementById('csvfile-input')
const importDiv = document.getElementById('importTurbines')
const form = document.forms['csvUploadForm']
importDiv.addEventListener('click', () => importInput.click(), false)
importInput.addEventListener('change', () => form.submit())

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  console.log(formData.keys())
  await postDataToServer(formData)

  location.reload()
})

async function postDataToServer(data){
  await fetch('http://localhost:5000/api/turbines/import', {
    method: 'POST',
    body: data,
  })
}
