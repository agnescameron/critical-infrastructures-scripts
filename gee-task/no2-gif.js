var collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2')
  .select('tropospheric_NO2_column_number_density')
  .filterDate('2024-02-06', '2024-03-06');

print(collection);

var dayList = ee.List.sequence(40, 60, 1);

// this will make a list of composite images, one for each day
var composites = dayList.map(function(startDay) {
  startDay = ee.Number(startDay);

  return collection
    .filter(ee.Filter.calendarRange(startDay, startDay.add(1), 'day_of_year'))
    .reduce(ee.Reducer.mean());
});

// Convert the image List to an ImageCollection.
var compCol = ee.ImageCollection.fromImages(composites);

var band_viz = {
  min: -1,
  max: 2.0,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};


// Define the regional bounds of animation frames.
var region = ee.Geometry.Polygon(
  [[[-20, 20],
    [-20, 62],
    [20, 62],
    [20, 20]]],
  null, false
);

var gifParams = {
  'region': region,
  'dimensions': 600,
  'crs': 'EPSG:3857',
  'framesPerSecond': 2
};

// Create RGB visualization images for use as animation frames.
var rgbVis = compCol.map(function(img) {
  return img.visualize(band_viz);
});

print(rgbVis.getVideoThumbURL(gifParams));

