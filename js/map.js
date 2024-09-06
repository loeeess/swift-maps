document.addEventListener("DOMContentLoaded", function() {

    var map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var albumPins = {
        "Taylor Swift": "taylor-swift.png",
        "Fearless (Taylor's Version)": "fearless.png",
        "Speak Now (Taylor's Version)": "speak-now.png",
        "Red (Taylor's Version)": "red.png",
        "1989 (Taylor's Version)": "1989.png",
        "reputation": "reputation.png",
        "Lover": "lover.png",
        "folklore": "folklore.png",
        "evermore": "evermore.png",
        "Midnights": "midnights.png",
        "The Tortured Poets Department": "tortured-poets.png"
    };

    function createImageIcon(imagePath) {
        return L.icon({
            iconUrl: imagePath,
            iconSize: [20, 20],
            iconAnchor: [10, 20], 
            popupAnchor: [0, -20]
        });
    }

    function createPopupContent(location) {
        let img_src = `assets/pins/${albumPins[location.album]}`

        let content = `<strong>${location.song}</strong><br>
                       <img src="${img_src}" alt="${location.album}" style="width:15px;height:15px;vertical-align:middle;"> ${location.album}<br>
                       <em>"${location.lyrics}"</em><br>
                       <small><img src="assets/pins/pin.png" alt="Location pin" style="width:15px;height:15px;vertical-align:middle;">${location.location}</small>`;
        
        if (location.notes) {
            content += `<br><small><img src="assets/pins/sparkles.png" alt="Sparkles" style="width:15px;height:15px;vertical-align:middle;"> ${location.notes}</small>`;
        }

        return content;
    }

    function addMarkers(selectedAlbums) {
        // Remove all markers from the map, except the plane
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && !layer.isPlane) {
                map.removeLayer(layer);
            }
        });

        locations.forEach(function(location) {
            if (selectedAlbums.includes(location.album)) {
                var pinImage = `assets/pins/${albumPins[location.album]}` || "assets/pins/default.png";
                var marker = L.marker(location.coordinates, { icon: createImageIcon(pinImage) });
                marker.bindPopup(createPopupContent(location));
                marker.addTo(map);
            }
        });
    }

    function getSelectedAlbums() {
        var checkboxes = document.querySelectorAll('#album-filter input[type=checkbox]');
        var selectedAlbums = [];
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                selectedAlbums.push(checkbox.value);
            }
        });
        return selectedAlbums;
    }

    addMarkers(getSelectedAlbums());

    document.querySelectorAll('#album-filter input[type=checkbox]').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            addMarkers(getSelectedAlbums());
            handlePlaneVisibility();
        });
    });

    var planeIcon = createImageIcon("assets/pins/plane.png");
    var planePath = [
        [-10, -180], // Starting point (Southwest)
        [40, 0],     // Mid-point (Center of the map)
        [50, 120],   // Ending point (Northeast)
    ];

    var planeMarker = L.Marker.movingMarker(planePath, [30000, 30000], {
        icon: planeIcon,
        loop: true, // Loop the animation
        isPlane: true
    }).addTo(map);

    planeMarker.bindPopup(`
        <strong>I Did Something Bad</strong><br>
        <img src="assets/pins/${albumPins['reputation']}" alt="reputation" style="width:15px;height:15px;vertical-align:middle;"> reputation<br>
        <em>"I never trust a playboy, but they love me, so I fly him all around the world, and I let them think they saved me"</em><br>
        <small>All around the world</small>
    `);
    planeMarker.start();

    function handlePlaneVisibility() {
        var selectedAlbums = getSelectedAlbums();
        if (selectedAlbums.includes("reputation")) {
            if (!map.hasLayer(planeMarker)) {
                planeMarker.addTo(map);
            }
        } else {
            if (map.hasLayer(planeMarker)) {
                map.removeLayer(planeMarker);
            }
        }
    }

    handlePlaneVisibility();

    function getRandomLayer() {
        var layers = Object.values(map._layers);
        var markerLayers = layers.filter(function(layer) {
            // Filter out non-marker layers and the plane marker
            return layer instanceof L.Marker && !layer.isPlane;
        });
    
        if (markerLayers.length > 0) {
            var randomMarker = markerLayers[Math.floor(Math.random() * markerLayers.length)];
            return randomMarker;
        }
    
        return null;
    }
    
    function highlightRandomLocation() {
        var randomMarker = getRandomLayer();
    
        if (randomMarker) {
            randomMarker.openPopup();
            map.setView(randomMarker.getLatLng(), 10);
        } else {
            alert("No songs available for the selected filters.");
        }
    }
    
    document.getElementById('random-song-button').addEventListener('click', highlightRandomLocation);
});
