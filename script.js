let map;


async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: 34.792, lng: -81.644 },
        
        zoom: 8,
    });
   
    // Read the CSV file and add markers to the map
    const logBook = document.querySelector("#logbook");


    fetch('hikelog.csv') // Replace 'yourfile.csv' with the path to your CSV file
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const pathCoordinates = [];
        for (let i = 1; i < lines.length; i++) {
          const [latitude, longitude, info] = lines[i].split(',');
          const log = document.createElement("div");
          
          log.id = i;
          log.classList.add('log');
          log.textContent = info;

          logBook.appendChild(log);

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

        logBook.addEventListener('scroll', () => {
          const scrollLeft = logBook.scrollLeft;
          const containerWidth = logBook.clientWidth;

          const center = scrollLeft + containerWidth / 2;

          const centeredDiv = Array.from(logBook.children).find((div) => {
            const divLeft = div.offsetLeft;
            const divWidth = div.clientWidth;
            return divLeft <= center && divLeft + divWidth >= center;
          });
          const [latitude, longitude, info] = lines[centeredDiv.id].split(',');
          map.panTo({lat: parseFloat(latitude), lng: parseFloat(longitude)});
        })

        
  
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
        const [latitude, longitude, info] = lines[lines.length - 1].split(',');
        console.log(latitude + " " + longitude);
        map.setCenter({lat: parseFloat(latitude), lng: parseFloat(longitude)});
        //map.center = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      })
      .catch(error => console.error('Error fetching the CSV file:', error));

  }

  initMap();

