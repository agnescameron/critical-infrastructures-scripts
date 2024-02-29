var id = '1bGPyXFlF2jBKbAgOfloJh-TYqkNCeBkkYPf8C678b34';
var sheet_name = 'Sheet1';
var key = "AIzaSyB5b_wv4yQMDoHTCDDZydcbYxLZ5ISrGbQ"
var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + id + '/values/' + sheet_name + '?alt=json&key=' + key;

function processData(rows) {

  var headers = rows[0];
  var content = document.getElementById('content');
  rows.shift();

  rows.forEach(row => {
    console.log(row)
    content.innerHTML += "<li>" + row + "</li>";
  })
}

//this gets the data from the google sheet
fetch(url)
  .then(response => response.json())
  .then(data => processData(data.values));
