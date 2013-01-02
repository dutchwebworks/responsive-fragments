// LoadHTMLFragments: Load in additional HTML fragments based on device category 'keyword', set by CSS3 MediaQuery viewport width
// Inspired by: Jeremy Keith - Adactio article: 'Conditional CSS' http://adactio.com/journal/5429/
// Author: Dennis Burger (webdesign@dutchwebworks.nl)
// Github: https://github.com/dutchwebworks/responsive-fragments
// Version: 1.0.0
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

// Usage: add script-tag to end of body-tag
// Prerequisites: CSS3 MediaQueries and HTML div-tag with data-attribute
// CSS3 MediaQuery: @media(max-width: 399px) { body:after { content: 'device-smartphone' } }
// CSS3 MediaQuery: @media(min-width: 400px) and (max-width: 699px) { body:after { content: 'device-tablet' } }
// CSS3 MediaQuery: @media(min-width: 700px) and (max-width: 1199px) { body:after { content: 'device-desktop' } }
// CSS3 MediaQuery: @media(min-width: 1200px) { body:after { content: 'device-wide' } }
// HTML tag(s): <div data-device-tablet="fragments/content-for-tablet.html"></div>
// HTML tag(s): <div data-device-desktop="fragments/content-for-desktop.html"></div>
// HTML tag(s): <div data-device-wide="fragments/content-for-really-wide-screens.html"></div>
// Javascript: Picks up the changes to the CSS generated body:after content 'keyword', and loads in / appends the 'data-device-tablet' URL to the div-tag
// When viewport becomes smaller, CSS hides (with same MediaQuery breakpoint) the already loaded div-tag again, like: [data-device-tablet], [data-device-desktop]  { display: none; }

window.LoadHTMLFragments = (function( window, document, undefined ) {
	// Object list of device 'keywords' (set by CSS body:after generated 'content'), by default the URL / content is not loaded, 'mobile-first' philosophy!
	// A 'parent' element is used for subsequent loading of (smaller) viewport content fragments if the viewport is wide enough
	var devices = [
		{name:"device-smartphone", loaded: false},
		{name:"device-tablet", loaded:false, parent: "device-smartphone"},
		{name:"device-desktop", loaded:false, parent: "device-tablet"},
		{name:"device-wide", loaded:false, parent: "device-desktop"}];

	// Check the CSS body:after CSS generated 'content' 'keyword'
	checkDeviceCategory = function() {
		// If web browser doesn't understand it, don't bitch about it
		try {
			deviceCategory = this.getComputedStyle(document.body,':after').getPropertyValue('content');
			deviceCategory = deviceCategory.replace('"', '', 'g'); // Some browsers return the device category keyword with a double string apostrophes, strip it so it can be matched
			deviceCategory = deviceCategory.replace('"', '', 'g'); // ... for some weird reason, strip it again for Opera, or it won't match

			var device = getDevice(deviceCategory); // Get the device category name
		} catch(e) {}

		// Fallback for (older desktop) web browsers that don't understand body:after CSS generated 'content' (keyword)
		// if so ... load everything in by default
		if(device == null){
			loadFragment("device-wide"); // Mostly older desktop web browsers like Win/IE8 and lower
		} else if(device.name != "device-smartphone"){
			loadFragment(device.name);
		}
	}

	// Load / append the HTML5 data-attribute URL to the div-tag
	loadFragment = function(deviceCategoryType) {
		var device = getDevice(deviceCategoryType);

		// Load it only once
		if(!device.loaded) {
			$('[data-' + device.name + ']').each(function(){
				$(this).load($(this).data(device.name)); // Load in / append (using jQuery Ajax) the HTML URL of the URL into the div
				device.loaded = true; // Device specific fragments are now loaded, don't load / append it again
			});

			// If the viewport is wide enough, recursively load in / append the 'smaller' viewport HTML fragments as well
			if(device.parent != undefined) loadFragment(device.parent);
		}
	}

	// Get the specific device category from devices object list
	getDevice = function(deviceCategoryType){
		var i = devices.length;

		// Loop trough
		while(i--){
			if(devices[i].name == deviceCategoryType){
				return devices[i];
			}
		}

		return null;
	}

	// Add a listner to the window.resize() event
	// to load in the fragments as the web browser changes orientation
	// or the (desktop) web browser is resized
	try {
		 $(this).resize(checkDeviceCategory);
	} catch(e) {}

	// Run the function directly 'onLoad()'
	return checkDeviceCategory();
})(this, this.document);
;

