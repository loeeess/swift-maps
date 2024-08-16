document.addEventListener("DOMContentLoaded", function() {

    var map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var albumEmojis = {
        "Taylor Swift": "💚",
        "Fearless (Taylor's Version)": "💛",
        "Speak Now (Taylor's Version)": "💜",
        "Red (Taylor's Version)": "❤️",
        "1989 (Taylor's Version)": "🩵",
        "reputation": "🖤",
        "Lover": "🩷",
        "folklore": "🩶",
        "evermore": "🤎",
        "Midnights": "💙",
        "The Tortured Poets Department": "🤍",
    };

    function createEmojiIcon(emoji) {
        return L.divIcon({
            html: `<div style="font-size: 24px;">${emoji}</div>`,
            className: 'emoji-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    function createPopupContent(location) {
        let content = `<strong>${location.song}</strong><br>
                       ${albumEmojis[location.album]} ${location.album}<br>
                       <em>"${location.lyrics}"</em><br>
                       <small>${location.location}</small>`;
        
        if (location.notes) {
            content += `<br><small>✨ ${location.notes}</small>`;
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
    
        // Iterate through locations and add markers based on selected filters
        locations.forEach(function(location) {
            if (selectedAlbums.includes(location.album) || location.album === "Other") {
                console.log(location)
                var emoji = albumEmojis[location.album] || "📍";
                var marker = L.marker(location.coordinates, { icon: createEmojiIcon(emoji) });
                marker.bindPopup(createPopupContent(location));
                marker.addTo(map); // Add each marker directly to the map
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

    // Add event listener for album filter change
    document.querySelectorAll('#album-filter input[type=checkbox]').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            addMarkers(getSelectedAlbums());
            handlePlaneVisibility(); // Adjust plane visibility based on filter
        });
    });

    var planeIcon = createEmojiIcon("✈️");
    var planePath = [
        [-10, -180], // Starting point (Southwest)
        [40, 0],     // Mid-point (Center of the map)
        [50, 120],   // Ending point (Northeast)
    ];

    var planeMarker = L.Marker.movingMarker(planePath, [30000, 30000], {
        icon: planeIcon,
        loop: true,
        isPlane: true
    }).addTo(map);

    planeMarker.bindPopup(`<strong>I Did Something Bad</strong><br>🖤 reputation<br><em>"I never trust a playboy, but they love me, so I fly him all around the world, and I let them think they saved me"</em><br><small>All around the world</small>`);

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
});
