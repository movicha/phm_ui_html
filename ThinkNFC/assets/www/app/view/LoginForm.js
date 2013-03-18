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
                                        height: 45,
                                        style: 'margin-bottom:10px;',
                                        scrollable: false,
                                        items: [
                                            {
                                                xtype: 'passwordfield',
                                                id: 'pass',
                                                maxHeight: '',
                                                minHeight: '',
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

        if(Ext.getCmp('pass').getValue()=="think")
       {
        console.log("newNoteCommanddcdc");
        var paneltab = Ext.create('MyApp.view.MainTabPanel');
        Ext.getCmp('loginForm').destroy();
        Ext.Viewport.add(paneltab);
        requestPosition();
       }
        else
       {
        	alert('Login failed');	
       } 	
    	
    	/*Ext.Ajax.request({
    	    url: 'http://localhost:9000/login',
    	    method: 'POST',

    	    params: {
    	        username: 'Ed',
    	        password: Ext.getCmp('pass').getValue()
    	    },

    	    callback: function(options, success, response) {
    	        console.log(response.responseText);
    	    }
    	});*/

    }

});