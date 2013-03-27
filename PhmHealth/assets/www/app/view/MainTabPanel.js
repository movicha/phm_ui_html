/*
 * File: app/view/MainTabPanel.js
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

var id="";

Ext.define('MyApp.view.MainTabPanel', {
    extend: 'Ext.Container',

    config: {
        id: 'mainTabPanel',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'panel',
                style: '',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'panel',
                        flex: 0,
                        docked: 'top',
                        height: 100,
                        style: 'margin-top:5%;',
                        items: [
                            {
                                xtype: 'component',
                                centered: true,
                                html: '<img src="images/high/logo.png" />'
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        flex: 1,
                        id: 'maindata',
                        itemId: 'mypanel6',
                        style: '',
                        scrollable: 'vertical',
                        items: [
                            {
                                xtype: 'panel',
                                height: 20,
                                layout: {
                                    type: 'hbox'
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        flex: 0.5,
                                        cls: [
                                            'visitdatelabel'
                                        ],
                                        html: 'Visit Date:',
                                        itemId: 'mylabel',
                                        style: 'margin-left:20px;'
                                    },
                                    {
                                        xtype: 'label',
                                        id : 'firstName',                                        
                                        flex: 1,
                                        cls: [
                                            'visitdate'
                                        ],
                                        html: 'firstName',
                                        style: 'text-align:right;margin-right:20px;'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                height: 25,
                                layout: {
                                    type: 'hbox'
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        flex: 0.7,
                                        cls: [
                                            'visitdate'
                                        ],
                                        html: 'date',
                                        id: 'date',
                                        itemId: 'date',
                                        style: 'margin-left:20px;',
                                        listeners: [
                                            {
                                                fn: function(element, options) {


                                                    var currentTime = new Date();

                                                    val = Ext.util.Format.date(currentTime, 'F d, Y');
                                                    var label = Ext.getCmp('date');
                                                    label.setHtml(val);


                                                },
                                                event: 'painted'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'label',
                                        id : 'lastName',
                                        flex: 1,
                                        cls: [
                                            'visitdate'
                                        ],
                                        html: 'lastName',
                                        style: 'text-align:right;margin-right:20px;'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                height: 20,
                                style: 'margin-top:10%;',
                                layout: {
                                    type: 'hbox'
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        flex: 0.6,
                                        cls: [
                                            'visitdate'
                                        ],
                                        height: 20,
                                        html: 'Visit Timer',
                                        style: 'margin-left:40%;'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                itemId: 'mypanel9',
                                layout: {
                                    type: 'vbox'
                                },
                                items: [
                                    {
                                        xtype: 'panel',
                                        cls: [
                                            'stopwatch'
                                        ],
                                        html: '00:00:00',
                                        id: 'timer',
                                        itemId: 'mypanel12',
                                        style: 'margin-left:auto;margin-right:auto;',
                                        listeners: [
                                            {
                                                fn: function(component, options) {

                                                },
                                                event: 'initialize'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'panel',
                                        height: 150,
                                        itemId: 'mypanel12',
                                        layout: {
                                            type: 'hbox'
                                        },
                                        scrollable: false,
                                        items: [
                                            {
                                                xtype: 'list',
                                                hidden: true,
                                                style: 'margin-top:5%;',
                                                ui: 'round',
                                                width: '100%',
                                                modal: false,
                                                scrollable: 'direction: \'horizontal\',\r\n  directionLock: true,\r\n  momentumEasing:  {\r\n     momentum: {\r\n       acceleration: 30,\r\n       friction: 0.5\r\n     },\r\n     bounce: {\r\n        acceleration: 0.0001,\r\n        springTension: 0.9999,\r\n     },\r\n     minVelocity: 5\r\n  },\r\n  outOfBoundRestrictFactor: 0',
                                                emptyText: '</pre> <div class="notes-list-empty-text">No notes found.</div> <pre>',
                                                itemCls: 'gh',
                                                itemTpl: [
                                                    '',
                                                    '<div class="list-item-title">{title}</div>',
                                                    ''
                                                ],
                                                scrollToTopOnRefresh: false,
                                                store: 'Notes',
                                                disableSelection: false,
                                                itemHeight: 50,
                                                onItemDisclosure: true,
                                                refreshHeightOnUpdate: false,
                                                variableHeights: false
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'button',
                                        flex: 0,
                                        cls: 'gradient',
                                        itemId: 'endvisit',
                                        style: 'margin-left:auto;margin-right:auto;margin-bottom:10px;',
                                        ui: 'forward',
                                        width: 100,
                                        text: 'END VISIT'
                                    }
                                ]
                            }
                        ],
                        listeners: [
                            {
                                fn: function(component, options) {
                                    /*Ext.getCmp('maindata').setMasked(
                                    {
                                        xtype:'loadmask',
                                        message:'Awaiting NFC Tag in (Patient)',
                                        fullscreen: true,
                                        html:"<img src='images/loading3.gif'/>",
                                        indicator:false
                                    });*/

                                    // app.initialize(); 

                                    setTimeout(function () {            
                                        Ext.getCmp('maindata').setMasked(false);


                                        /*stopwatch starts function*/

                                        stopWatchInt =  setInterval(function() {

                                            var elapseTime;
                                            var watchObj = Ext.getCmp('timer');
                                            var minSec = watchObj.getHtml().split(":");
                                            var min  = parseInt(minSec[1],10);
                                            var sec  = parseInt(minSec[2],10);
                                            var msec = parseInt(minSec[3],10);
                                            var hr = parseInt(minSec[0],10);


                                            sec++;

                                            if ( sec  == 60 ) { min++;  sec = 0; }
                                            if ( min  == 60 ) { hr++;  min = 0; }

                                            elapseTime  = (hr  < 10) ?  "0" + hr  : hr;
                                            elapseTime += (min  < 10) ? ":0" + min  : ":" + min;
                                            elapseTime += (sec < 10) ? ":0" + sec : ":" + sec;


                                            watchObj.setHtml(elapseTime); 

                                        }, 1000);

                                        /*ends stopwatch starts function*/


                                    }, 0);




                                },
                                event: 'initialize'
                            }
                        ]
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onMybutton1Tap',
                event: 'tap',
                delegate: '#endvisit'
            }
        ]
    },

    onMybutton1Tap: function(button, e, options) {
        clearInterval(stopWatchInt);
        var watch = Ext.getCmp('timer');

        alert(watch.getInnerHtmlElement().dom.innerHTML);


        Ext.getCmp('maindata').setMasked(
        {
            xtype:'loadmask',
            message:'Awaiting NFC Tag out (Patient)',
            fullscreen: true,
            html:"<img src='images/loading3.gif'/>",
            indicator:false
        });
//        window.location="app.html";
    }
    
    
});

