/*
 * File: app/view/LoginForm.js
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

var patientDetails = new Array();
var firstName="";
var lastName="";

Ext.define('MyApp.view.LoginForm', {
    extend: 'Ext.Container',

    config: {
        id: 'loginForm',
        layout: {
            type: 'fit'
        },
        items: [
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'panel',
                        flex: 0,
                        height: '50%',
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
                        style: '',
                        items: [
                            {
                                xtype: 'panel',
                                style: 'background:none;margin-top:10%;',
                                hideOnMaskTap: false,
                                layout: {
                                    type: 'vbox'
                                },
                                items: [
                                    {
                                        xtype: 'formpanel',
                                        height: 60,
                                        style: 'margin-bottom:10px;',
                                        scrollable: false,
                                        items: [
                                            {
                                                xtype: 'passwordfield',
                                                id: 'pass',
                                                maxHeight: '',
                                                minHeight: 60,
                                                style: 'margin-left:auto;margin-right:auto;',
                                                width: 300,
                                                label: 'Password',
                                                labelCls: 'labelbg',
                                                labelWidth: 100,
                                                name: 'password',
                                                autoCorrect: false,
                                                maxLength: 15,
                                                placeHolder: '',
                                                readOnly: false
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'button',
                                        cls: 'gradient',
                                        itemId: 'mybutton',
                                        left: '',
                                        style: 'margin-left:auto;margin-right:auto;',
                                        styleHtmlContent: true,
                                        ui: 'forward',
                                        width: 80,
                                        scope: this,
                                        text: 'LOG IN'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        listeners: [
            {
                fn: 'onMybuttonTap',
                single: false,
                event: 'tap',
                delegate: '#mybutton'
            }
        ]
    },

    onMybuttonTap: function(button, e, options) {
        	
    Ext.Ajax.request ({ 
        
        url : 'http://204.13.110.186:9000/1/login',
        timeout : 180000,
        method : 'POST',
        type:'ajax',
        
        jsonData : {
         username : 'samathan',
         password : Ext.getCmp('pass').getValue(),
         usertype :'1'
        },
                 success: function(response) {
                	 
                	 if(response.responseText.indexOf("AutenticationResponse") !== -1)
                		 {
                	 alert(Ext.JSON.decode(response.responseText).AutenticationResponse.status);
                		 }
                	 else
                	{	 	 
                	 console.log(response.responseText);
                	 parse(Ext.JSON.decode(response.responseText));
                	 
                	 console.log("newNoteCommanddcdc");
                	 
                	 Ext.getCmp('loginForm').setMasked(
                     {
                        xtype:'loadmask',
                        message:'Awaiting NFC Tag in (Patient)',
                        fullscreen: true,
                        html:"<img src='images/loading3.gif'/>",
                        indicator:false
                     });
                     
                     app.initialize(); 
                     
                     setTimeout(function() {
                     	Ext.getCmp('loginForm').setMasked(false);
                     }, 20000);

                	 /*
                     var paneltab = Ext.create('MyApp.view.MainTabPanel');
                     Ext.getCmp('loginForm').destroy();
                     Ext.Viewport.add(paneltab);*/
                     requestPosition();
                	}
                 },
                 failure: function(response) {
                   console.log(response.responseText);
                 }
                    
             });
        	
        	function parse(jss) {	
        	  var j=0;
        	for(var i=0;i<jss.patients.length;i++)
        	{
        	    var patientId= jss.patients[i].patientid;
        	    var patientFirstName = jss.patients[i].firstname;
        	    var patientLastName = jss.patients[i].lastname;
        	    patientDetails[j++]=patientId;
        	    patientDetails[j++]=patientFirstName;
        	    patientDetails[j++]=patientLastName;
        	    
        	    /*console.log("PatientId : "+patientId+" PatientName : "+patientName) */
        	    console.log("Patient details in global var : "+patientDetails);
        	    firstName=patientDetails[1];
        	    lastName=patientDetails[2];
        	}
        	}
 
    }

});