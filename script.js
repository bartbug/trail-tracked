let map;

function readCSV(input) {
  let header;
  let lines;
  
  fetch(input)
    .then(response => response.text())
    .then(data => {
      lines = data.split('\n');
      header = lines[0].split(',');
      console.log(header);

      

    });
    console.log(header);
    return {
      a: header,
      b: lines
    }
}

async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: 34.792, lng: -81.644 },
        
        zoom: 8,
    });
   
    // Read the CSV file and add markers to the map
    fetch('hikelog.csv') // Replace 'yourfile.csv' with the path to your CSV file
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const pathCoordinates = [];
        for (let i = 1; i < lines.length; i++) {
          const [latitude, longitude, info] = lines[i].split(',');
          if (latitude && longitude) {
            const marker = new google.maps.Marker({
              position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
              map: map,
              title: info,
            });
  
            pathCoordinates.push(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
  
            const infowindow = new google.maps.InfoWindow({
              content: `<p>${info}</p>`,
            });
  
            marker.addListener('click', () => {
              infowindow.open(map, marker);
            });
          }
        }

        const [latitude, longitude] = lines[lines.length].split(',');
        map.center = { lat: latitude, lng: longitude };
  
        // Create a Polyline using the pathCoordinates array
        const polyline = new google.maps.Polyline({
          path: pathCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
  
        // Set the Polyline on the map
        polyline.setMap(map);
      })
      .catch(error => console.error('Error fetching the CSV file:', error));
  }

  initMap();

  let x = readCSV('hikelog.csv');
  console.log(x.a);
