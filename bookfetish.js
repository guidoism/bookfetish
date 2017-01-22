/* appear.min.js 1.0.3 */
appear=function(){"use strict";function e(){var e=window.scrollY||window.pageYOffset;null!=n&&(o.velocity=e-n,o.delta=o.velocity>=0?o.velocity:-1*o.velocity),n=e,i&&clearTimeout(i),i=setTimeout(function(){n=null},30)}function t(e,t){var n=e.getBoundingClientRect();return n.top+n.height>=0&&n.left+n.width>=0&&n.bottom-n.height<=(window.innerHeight||document.documentElement.clientHeight)+t&&n.right-n.width<=(window.innerWidth||document.documentElement.clientWidth)+t}var n=null,i=0,o={};return addEventListener("scroll",e,!1),function(e){return function(e){function n(e,t){return function(){var n=this,i=arguments;clearTimeout(l),l=setTimeout(function(){e.apply(n,i)},t)}}function i(){o.delta<y.delta.speed&&(s||(s=!0,d(),setTimeout(function(){s=!1},y.delta.timeout))),n(function(){d()},y.debounce)()}function r(){d(),addEventListener("scroll",i,!1),addEventListener("resize",i,!1)}function a(){v=[],l&&clearTimeout(l),u()}function u(){removeEventListener("scroll",i,!1),removeEventListener("resize",i,!1)}function d(){f||(v.forEach(function(e,n){e&&t(e,y.bounds)?h[n]&&(h[n]=!1,g++,y.appear&&y.appear(e),y.disappear||y.reappear||(v[n]=null)):(h[n]===!1&&(y.disappear&&y.disappear(e),w++,y.reappear||(v[n]=null)),h[n]=!0)}),y.reappear||y.appear&&(!y.appear||g!==p)||y.disappear&&(!y.disappear||w!==p)||(f=!0,u(),y.done&&y.done()))}function c(){if(!m){m=!0,y.init&&y.init();var e;if(e="function"==typeof y.elements?y.elements():y.elements){p=e.length;for(var t=0;p>t;t+=1)v.push(e[t]),h.push(!0);r()}}}var p,l,s,f,m=!1,v=[],h=[],g=0,w=0,y={};return function(e){e=e||{},y={init:e.init,elements:e.elements,appear:e.appear,disappear:e.disappear,done:e.done,reappear:e.reappear,bounds:e.bounds||0,debounce:e.debounce||50,delta:{speed:e.deltaSpeed||50,timeout:e.deltaTimeout||500}},addEventListener("DOMContentLoaded",c,!1);var t=!1;Function("/*@cc_on return document.documentMode===10@*/")()&&(t=!0);var n="complete"===document.readyState||"loaded"===document.readyState;return t?n&&c():(n||"interactive"===document.readyState)&&c(),{trigger:function(){d()},pause:function(){u()},resume:function(){r()},destroy:function(){a()}}}}()(e)}}();

var paragraphs = document.getElementsByTagName("p");
for (i = 0; i < paragraphs.length; i++) {
  var section = paragraphs[i].parentNode;
  var a = document.createElement('a');
  a.setAttribute('name', 'location-' + i);
  a.className = "track";
  section.insertBefore(a, section.firstChild);
}

var storage_key = window.location.href + "?last-location-read";

appear({
  elements: function elements() {
    return document.getElementsByClassName('track');
  },
  appear: function appear(el) {
    var location = parseInt(el.getAttribute("name").split("-")[1]);
    // TODO: when going back to location go to the location at the top of the screen
    // TODO: save location in the cloud, maybe http://www.kvstore.io/
    // TODO: list of books
    // TODO: add/remove to list of books
    var last = 0;
    var history = {};
    var item = localStorage.getItem(storage_key);
    if (item) {
      item = JSON.parse(item);
      last = item["location"] || 0;
      history = item["history"] || {};
    }
    if (last < location) {
      var now = Date.now();
      history[location] = Date.now();
      item = { location: location, timestamp: now, history: history };
      localStorage.setItem(storage_key, JSON.stringify(item));
      console.log("Saving last location to", location);
      //console.log("Saving:", JSON.stringify(item));
    }
  },
  bounds: 200,
});

// TODO: Maybe put up a disappearing message telling you if the saved
//       location is further ahead from the current hashed location
if (!window.location.hash) {
  var last = 0;
  var item = localStorage.getItem(storage_key);
  if (item) {
    item = JSON.parse(item);
    var now = Date.now();
    last = item.location;
  }
  if (last) {
    window.location = window.location.href.split('#')[0] + "#location-" + last;
  }
}
function gotoLocationMinutesAgo(minutes_ago) {
  var item = localStorage.getItem(storage_key);
  if (item) {
    item = JSON.parse(item);
    var now = Date.now();
    var unsorted_history = [];
    Object.keys(item.history).forEach(function(location) {
      unsorted_history.push({location: location, time: item.history[location]});
    });
    var sorted_history = unsorted_history.sort(function(a, b) {
      return b.time - a.time;
    });
    var when = now - minutes_ago * 60 * 1000;
    sorted_history.some(function(e) {
      // console.log("History:", e.location, "at", e.time, "(", Math.floor((now - e.time) / 1000), "seconds ago)");
      if (e.time < when) {
        console.log("Going to ", window.location.href.split('#')[0] + "#location-" + e.location);
        window.location = window.location.href.split('#')[0] + "#location-" + e.location;
        return true;
      }
    });
  }
  return false;
}

