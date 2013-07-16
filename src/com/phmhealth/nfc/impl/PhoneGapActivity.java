//Calling the app.html which includes all the referenced libraries and files like,
// .css and .js files and api reference for google maps used in the project.

package com.phmhealth.nfc.impl;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;


import android.content.res.Configuration;

import android.os.Bundle;


public class PhoneGapActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		
		     super.onCreate(savedInstanceState);
			 super.setIntegerProperty("loadUrlTimeoutValue", 60000);
			 super.loadUrl(Config.getStartUrl());
		
		 }
	
	@Override
	public void onConfigurationChanged(Configuration newConfig) {
	    super.onConfigurationChanged(newConfig);

	    // Checks the orientation of the screen
	    if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
	        
	    } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
	       
	    }
	}
}