//NFC Functionality



var app = {
		handleMifareTag: function(tag) {
			alert(tag);
		},
	    initialize: function () {
	    	
	        this.bind();
	    },
	    bind: function () {
	        document.addEventListener('deviceready', this.deviceready, true);
	    },
	    deviceready: function () {
	    
	        function failure(reason) {
	            navigator.notification.alert("Failure : " + reason, function() {}, "pHmHealth");
	            Ext.getCmp('loginForm').setMasked(false);
	        }

	        nfc.addNdefListener(
	            app.onNdef,
	            function() {
	            	//navigator.notification.alert("Generic NDEF Tag listener added.", function() {}, "pHmHealth");
	                console.log("Listening for Patient tag in.");
	            },
	            failure
	        );
	        
	        /*nfc.addTagDiscoveredListener(
	                app.onNfc,
	                function() {
	                	navigator.notification.alert("Tag discovered listener added.", function() {}, "pHmHealth");
	                    console.log("Listening for tags.");
	                },
	                failure
	            );*/

	        if (device.platform == "Android") {

	            // Android reads non-NDEF tag. BlackBerry and Windows don't.
	            nfc.addTagDiscoveredListener(
	                app.onNfc,
	                function() {
	                	//navigator.notification.alert("Tag discovered listener added.", function() {}, "pHmHealth");
	                    console.log("Listening for non-NDEF tags.");
	                },
	                failure
	            );

	            // Android launches the app when tags with mime type text/pg are scanned
	            // because of an intent in AndroidManifest.xml.
	            // phonegap-nfc fires an ndef-mime event (as opposed to an ndef event)
	            // the code reuses the same onNfc handler
	            nfc.addMimeTypeListener(
	                'text/pg',
	                app.onNdef,
	                function() {
	                	//navigator.notification.alert("MIME Type listener added.", function() {}, "pHmHealth");
	                    console.log("Listening for NDEF mime tags with type text/pg.");
	                },
	                failure
	            );
	        }

	    },
	    onNfc: function (nfcEvent) {
	        console.log("on Nfc : "+JSON.stringify(nfcEvent.tag));
	        //alert("onNfc Called. the tag is : "+ JSON.stringify(nfcEvent.tag), function() {}, "pHmHealth");
	    },
       onNdef: function (nfcEvent) {
	        
    	   if(tagFlag==0)
    	  {	   
	        console.log("On Ndef : "+JSON.stringify(nfcEvent.tag));

	        var tag = nfcEvent.tag,
	        records = tag.ndefMessage || [];

	      
	        
	        var ndefRecord = "";
	       
	        ndefRecord = nfc.decodePayload(records[0]);
	        
	        
	        console.log("Records : "+ndefRecord);
	        
	        id = ndefRecord;
	        
	        var flag=0;
	        
	        for(var i=0;i<patientDetails.length;i++)
	    	{
	    	  if(id==patientDetails[i])
	    		  
	    	  flag=1;	  
	    	}
            
	        if(flag==1)
	        {
	        
	        	/*alert("Patient Authorized");*/
	        	console.log("Patient Authorized");
	       		var paneltab = Ext.create('MyApp.view.MainTabPanel');
	       		/**/
	        	Ext.getCmp('loginForm').destroy();
            	Ext.Viewport.add(paneltab); 
            	app.setPatient(id);
            	tagFlag=1;
            	
            	
	       	}
	        else
	        {
	        	console.log("Un-Authorized Patient");
	        	/*alert("Un-Authorized Patient");
	        	/*Ext.getCmp('loginForm').setMasked(true);*/
	        }
	        
	    }
    	   else
    	  {
    		
    		var tag = nfcEvent.tag,
   	        records = tag.ndefMessage || [];

   	        var ndefRecord = "";
   	       
   	        ndefRecord = nfc.decodePayload(records[0]);
   	        
   	        
   	        if(id == ndefRecord)
   	        	{
   	        	 console.log("Patient tag out successful");
   	        	 window.location="app.html";
   	        	}
   	        else
   	        	{
   	        	 alert("Please tag out with the card used for tag-in ");
   	        	}
    		   
    	  }
       },
        /*tagOut: function () {
        	document.addEventListener('deviceready', this.devicetagout, true);
	        
	    },
	    devicetagout : function () {
		    
	        navigator.nfc.addMimeTypeListener("text/pg", readTag, works ,fail);       
	},
	    readTag : function(event) {
			var tag=event.tag,
			records = tag.ndefMessage || [];
			
			if(id == Ndef.bytesToString(records[0].payload))
			  {
	          	alert("Patient Tag out successful");
	        	var paneltab = Ext.create('MyApp.view.MainTabPanel');
                Ext.getCmp('loginForm').destroy();
                Ext.Viewport.add(paneltab);
			  }
	        else
	        {
	        	alert("Un-Authorized Patient tag");
	        	Ext.getCmp('maindata').setMasked(true);
	        }
		},*/
	   setPatient : function(id)
	   {
		   for(var i=0;i<patientDetails.length;i++)
       	{
       	    if(id==patientDetails[i])
       	    	{
       	    	 Ext.getCmp('firstName').setHtml(patientDetails[i+1]);
       	    	Ext.getCmp('lastName').setHtml(patientDetails[i+2]);
       	    	}
  
       	}
	   }
		
	} 
