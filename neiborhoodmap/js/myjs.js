var map;
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

/*var menuIcon = $('.menu-icon');
var showMarker = $('#show-listings');
var hideMarker = $('#hide-listings');
var leftmenu = $('leftmenu');*/



// Create a new blank array for all the listing markers.
var markers = [];

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


  // Locations that will be used in this map


  var largeInfowindow = new google.maps.InfoWindow();


  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      map: map,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    //I added animation to each markers so it  will bounce
    marker.addListener('click', function() {
      var target = this;
      populateInfoWindow(this, largeInfowindow);
      if (this.getAnimation() !== null) {
        this.setAnimation(null);
      } else {
        //console.log("this befor setout: ",this);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          //console.log("targ in set: ", target);
          target.setAnimation(null);
        }, 5000)
        //setTimeout(this.setAnimation(null), 5000);

      }
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });

  }
  var viewModel = {
    location: locations
  }

  ko.applyBindings(viewModel);



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

// This function will loop through the markers array and display them all.
function showListings() {
  hideListings();
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
//this function is for each location, when single location in that list were clicked, the marker will drop and bounce
//wiki were used to search for specific information
function listmaker(i) {
  hideListings();
  var urlList = [];
  var contentStr = '';
  var infowindow = null;
  var marker = markers[i];

  $.ajax({
    url: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + markers[i].title + '&format=json&callback=wikiCallback',
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

      infowindow.open(map, marker);
    },
    error: function() {
      alert("There is something wrong, please check your internet....");
    }
  });

  var bounds = new google.maps.LatLngBounds();
  markers[i].setMap(map);
  markers[i].setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    markers[i].setAnimation(null)
  }, 5000);

  bounds.extend(markers[i].position);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
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

function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    //a = li[i].getElementsByTagName("a")[0];

    if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
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

function myFocus() {
  // body... 

  $('.leftmenu').show();
}

function errorhand() {
  alert("Cannot download google map!");
}