/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  var body = document.body,
      html = document.documentElement;

  var height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);

  var START_ICON = '../icons/maps/web/ic_directions_black_18dp_2x.png';
  var DESTINATION_ICON = '../icons/maps/web/ic_beenhere_black_18dp_2x.png';
  var PICKUP_ICON = '../icons/maps/web/ic_person_pin_black_18dp_2x.png';
  var DROPOFF_ICON = '../icons/maps/web/ic_place_black_18dp_2x.png';
  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  // obj to keep track of current markers
  app.markers = {};

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    var headerHeight = document.getElementById('mainHeader').offsetHeight;
    document.getElementById('mainContainer').style.height = (height - headerHeight) + 'px';
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.removeMarkers = function(title) {
    app.markers[title].remove();
    delete app.markers[title];
  };

  app.search = function(e) {
    // paper-input element
    // var paper = [].slice.call(document.getElementsByName(e.target.name)).filter(function(a) {
    //   // get correct input
    //   return (a.tagName === 'PAPER-INPUT'? true : false);
    // })[0];

    // couldn't think of another way to find correct input element...
    var paper = e.target.parentElement.parentElement.parentElement.parentElement;
    if (paper.is !== 'paper-input') { throw new Error('Internal Error - wrong element found'); }
    // make sure input is not empty and has changed
    if (!e.target.value || paper.title === e.target.value) {return;}
    // perform search with new location and attach to google-map-search element
    app.setCoords(e.target.value);
    // set interval checking when the search has returned and populated the result field
    var x = setInterval(function() {
      if (this.search.results && this.search.results.length) {

        // delete old marker
        if (paper.title) {
          app.removeMarkers(paper.title);
        }
        // attach all relevent info to paper-element
        paper.title = e.target.value;
        paper.lat = this.search.results[0].latitude;
        paper.long = this.search.results[0].longitude;
        // reset search result field once done
        this.search.results = null;
        // create new map-marker element to attach to map

        app.createMarker(paper.title, paper.lat, paper.long, paper.name);

        clearInterval(x);
      }
    }, 10);
  };
  app.createMarker = function(title, lat, long, name) {
    var marker = document.createElement('google-map-marker');
    marker.title = title;
    marker.latitude = lat;
    marker.longitude = long;

    var icon = app.getIcon(name);
    marker.icon = icon;

    var infoWindow = document.createElement('p');
    infoWindow.innerHTML = title;
    Polymer.dom(marker).appendChild(infoWindow);
    // marker.icon = '';
    // sets key to marker.title with value being the whole marker
    app.markers[marker.title] = marker;

    var map = document.getElementById('googleMap');
    // need to attach to Light dom via built in Polymer fn
    Polymer.dom(map).appendChild(marker);
  };

  app.getIcon = function(name) {
    var icon;
    switch (name) {
      case 'start':
        icon = START_ICON;
        break;
      case 'stop':
        icon = DESTINATION_ICON;
        break;
      case 'dropoff':
        icon = DROPOFF_ICON;
        break;
      default:
        icon = PICKUP_ICON;
        break;
    }
    return icon;
  };

  app.setCoords = function(loc) {
    var search = document.getElementById('search');
    search.query = loc;
    search.search();
  };

})(document);
