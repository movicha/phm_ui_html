/*
 * This file global file used to refer the controllers, models, stores and views used in the app.
 */
/*
 * File: app.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.1.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

//Global Variables
var patientDetails = {};
var pd=[];
var tagFlag=0;
var firstName="";
var doctorId="";
var tagPage=0;
var utcOffset="";

Ext.Loader.setConfig({
    enabled: true,
	paths   : {
        Ux : 'Ux'
    }
});

Ext.require([
    'Ux.layout.Accordion'
]);

Ext.application({
    models: [
        'Notes',
        'User',
		'demographics'
    ],
    stores: [
        'Notes',
        'demographics'
    ],
    views: [
        'LoginForm',
		'patientPanel',
        'MainTabPanel',
        'patientdetailPanel',
        'patientdetailPopup',
        'Mappop'
    ],
    name: 'MyApp',
    controllers: [
        'MyController',
        'User'
    ],

    launch: function() {

        Ext.create('MyApp.view.LoginForm', {fullscreen: true});
    }

});

//Grab the current location details.
function requestPosition() {
	var nav = null; 
	  if (nav == null) {
	      nav = window.navigator;
	  }
	  if (nav != null) {
	      var geoloc = nav.geolocation;
	      if (geoloc != null) {
	          geoloc.getCurrentPosition(successCallback, errorCallback);
	      }
	      else {
	          console.log("Geolocation not supported");
	      }
	  }
	  else {
	      console.log("Navigator not found");
	  }
	}

	function successCallback(position)
	{
	   console.log("Latitude "+position.coords.latitude);
	   console.log("Longitude "+position.coords.longitude);
	}
	 
	function errorCallback(error) {
	    var message = "";   
	    // Check for known errors
	    switch (error.code) {
	        case error.PERMISSION_DENIED:
	            message = "This website does not have permission to use " + 
	                      "the Geolocation API";
	            break;
	        case error.POSITION_UNAVAILABLE:
	            message = "The current position could not be determined.";
	            break;
	        case error.PERMISSION_DENIED_TIMEOUT:
	            message = "The current position could not be determined " + 
	                      "within the specified timeout period.";            
	            break;
	    }
	    // If it's an unknown error, build a message that includes 
	    // information that helps identify the situation, so that 
	    // the error handler can be updated.
	    if (message == "")
	    {
	        var strErrorCode = error.code.toString();
	        message = "The position could not be determined due to " + 
	                  "an unknown error (Code: " + strErrorCode + ").";
	    }
	    console.log(message);
	}
	
  

