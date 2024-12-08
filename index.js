const mapPoints = [
    {
    name: "George Albert Smith's Film Studio",
    type: "cinema",
    latlon: [50.829140, -0.156026],
    image: "./res/1.jpg"
    },
    {
    name: "New Venture Theatre",
    type: "theatre",
    latlon: [50.824449, -0.153827],
    image: "./res/2.jpg"
    },
    {
    name: "Curzon Kinema",
    type: "cinema",
    latlon: [50.824878, -0.152086],
    image: "./res/3.jpg"
    },
    {
    name: "Brighton Little Theatre",
    type: "theatre",
    latlon: [50.823656, -0.148502],
    image: "./res/4.jpg"
    },
    {
    name: "The Regent",type: "cinema",
    latlon: [50.823961, -0.143179],
    image: "./res/5.jpg"
    },
    {
    name: "Cinescene",
    type: "cinema",
    latlon: [50.823466, -0.143092],
    image: "./res/6.jpg"
    },
    {
    name: "Brighton Hippodrome",
    type: "theatre",
    latlon: [50.821813, -0.142980],
    image: "./res/7.jpg"
    },
    {
    name: "The Savoy",
    type: "cinema",
    latlon: [50.819957, -0.139050],
    image: "./res/8.jpg"
    },
    {
    name: "The Marlborough",
    type: "theatre",
    latlon: [50.822230, -0.135989],
    image: "./res/9.jpg"
    },
    {
    name: "The Astoria",
    type: "cinema",
    latlon: [50.825965, -0.135905],
    image: "./res/10.jpg"
    },
    {
    name: "The Theatre Royal",
    type: "theatre",
    latlon: [50.823164, -0.139622],
    image: "./res/11.jpg"
    }
    ];

    const mapIcons = {
        cinLoc: L.icon({
        iconUrl: './res/cinema_location_x64.png',
        shadowUrl: './res/location_x64_shadow.png',
        iconSize: [64, 64], // size of the icon
        shadowSize: [64, 64], // size of the shadow
        iconAnchor: [32, 64], // point corresponding to marker's location
        shadowAnchor: [32, 64], // the same for the shadow
        popupAnchor: [0, -42] // point relative to iconAnchor where popup opens
        }),
        theLoc: L.icon({
        iconUrl: './res/theatre_location_x64.png',
        shadowUrl: './res/location_x64_shadow.png',
        iconSize: [64, 64],
        shadowSize: [64, 64],
        iconAnchor: [32, 64],
        shadowAnchor: [32, 64],
        popupAnchor: [0, -42]
        }),
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
    const map = L.map('map');
    const skips = document.getElementById('skips') ;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const markers = new L.featureGroup();
for(let point of mapPoints){
const icon = (point.type === 'cinema') ? mapIcons.cinLoc : mapIcons.theLoc;
const marker = L.marker(point.latlon, {icon: icon}).addTo(map);
marker.bindPopup('<div class="map-pop-up">'
+ '<p class="waypoint-name">' + point.name + '</p>'
+ '<img src="' + point.image + '">'
+ '<p class="copy">Image &copy QueenSpark Books </p>'
+ '</div>');
markers.addLayer(marker);

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
    locH3.textContent = point.name;
const imgElm = document.createElement("img");
    imgElm.src = point.image; 

        button.appendChild(typeH2);
        content.appendChild(locH3);
        content.appendChild(imgElm);
        cardDiv.appendChild(button);
        cardDiv.appendChild(content);
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



