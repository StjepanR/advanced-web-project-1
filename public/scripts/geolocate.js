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
        .bindPopup("ime: " + user.name + "\nemail: " + user.email + "\nvrijeme prijave: " + user.time + "\n")
        .addTo(mapa);
}

function addMarkers(position) {
    var name;
    var email;
    var time;
    axios.post('/markers', {
        latitude: position.latitude,
        longitude: position.longitude
    },
    {
        headers: { "Content-Type": "application/json" }
    }
    ).then(response => {
        var userObject = JSON.parse(response.data)
        console.log("cc" + response)
        name = userObject.name
        time = userObject.updated_at
        email = userObject.email
//        console.log(response.status) //200 OK
    }).catch(error => {
        console.log("ERROR: " + error);
    });

    addMarker({latitude: position.latitude, longitude: position.longitude, name: name, time: time, email: email});
}

function displayMarkers() {
    featureGroup = new L.FeatureGroup()

    axios.get('/markers').then(response => {
        featureGroup.addTo(mapa);
        for (const position in response.data) {
            featureGroup
                .addLayer(L.marker([response.data[position].latitude, response.data[position].longitude])
                .bindPopup("ime: " + response.data[position].name) + "\nemail: " + response.data[position].email + "\nvrijeme prijave: " + response.data[position].time);
        }

        mapa.fitBounds(featureGroup.getBounds());
    }).catch(error => {
        console.log("ERROR: " + error);
    });
}