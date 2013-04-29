package com.phmhealth.nfc.impl;

import org.acra.ACRA;

import org.acra.annotation.ReportsCrashes;

import android.app.Application;

@ReportsCrashes(formKey = "dDI5UEVQTmV3NDFoVUtyRFA2bU1waGc6MQ")
public class MyApplication extends Application {
	@Override
	public void onCreate() {

		super.onCreate();
	//	ACRA.init(this);
	}

}
