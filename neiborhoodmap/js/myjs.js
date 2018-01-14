var map = null;
var filterText = ko.observable("");
var showLeftmenu = ko.observable(true);
// Locations that will be used in this map
var locations = [{
    title: 'Beijing University of Technology',
    location: {
        lat: 39.871716,
        lng: 116.479379
    }
}, {
    title: 'HuanLeGu',
    location: {
        lat: 39.867835,
        lng: 116.493981
    }
}, {
    title: 'ZhongLan Community',
    location: {
        lat: 39.88499,
        lng: 116.479746
    }
}, {
    title: 'Pingleyuan Community',
    location: {
        lat: 39.884005,
        lng: 116.481268
    }
}, {
    title: 'ZhujiangDijing',
    location: {
        lat: 39.888214,
        lng: 116.481671
    }
}, {
    title: 'JingSong Dentist',
    location: {
        lat: 39.892987,
        lng: 116.473729
    }
}, {
    title: 'JianGuo Hotel',
    location: {
        lat: 39.872007,
        lng: 116.478306
    }
}, {
    title: 'JingTi Gym',
    location: {
        lat: 39.871,
        lng: 116.473097
    }
}, {
    title: 'Lala Land',
    location: {
        lat: 39.867516,
        lng: 116.47448
    }
}, {
    title: 'Beijing DongPai Company',
    location: {
        lat: 39.86726,
        lng: 116.485911
    }
}, {
    title: 'Gallery',
    location: {
        lat: 39.867376,
        lng: 116.483607
    }
}];
//Call back for google-map-API
function initMap() {
    // Create a styles array to use with the map.
    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#ffffff'
        }, {
            weight: 6
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#efe9e4'
        }, {
            lightness: -40
        }]
    }, {
        featureType: 'transit.station',
        stylers: [{
            weight: 9
        }, {
            hue: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
            visibility: 'on'
        }, {
            color: '#f0e4d3'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
            color: '#efe9e4'
        }, {
            lightness: -25
        }]
    }];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.871716,
            lng: 116.479379
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    var largeInfowindow = new google.maps.InfoWindow();
   // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    //Object for one place
    var Place = function(data) {
        var self = this;
        this.title = data.title;
        this.position = data.location;
        this.visible = ko.computed(function() {
            var placeName = self.title.toLowerCase();
            var re = filterText().toLowerCase();
            return (placeName.indexOf(re) != -1)
        });
        this.mark = new google.maps.Marker({
            position: self.position,
            title: self.title,
            animation: google.maps.Animation.DROP,
        });
        google.maps.event.addListener(self.mark, "click", function() {
            var urlList = [];
            var contentStr = '';
            var infowindow = null;
            populateInfoWindow(self.mark, largeInfowindow); //Pop out street view
            $.ajax({
                url: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.title + '&format=json&callback=wikiCallback',
                dataType: 'jsonp',
                data: {
                    param1: 'value1'
                },
                success: function(response) {
                    var contentList = response[1];

                    if (contentList.length != 0) {
                        for (var i = contentList.length - 1; i >= 0; i--) {
                            contentList[i] = contentList[i].replace(/ /g, "_");
                            var url = 'http://en.wikipedia.org/wiki/' + contentList[i];
                            urlList.push(url);
                        }
                        for (var i = urlList.length - 1; i >= 0; i--) {
                            contentStr = "<a href='" + urlList[i] + "'>" + urlList[i] + "</a>" + "<br>" + contentStr;
                        }
                        infowindow = new google.maps.InfoWindow({
                            content: "<p> Click follow links to see more information: </p>" + contentStr + "<br>"
                        });
                    } else {
                        infowindow = new google.maps.InfoWindow({
                            content: "<h3> There is no information from wikipedia </h3>"
                        });
                    }

                    infowindow.open(map, self.mark);
                },
                error: function() {
                    alert("There is something wrong, please check your internet....");
                }
            });
            var bounds = new google.maps.LatLngBounds();

            self.mark.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.mark.setAnimation(null)
            }, 5000);

            bounds.extend(self.mark.position);
        });
    }

    var viewModel = function() {
        var self = this;

        this.locationList = [];
        locations.forEach(function(data) {
            self.locationList.push(new Place(data));
        });
        self.locationList.forEach(function(place) {

            place.mark.setMap(map, place.position);

        });
        this.filteredList = ko.computed(function() {
            var result = [];
            self.locationList.forEach(function(place) {
                if (place.visible()) {
                    showLeftmenu = true;
                    result.push(place);
                    place.mark.setMap(map, place.position);

                } else {
                    place.mark.setMap(null);
                }
            });

            return result;
        });
    }
    ko.applyBindings(new viewModel());
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}
//Toggle left menu
function showmenu() {
    $(".leftmenu").toggle();
}

$(window).resize(function(event) {
    /* Act on the event */
    var windowWidth = $(window).width();
    if (windowWidth >= 510) {
        $(".leftmenu").show();
    }
});

function errorhand() {
    alert("Cannot download google map! you might need to check if you can use Google");
}