$(document).on("pagecreate", "#page4", function() {
    var xmlhttp = new XMLHttpRequest();
    var myObj;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);
            var tabletext = '<table border="1"><tr><td>Name</td><td>Px</td><td>Py</td></tr>';
            for (var i = 0; i < myObj.length; i++) {
                tabletext += '<tr><td>' + myObj[i].Name + '</td><td>' + myObj[i].Px + '</td><td>' + myObj[i].Py + '</td></tr>';
            }
            tabletext += '</table>';
            document.getElementById("demo").innerHTML = tabletext;
        }
    };
    var url = "http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AV&CaseNo2=1&FileType=1&Lang=C&FolderType=";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
});


$(document).on("pageshow", "#page5", function() {
    var x = document.getElementById("demolocation");

    function getLocation() {
        if (navigator.geolocation) {
            var options = { timeout: 10000 };
            navigator.geolocation.getCurrentPosition(showPosition, showError, options);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        x.innerHTML = "Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude;
        //map
        latlon = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        mapholder = document.getElementById('locationimg')
        mapholder.style.height = '500px';
        mapholder.style.width = '100%';
        var myOptions = {
            center: latlon,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
        }
        var map = new google.maps.Map(document.getElementById("locationimg"), myOptions);
        var marker = new google.maps.Marker({ position: latlon, map: map, title: "You are here!" });
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }
    }
    getLocation()
});


$(document).on("pagecreate", "#page6", function() {
    var xmlhttp = new XMLHttpRequest();
    var myObj;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);
            $("#page6").on("pageshow", function() {
                var x = document.getElementById("errormes");
                function getLocation() {
                    if (navigator.geolocation) {
                        var options = { timeout: 10000 };
                        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
                    } else {
                        x.innerHTML = "Geolocation is not supported by this browser.";
                    }
                }

                function showPosition(position) {
                    //map
                    latlon = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                    mapholder = document.getElementById('demoviews')
                    mapholder.innerHTML = "";
                    mapholder.style.height = '500px';
                    mapholder.style.width = '100%';
                    var myOptions = {
                        center: latlon,
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: false,
                        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
                    }

                    var map = new google.maps.Map(mapholder, myOptions);
                    var marker = new google.maps.Marker({ position: latlon, map: map, title: "You are here!" });

                    for (var i = 0; i < myObj.length; i++) {
                        latlon = new google.maps.LatLng(myObj[i].Py, myObj[i].Px)
                        var marker = new google.maps.Marker({ position: latlon, map: map, title: myObj[i].Name });
                    }
                }

                function showError(error) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            x.innerHTML = "User denied the request for Geolocation."
                            break;
                        case error.POSITION_UNAVAILABLE:
                            x.innerHTML = "Location information is unavailable."
                            break;
                        case error.TIMEOUT:
                            x.innerHTML = "The request to get user location timed out."
                            break;
                        case error.UNKNOWN_ERROR:
                            x.innerHTML = "An unknown error occurred."
                            break;
                    }
                }
                getLocation();
            })
        }
    }
    var url = "http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AV&CaseNo2=1&FileType=1&Lang=C&FolderType=";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
});

$(document).on("pageshow", "#page7", function() {
    var spotArr;
    var range;
    var centerLat;
    var centerLon;
    $("#showviewbutton").on("vclick", function(event) {
        range = ($("#points").val() * 1000);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                spotArr = JSON.parse(this.responseText);
                getLocation();
            }
        };
        var url = "http://data.kaohsiung.gov.tw/Opendata/DownLoad.aspx?Type=2&CaseNo1=AV&CaseNo2=1&FileType=1&Lang=C&FolderType=";
        xmlhttp.open("GET", url, true);
        xmlhttp.send();


        function getRad(d) {
            var PI = Math.PI;
            return d * PI / 180.0;
        }

        function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
            var EARTH_RADIUS = 6378137.0; //Unit: Meter
            var radLat1 = getRad(lat1);
            var radLat2 = getRad(lat2);
            var a = radLat1 - radLat2;
            var b = getRad(lng1) - getRad(lng2);
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * EARTH_RADIUS;
            s = Math.round(s * 10000) / 10000.0;
            return s.toFixed(2);
        }

        function getLocation() {
            if (navigator.geolocation) {
                var options = { timeout: 10000 };
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            centerLat = position.coords.latitude;
            centerLon = position.coords.longitude
                //map
            latlon = new google.maps.LatLng(centerLat, centerLon)
            mapholder = document.getElementById('showviewdiv')
            mapholder.style.height = '400px';
            mapholder.style.width = '100%';
            var myOptions = {
                center: latlon,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
            }
            var map = new google.maps.Map(document.getElementById("showviewdiv"), myOptions);
            for (var i = 0; i < spotArr.length; i++) {
                if (getGreatCircleDistance(centerLat, centerLon, spotArr[i].Py, spotArr[i].Px) <= range) {
                    var latlon = new google.maps.LatLng(spotArr[i].Py, spotArr[i].Px)
                    var marker = new google.maps.Marker({ position: latlon, map: map, title: spotArr[i].Name });
                }
            }
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }
    });
});


$(document).on("pageshow", "#page8", function() {
    var range;
    var centerLat;
    var centerLon;
    var map;
    var infowindow;
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    $("#p7_showviewbutton").on("vclick", function(event) {
        range = ($("#p7_points").val() * 1000);
        getLocation();
        alert(range + ' m');

        function getLocation() {
            if (navigator.geolocation) {
                var options = { timeout: 10000 };
                navigator.geolocation.getCurrentPosition(showPosition, showError, options);
            } else {
                document.getElementById('showviewplace').innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            centerLat = position.coords.latitude;
            centerLon = position.coords.longitude;

            centerPos = new google.maps.LatLng(centerLat, centerLon);

            var mapholder = document.getElementById('showviewplace')
            mapholder.style.height = '400px';
            mapholder.style.width = '50%';

            map = new google.maps.Map(mapholder, {
                center: centerPos,
                zoom: 15
            });

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: centerPos,
                radius: range,
                type: ['store']
            }, callback);
        }

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });

            //directions
            google.maps.event.addListener(marker, 'dblclick', function() {
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('textdirection'));
                directionsService.route({
                        origin: centerPos,
                        destination: place.geometry.location,
                        travelMode: 'DRIVING'
                    },
                    function(response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });

            });
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }

    });
});
