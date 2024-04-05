let map;
let infowindow;

function randEmoji() {
  let emojiList = ['🫡','🐌','🇨🇦','🤬','🫥','💩','🦁','🍄','❄️','🍌','🍆','🍺','🥉','🛵','⛰️','🫵'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}


async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: 34.792, lng: -81.644 },
        mapId: "b4e05492cfb0d627",
        zoom: 8,
        mapTypeId: 'satellite',
        gestureHandling: "greedy"
    });

    

    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 4,
    };

    infowindow = new google.maps.InfoWindow();
    let markers = [];
    icon = "/campfire.png";
    let logURLS = [];
   
    // Read the CSV file and add markers to the map
    const logBook = document.querySelector("#logbook");

    try {
      const response = await fetch('hikelog.csv');
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      const lines = data.split('\n');
        const pathCoordinates = [];
        for (let i = 1; i < lines.length; i++) {
          const [id, date, title, latitude, longitude, info, url] = lines[i].split(',');
          const log = document.createElement("div");
          const logbody = document.createElement("div");
          const logheader = document.createElement("div");

          logURLS.push('logs/' + info);
          
          log.id = Number(id);
          log.classList.add('log');

          const logDate = document.createElement("div");
          logDate.textContent = date;
          logDate.classList.add('logdate');

          const logTitle = document.createElement("div");
          logTitle.textContent = title;
          logTitle.classList.add('logtitle');
      

          

          logheader.appendChild(logTitle);
          logheader.appendChild(logDate);

          logheader.classList.add('logheader');

          log.appendChild(logheader);

          logBook.appendChild(log);

          if (latitude && longitude) {

            let contentString = 
              `<div><h3>in lieu of video, emoji</h3><h1>${randEmoji()}</h1></div>`
            
            if (url) {
               contentString =
              '<iframe width="280" height="158"' +
              `src=${url} ` +
              'title="YouTube video player" frameborder="0" allow="accelerometer; ' +
              'autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; ' +
              'web-share" allowfullscreen></iframe>' +
              '</div>';
            }
            
            

            const marker = new google.maps.Marker({
              position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
              map: map,
              title: title,
              descrip: contentString,
              marker_id: Number(id),
              icon: icon

            });

            markers.push(marker);


  
            pathCoordinates.push(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
            
    
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setOptions({
                content: this.descrip,
              });
              infowindow.open(map, marker);

              const log = document.getElementById(this.marker_id);
              log.scrollIntoView(true);

              });
            
            
            

          }
            
        }

        logBook.appendChild(document.createElement("div"));

        logBook.addEventListener('scroll', () => {
          const scrollLeft = logBook.scrollLeft;
          const containerWidth = logBook.clientWidth;
          const containerCenter = scrollLeft + containerWidth / 2;

          let centeredDiv = null;
          let cumulativeWidth = 0;

          for (const div of logBook.children) {
            const divWidth = div.clientWidth;
            cumulativeWidth += divWidth;
    
            if (cumulativeWidth >= containerCenter) {
                centeredDiv = div;
                break;
            }
          } 
          
          
          if (centeredDiv) {
            const [id, date, title, latitude, longitude, info, url] = lines[Number(centeredDiv.id) + 1].split(',');
            map.panTo({lat: parseFloat(latitude), lng: parseFloat(longitude)});
            infowindow.setOptions({
              content: markers[centeredDiv.id].descrip,
            });
            infowindow.open(map, markers[centeredDiv.id]);
           

          }
          
        });

        
  
        // Create a Polyline using the pathCoordinates array
        const polyline = new google.maps.Polyline({
          path: pathCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0,
          icons: [
            {
              icon: lineSymbol,
              offset: "0",
              repeat: "20px",
            }
            
          ]
        });
  
        // Set the Polyline on the map
        polyline.setMap(map);
        const [id, date, title, latitude, longitude, info, url] = lines[lines.length - 1].split(',');
        map.setCenter({lat: parseFloat(latitude), lng: parseFloat(longitude)});
    } catch (error) {
      console.error("Error fetching the CSV file:", error);
    }
    
      
  }

  async function loadEntries() {
    const logs = document.querySelectorAll('#logbook >.log');
    for (let i = 0; i < logs.length; i++) {
      let url = 'logs/' + String(i) + '.txt';
      let entry = await loadTextFile(url);
      if (entry) {
        logbody = document.createElement("div");
        logbody.textContent = entry;
        logbody.classList.add('logbody');
        logs[i].appendChild(logbody);
      }
    }

    logs[logs.length - 1].scrollIntoView(true);


   
  }

  async function loadTextFile(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let text = await response.text();
        return text; // This text is the content of your file
    } catch (error) {
        console.error('Error fetching the text file:', error);
    }
}

async function main() {
  await initMap();
  loadEntries();

}

main();

