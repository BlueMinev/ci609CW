const mapPoints = [ ];

    const mapIcons = {
        curLoc: L.icon({
            iconUrl: './res/current_location_x48.png',
            shadowUrl: './res/current_location_x48_shadow.png',
            iconSize: [48, 48],
            shadowSize: [48, 48],
            iconAnchor: [24, 24],
            shadowAnchor: [24, 24],
            popupAnchor: [0, 0]
            }),
            curLoc360: L.icon({
                iconUrl: './res/current_location_360_x96.png',
                shadowUrl: './res/current_location_360_x96_shadow.png',
                iconSize: [96, 96],
                shadowSize: [96, 96],
                iconAnchor: [48, 48],
                shadowAnchor: [48, 48],
                popupAnchor: [0, 0]
                }),
                markLoc: L.icon({
                    iconUrl: './res/location_x64.png',
                    shadowUrl: './res/location_x64_shadow.png',
                    iconSize: [48, 48],
                    shadowSize: [48, 48],
                    iconAnchor: [24, 24],
                    shadowAnchor: [24, 24],
                    popupAnchor: [0, 0]
                    })
        };

        const generateOrientationIcons = () => {
            const image = new Image();
            image.addEventListener("load", () => {
            const w = image.width,
            h = image.height,
            cx = w / 2,
            cy = h / 2,
            arc = 3; // 3 degree precision;
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            for(let i = 360-arc; i > 0; i -= arc){
            ctx.setTransform(1, 0, 0, 1, cx, cy);
            ctx.rotate(i * (Math.PI / 180));
            ctx.drawImage(image, -cx, -cy);
            let dataurl = canvas.toDataURL();
            mapIcons['curLoc' + (360-i)] = L.icon({
            iconUrl: dataurl,
            shadowUrl: './res/current_location_360_x96_shadow.png',
            iconSize: [96, 96],
            shadowSize: [96, 96],
            iconAnchor: [48, 48],
            shadowAnchor: [48, 48],
            popupAnchor: [0, 0]
            })
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, w, h);
            }
            });
            image.src = './res/current_location_360_x96.png';
            }

