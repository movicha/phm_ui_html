Ext.define('MyApp.model.User', {
    extend: 'Ext.data.Model',
    config: {
    	fields: ['username', 'password', 'usertype', 'gmtOffSet'],
    	proxy: {
	        type: 'ajax',
	        url: phmHealth.URLs.loginURL,
	        reader: {
	            type : 'json',
	            rootProperty : 'patients'	             
	        }
	    }    	
    }
});