var mapa;
var featureGroup;

function initMap() {

    L.Map.addInitHook(function () {
        mapa = this;
    });

    var map = L.map('map').setView([0, 0], 3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

function locateMe() {
//    const status = document.getElementById('status');

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(mapa);
        L.marker([longitude, latitude])
            .bindPopup(latitude + " " + longitude)
            .addTo(mapa);

        mapa.setView([latitude, longitude], 13);

        addMarkers({latitude: latitude, longitude: longitude})

//        status.textContent = '';
    }

    function error() {
//        status.textContent = 'Unable to retrieve your location';
    }

    if(!navigator.geolocation) {
//        status.textContent = 'Geolocation is not supported by your browser';
    } else {
//        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function addMarker(user) {
    L.marker([user.latitude, user.longitude])
        .bindPopup(user.name)
        .addTo(mapa)
}

function addMarkers(position) {
    var name;
    axios.post('/markers', {
        latitude: position.latitude,
        longitude: position.longitude
    }).then(response => {
        console.log(response)
        name = response.data.name
//        console.log(response.status) //200 OK
    }).catch(error => {
        console.log("ERROR: " + error);
    });

    addMarker({latitude: position.latitude, longitude: position.longitude, name: name})
}

function displayMarkers() {
    var showMarkers = false;
    if (featureGroup == undefined) {
        featureGroup = new L.FeatureGroup()
    } else {
        showMarkers = true
    }

    axios.get('/markers').then(response => {
        console.log(response)
        if(showMarkers){
            featureGroup.clearLayers();
        }
        for (const position in response.data) {
            featureGroup.addLayer(addMarker({latitude: position.latitude, longitude: position.longitude}));
        }
        featureGroup.addTo(map);
        map.fitBounds(featureGroup.getBounds());
    }).catch(error => {
        console.log("ERROR: " + error);
    });
}