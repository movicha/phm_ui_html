/*This file consists of the functionality for login button
 *and handling the parsing of the JSON response from the server.
*/

Ext.define("MyApp.controller.User", {
	extend: "Ext.app.Controller",
	config: {
		refs: {
			userView: 'login',
			loginbtn: '#loginButton'
		},
		control: {
			loginbtn: {
				tap: "login"
			},
			patientbtn: {
				itemtap: "patientflow"
			}
		}
	},
	
	launch: function() {
        this.callParent(arguments);
        var user = Ext.create("MyApp.model.User");
        this.getUserView().setRecord(user);
   },
   
   /*On click of the login button, this function will be called.
    * We send the offset, username and password in a Json format to login.
   */
	login: function(){
	
		var d = new Date();
		utcOffset=d.getTimezoneOffset();
		
	    if(Ext.getCmp('user').getValue().length == 0 || Ext.getCmp('pass').getValue().length == 0)
	    	Ext.getCmp('status').setHtml("Username and Password cannot be empty");
	    else if(Ext.getCmp('pass').getValue().length < 4)
	    	Ext.getCmp('status').setHtml("Password should contain at least 4 characters");
	    else
	  {
		var user = this.getUserView().getRecord();
        user.set('username',Ext.getCmp('user').getValue());
        user.set('password',Ext.getCmp('pass').getValue());
        user.set('usertype','1');
        user.set('gmtOffSet',utcOffset);
    
        Ext.getCmp('status').setHtml('');
   	    Ext.getCmp('loginForm').setMasked(
           {
               xtype:'loadmask',
               message:'',
               fullscreen: true,
               html:"",
               cls:"maskd"
           });
        
   	    //Sending the offset, Username and Password to the Server in a JSON format.
        user.save({
        	success: function(req, res){
        		
        		var response = Ext.JSON.decode(res._response.responseText);

        		console.log("response : "+Ext.JSON.encode(response));
        		Ext.getCmp('loginForm').setMasked(false);	

        	//Checking if the response is success or failure.	
           	 if(res._response.responseText.indexOf("AutenticationResponse") != -1)
           		 {
           		//Login Failed. 
           		Ext.getCmp('status').setHtml(response.AutenticationResponse.status);
           		 }
           	 else
           	{	 	 
           	 //If the login is successful.
           	 firstName=Ext.getCmp('user').getValue();
           	
           	 //parsing the response in a user defined JSON array.
           	 parse(response);
           	 
           	//Taking the HCP to the next page i.e. patient panel. 
           	var paneltab = Ext.create('MyApp.view.patientPanel');
	        	Ext.getCmp('loginForm').destroy();
            	Ext.Viewport.add(paneltab);     
            	Ext.getCmp('hcpname').setHtml(firstName);
           	}
			},
			failure: function(error){
				//In case of any problems like server error etc. Show message.
				console.log(error);
				Ext.getCmp('status').setHtml("Server Error. Try Again.");
				Ext.getCmp('loginForm').setMasked(false);
				           
			}
        });
       
	  }
	}
})

function parse(jss) {	
	  var j=0;
	  pd=jss.patients;
	  Ext.getStore('Notes').setData(Ext.JSON.encode(pd));
	  doctorId=jss.userid;
	for(var i=0;i<jss.patients.length;i++)
	{
		var sid= jss.patients[i].ScheduleId;   
	    patientDetails[sid] = jss.patients[i];	 
	}
	
	 for(var key in patientDetails)
		 {
	 console.log("Patient details in global var : "+Ext.JSON.encode(patientDetails[key]));
		 }
	}
