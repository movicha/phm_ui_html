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
    alias : 'widget.login',
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
                                        height: 120,
                                        style: 'margin-bottom:10px;',
                                        scrollable: false,
                                        items: [
											{
                                                xtype: 'textfield',
                                                id: 'user',
                                                itemId: 'myusernamefield',
                                                style: 'margin-left:auto;margin-right:auto;margin-bottom:5px;',
                                                width: 285,
                                                label: 'Username',
                                                labelCls: 'labelbg',
                                                labelWidth: 100,
                                                name: 'username'
                                            },
                                            {
                                                xtype: 'passwordfield',
                                                id: 'pass',
                                                maxHeight: '',
                                                minHeight: '',
                                                style: 'margin-left:auto;margin-right:auto;',
                                                width: 285,
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
                                        xtype: 'label',
                                        id : 'status',
                                        cls: [
                                            'error'
                                        ],
										 style: 'margin-left:auto;margin-right:auto;margin-bottom:5px;',
                                        height: 23,
                                        html: ''
                                    },
                                    {
                                        xtype: 'button',
                                        id:'loginButton',
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
        ]
    }
});
