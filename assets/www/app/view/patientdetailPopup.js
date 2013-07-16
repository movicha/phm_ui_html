/*
 * This file represents the UI for the pop-up, which displays additional information of the Patient.
 */
/*
 * File: app/view/someForm.js
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

Ext.define('MyApp.view.patientdetailPopup', {
    extend: 'Ext.Container',
    alias: 'widget.patientdetailPopup',

    config: {
        centered: true,
        height: '50%',
        style: 'border:1px dotted #969696;',
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        modal: true,
        cls: [
            'demographicspop'
        ],
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },
        items: [
            {
                xtype: 'panel',
                height: 40,
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'panel',
                        flex: 1,
                        cls: [
                            'demo_headersection'
                        ],
                        height: 40,
                        items: [
                            {
                                xtype: 'label',
                                cls: [
                                    'demo_header'
                                ],
                                html: 'DEMOGRAPHICS'
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        padding: '2 0 0 0',
                        style: 'background-color:#6d6d6d;',
                        width: 46,
                        items: [
                            {
                                xtype: 'button',
                                id: 'close',
                                itemId: 'mybutton1'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'dataview',
                flex: 1,
                padding: '5 0 0 0',
                itemTpl: [
                    '',
                    '        <tpl >',
                    '            <div class="leftsection_demo" >',
                    '            ',
                    '      <div class="list-item-demo" >Gender</div>',
                    '                <div class="seperator">:</div>',
                    '      <div class="list-item-demodata">{gender}</div>          ',
                    '            ',
                    '</div> ',
                    '',
                    '   ',
                    '',
                    '<div style="clear:both;"></div>',
                    ' <div class="linesection">',
                    '<div class="lineimg"></div><div class="line"></div>',
                    '            </div>    ',
                    '            <div class="leftsection_demo" >',
                    '            ',
                    '      <div class="list-item-demo" >Birthdate</div>',
                    '                <div class="seperator">:</div>',
                    '      <div class="list-item-demodata">{dateOfBirth}</div>          ',
                    '            ',
                    '</div> ',
                    '',
                    '   ',
                    '',
                    '<div style="clear:both;"></div>',
                    ' <div class="linesection">',
                    '<div class="lineimg"></div><div class="line"></div>',
                    '            </div>    ',
                    '            <div class="leftsection_demo" >',
                    '            ',
                    '      <div class="list-item-demo" >Marital Status</div>',
                    '                <div class="seperator">:</div>',
                    '      <div class="list-item-demodata">{maritalstatus}</div>          ',
                    '            ',
                    '</div> ',
                    '',
                    '   ',
                    '',
                    '<div style="clear:both;"></div>',
                    ' <div class="linesection">',
                    '<div class="lineimg"></div><div class="line"></div>',
                    '            </div>    ',
                    '            <div class="leftsection_demo" >',
                    '            ',
                    '      <div class="list-item-demo" >Telecom</div>',
                    '                <div class="seperator">:</div>',
                    '      <div class="list-item-demodata">{phone}</div>          ',
                    '            ',
                    '</div> ',
                    '',
                    '   ',
                    '',
                    '<div style="clear:both;"></div>',
                    ' <div class="linesection">',
                    '<div class="lineimg"></div><div class="line"></div>',
                    '            </div>    ',
                    '        </tpl>',
                    ''
                ],
                store: 'demographics'
            }
        ],
        listeners: [
            {
                fn: 'onMybutton1Tap11',
                event: 'tap',
                delegate: '#close'
            }
        ]
    },

    onMybutton1Tap11: function(button, e, options) {
        //Close button
        this.hide();

    }

});