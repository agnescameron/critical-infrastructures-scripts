var collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2')
  .select('NO2_column_number_density')
  .filterDate('2024-01-06', '2024-03-06');

var dayList = ee.List.sequence(20, 50, 1);

function toDate(day) {
  var dayOffset = ee.Date('2024-01-01');
  return dayOffset.advance(day, 'days').format('YYYY-MM-dd');
}

// this will make a list of composite images, one for each day
var composites = dayList.map(function(startDay) {
  startDay = ee.Number(startDay);

  return collection
    .filter(ee.Filter.calendarRange(startDay, startDay.add(1), 'day_of_year'))
    .reduce(ee.Reducer.mean()).set('day_of_year', toDate(startDay));
});

// Convert the image List to an ImageCollection.
var compCol = ee.ImageCollection.fromImages(composites);
print(compCol)

var band_viz = {
  min: 0,
  max: 0.0002,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

//22.5526208,113.0339652
// Define the regional bounds of animation frames.
var region = ee.Geometry.Polygon(
  [[[110, 18],
    [110, 26],
    [120, 26],
    [120, 18]]],
  null, false
);

Map.centerObject(region);
Map.addLayer(region, {color: 'FF0000'}, 'geodesic polygon');

var gifParams = {
  'region': region,
  'dimensions': 600,
  'crs': 'EPSG:3857',
  'framesPerSecond': 3
};


var text = require('users/gena/packages:text')
// get text location
var pt = text.getLocation(region, 'left', '2%', '2%')


// Create RGB visualization images for use as animation frames.
var rgbVis = compCol.map(function(img) {
  var textVis = { fontSize: 32, textColor: 'ffffff', outlineColor: '000000', outlineWidth: 2.5, outlineOpacity: 0.6 }
  var label = text.draw(img.get('day_of_year'), pt, 1500, textVis)
  
  return img.visualize(band_viz).blend(label);
});

print(rgbVis.getVideoThumbURL(gifParams));