window.addEventListener('load', () => {
    url = 'https://tm838.brighton.domains/SkipApp/api.php';
     fetch(url)
     .then(function (response) {
        //console.log(reponse);
        return response.json();
     })
    .then (function (value) {
        value.forEach((point, index) => {
            mapPoints.push({
                id: point.id,
                type: point.type,
                locName: point.locName,
                latlon: [point.lat,point.lon],
                imageLoc: point.imageLoc
            });
    })
        
console.log(mapPoints);
    const map = L.map('map');
    const skips = document.getElementById('skips') ;
    const addButton = document.getElementById('addButton')
    const addItemDiv = document.getElementById('addItemDiv')
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const markers = new L.featureGroup();

addButton.addEventListener('click',() => {

});
 addItemDiv.innerHTML= `
   <form>
    <label for="type">Type of item:</label><br>
    <input type="text" id="type" name="type"><br>
    <label for="locName">Description of Location:</label><br>
    <input type="text" id="locName" name="locName">
    <label for="lat">Lat:</label><br>
    <input type="text" id="lat" name="lat"  value= "${e.latlong.lat}" readonly><br>
    <label for="long">Long:</label><br>
    <input type="text" id="long" name="long" value= "${e.latlong.long}"  readonly><br>
    <label for="imageLoc">Image:</label><br>
    <input type="file" accept="image/*" capture="environment" name="imageLoc" id="imageLoc"><br>
    <input type="submit" value="submit" id="addItemSubmit"><br>

  </form>
 `;

for(let point of mapPoints){
const icon =  mapIcons.markLoc;
const marker = L.marker(point.latlon, {icon: icon}).addTo(map);
marker.bindPopup('<div class="map-pop-up">'
+ '<p class="waypoint-name">' + point.type + '</p>'
+ '<img src="' + point.imageLoc + '">'
+ '<p class="copy">'+ point.locName +' </p>'
+ '</div>');
markers.addLayer(marker);

markers.on('click', function(e) {
    e.layer.setIcon(mapIcons.selected);
    map.setView(e.layer.getLatLng(), 17);
});

//cards 
const cardDiv = document.createElement("div");
    cardDiv.className = "card";
const button = document.createElement("button");
    button.setAttribute("type","button");
    button.className= 'collapsible';
const content = document.createElement("div");
    content.className= "content";
const typeH2 = document.createElement("h2");
    typeH2.className = "title";
    typeH2.textContent = point.type;
const locH3 = document.createElement("h3");
    locH3.className = "type";
    locH3.textContent = point.locName;
const imgElm = document.createElement("img");
    imgElm.src = point.imageLoc; 

    //pick up form
const pickUpForm = document.createElement("form");
    pickUpForm.className = "pickUpForm";  
    pickUpForm.setAttribute("action","api.php");
    pickUpForm.setAttribute("method","post");
const Hiddeninfo1=document.createElement("input"); 
    Hiddeninfo1.setAttribute("name","id");
    Hiddeninfo1.setAttribute("id","id");
    Hiddeninfo1.setAttribute("value",point.id);
    const Hiddeninfo2=document.createElement("input"); 
    Hiddeninfo2.setAttribute("name","pickedUp");
    Hiddeninfo2.setAttribute("id","pickedUp");
    Hiddeninfo2.setAttribute("value",1);
const submit = document.createElement("input");
    submit.setAttribute("type","submit");
    submit.setAttribute("value","Pick Up");


        
        pickUpForm.appendChild(Hiddeninfo1);
        pickUpForm.appendChild(Hiddeninfo2);
        pickUpForm.appendChild(submit);
        button.appendChild(typeH2);
        content.appendChild(locH3);
        content.appendChild(imgElm);
        cardDiv.appendChild(button);
        cardDiv.appendChild(content);
        content.appendChild(pickUpForm);
        skips.appendChild(cardDiv);

}


map.fitBounds(markers.getBounds(), {padding: [10, 10]});

if(L.Browser.mobile) {
    let currentLocation = null;
    if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(location => {
    const latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
    if(currentLocation == null) {
        currentLocation = L.marker(latlng, {icon: mapIcons.curLoc}).addTo(map);
    } else {
    currentLocation.setLatLng(latlng);
    }
    map.fitBounds(markers.getBounds().extend(latlng), {padding: [10, 10]});
    },
    error => {
    let msg = 'Location unavailable';
    if(error.message.toLowerCase().indexOf('user') >= 0) {
    msg += '. Please enable location access in your settings.';
    }
    alert(msg);
    console.log(error.message);
    });
    } else {
    alert('Location unavailable. Please update your browser.');
    console.log('Geolocation not supported');
    }
    
    try {
        const options = { frequency: 60, referenceFrame: 'device' };
        const sensor = new AbsoluteOrientationSensor(options);
        Promise.all([navigator.permissions.query({ name: 'accelerometer' }),
        navigator.permissions.query({ name: 'magnetometer' }),
        navigator.permissions.query({ name: 'gyroscope' })])
        .then(results => {
        if (results.every(result => result.state === 'granted')) {
        generateOrientationIcons();
        sensor.addEventListener('reading', () => {
        const q = sensor.quaternion,
        w = q[0], x = q[1], y = q[2], z = q[3],
        yaw = Math.round(Math.atan2(2.0 * (y*z + w*x),
        w*w - x*x - y*y + z*z) * (180 / Math.PI)),
        rot = (yaw > 0) ? yaw : yaw + 360,
        arc = 3.0, // 3 degree precision
        deg = arc * Math.floor((rot + (arc / 2)) / arc),
        icon = 'curLoc' + (deg != 0 ? deg : 360);
        if(currentLocation != null) {
        currentLocation.setIcon(mapIcons[icon]);
        }
        });
        sensor.addEventListener('error', error => {
        if (event.error.name == 'NotReadableError') {
        console.log('Sensor is not available');
        }
        });
        sensor.start();
        } else {
        console.log('No permissions to use AbsoluteOrientationSensor');
        }
        });
        } catch (e) {
        console.log('AbsoluteOrientationSensor not supported');
        }}


        var coll = document.getElementsByClassName("collapsible");
        var i;
        for (i = 0; i < coll.length; i++) {
          coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });
        }
    })



    


});
