let map;
let infowindow;


async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: 34.792, lng: -81.644 },
        
        zoom: 8,
    });

    infowindow = new google.maps.InfoWindow();
   
    // Read the CSV file and add markers to the map
    const logBook = document.querySelector("#logbook");


    fetch('hikelog.csv') // Replace 'yourfile.csv' with the path to your CSV file
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const pathCoordinates = [];
        for (let i = 1; i < lines.length; i++) {
          const [date, title, latitude, longitude, info, url] = lines[i].split(',');
          const log = document.createElement("div");
          
          log.id = i;
          log.classList.add('log');
          log.textContent = info;

          logBook.appendChild(log);



          if (latitude && longitude) {

            let contentString;
            
            if (url) {
               contentString =
              `<div>${date}</div>` +
              `<div>${title}</div>` +
              '<div class = "twopanel">' +
              `<p>${info}</p>` +
              '<iframe width="280" height="158"' +
              `src=${url} ` +
              'title="YouTube video player" frameborder="0" allow="accelerometer; ' +
              'autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; ' +
              'web-share" allowfullscreen></iframe>' +
              '</div>';
            }
            else {
               contentString =
              `<div>${date}</div>` +
              `<div>${title}</div>` +
              `<p>${info}</p>`;
            }

            
            

            const marker = new google.maps.Marker({
              position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
              map: map,
              title: title,
              descrip: contentString,

            });


  
            pathCoordinates.push(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
            
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setOptions({
                content: this.descrip,
              });
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
          if (centeredDiv) {
            const [date, title, latitude, longitude, info, url] = lines[centeredDiv.id].split(',');
            map.panTo({lat: parseFloat(latitude), lng: parseFloat(longitude)});
          }
          
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
        const [date, title, latitude, longitude, info, url] = lines[lines.length - 1].split(',');
        console.log(latitude + " " + longitude);
        map.setCenter({lat: parseFloat(latitude), lng: parseFloat(longitude)});
      })
      .catch(error => console.error('Error fetching the CSV file:', error));
      

  }

  initMap();

