var id = '1hYu36_X0pmoUFSHooBS8d8zYDjHUdFt5w9b-_KD19Dc';
var sheet_name = 'DGU_Recent';
var key = "AIzaSyB5b_wv4yQMDoHTCDDZydcbYxLZ5ISrGbQ"
var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + id + '/values/' + sheet_name + '?alt=json&key=' + key;

//this processes the datasets
function processData(data) {
  // console.log(data);
  var headers = data[0];
  var content = document.getElementById('content'); 
  data.shift();

  data.forEach(val => {
    console.log(val);
    content.innerHTML += "<a href=" + val[4] + "><li><b>" + val[0] + "</b>" + " - " + val[1] + "</li></a>";
  })
}


//this gets the datasets
fetch(url)
  .then(response => response.json())
  .then( data => processData(data.values));
