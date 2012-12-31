/* Load in additional HTML fragments based on device category 'keyword', set by CSS3 MediaQuery viewport width
============================================================= */

// A CSS3 MediaQuery sets the body:after CSS generated 'content' to an imaginary 
// device category 'keyword' like 'device-smartphone', 'device-tablet', 'device-desktop' or 'device-wide'
// based custom CSS 'breakpoints'. Javasript then reads that 'keyword' onLoad() (see above) and uses a 
// window.resize() eventhandler to load in additional HTML fragments (using Ajax) based on the URL in a 
// HTML5 data-attribute div, like so: <div data-device-desktop="/fragments/social-media.html"></div>
// the contents of the URL is appended to the div mathing the 'keyword' when CSS applies this keyword
// to the body:after generated 'content'

// Set vars and a list of device category names matching CSS's body:after CSS generated 'content:' list
var deviceCategory, deviceCategorySequence = ['device-smartphone', 'device-tablet', 'device-desktop', 'device-wide'];

// Device related content is not loaded in (once) by default, 'mobile-first'!
var deviceTabletLoaded = false;
var deviceDesktopLoaded = false;
var deviceWideLoaded = false;

function checkDeviceCategory() {
	try {
		// Get the CSS device category 'keyword' from CSS body:after generated 'content'
		deviceCategory = window.getComputedStyle(document.body,':after').getPropertyValue('content');
		deviceCategory = deviceCategory.replace('"', '', 'g'); // For Safari and Chrome, strip the quotes, or it won't match in 'indexOf' below
		deviceCategory = deviceCategory.replace('"', '', 'g'); // For Opera strip it again (for some weird reason)

		// Get the array 'key' back from the match above
		var deviceCategoryKey = deviceCategorySequence.indexOf(deviceCategory);
	} catch(e) {}

	// Based on 'deviceCategoryKey', load subsequent HTML fragments
	// the higher the key (that is: wider viewport), load the lower key (smaller viewport) stuff to
	switch(deviceCategoryKey) {
		case 0:
			break;
		case 1:
			loadTabletFragments();
			break;
		case 2:
			loadTabletFragments();
			loadDesktopFragments();
			break;
		case 3:
			loadTabletFragments();
			loadDesktopFragments();
			loadWideFragments();
			break;
		default:
			// If the browser can't read the CSS generated body:after 'content' keyword
			// load in everything by default, mostly for browsers that don't support CSS3 MediaQueries
			loadTabletFragments();
			loadDesktopFragments();
			loadWideFragments();
	}

}

// Load 'tablet' fragments once
function loadTabletFragments() {
	if (!deviceTabletLoaded) {
		$('[data-device-tablet]').each(function(){
			$(this).load($(this).data('device-tablet'));
			deviceTabletLoaded = true;
		});
	}
}

// Load 'desktop' fragments once
function loadDesktopFragments() {
	if (!deviceDesktopLoaded) {
		$('[data-device-desktop]').each(function(){
			$(this).load($(this).data('device-desktop'));
			deviceDesktopLoaded = true;
		});
	}
}

// Load 'wide' (screen) fragments once
function loadWideFragments() {
	if (!deviceWideLoaded) {
		$('[data-device-wide]').each(function(){
			$(this).load($(this).data('device-wide'));
			deviceWideLoaded = true;
		});
	}
}