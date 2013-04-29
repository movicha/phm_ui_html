package com.phmhealth.nfc.impl;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

import android.os.Bundle;


public class PhoneGapActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		 super.setIntegerProperty("loadUrlTimeoutValue", 60000);
		/*super.loadUrl("file:///android_asset/www/app.html");*/
		 super.loadUrl(Config.getStartUrl());
	}
}
