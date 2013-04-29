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
        //console.log(3);
   },
   
	login: function(){
	
		console.log("Running the event handler");
		
		var d = new Date();
		utcOffset=d.getTimezoneOffset();
		
		console.log(d.getTimezoneOffset());
   
		var user = this.getUserView().getRecord();
        user.set('username',Ext.getCmp('user').getValue());
        user.set('password',Ext.getCmp('pass').getValue());
        user.set('usertype','1');
        user.set('gmtOffSet',utcOffset);
    
        console.log(user);
        
        Ext.getCmp('status').setHtml('');
   	    Ext.getCmp('loginForm').setMasked(
           {
               xtype:'loadmask',
               message:'',
               fullscreen: true,
               html:"",
               cls:"maskd"
           });
        
        user.save({
        	success: function(req, res){
        		
        		var response = Ext.JSON.decode(res._response.responseText);
    
        		console.log(response);
        		
        		Ext.getCmp('loginForm').setMasked(false);	
           	 
           	 if(res._response.responseText.indexOf("AutenticationResponse") != -1)
           		 {
           		Ext.getCmp('status').setHtml(response.AutenticationResponse.status);
           		 }
           	 else
           	{	 	 
           	 
           	 firstName=Ext.getCmp('user').getValue();
           		 
           	 parse(response);
           	 
           	 console.log("completed parse");
           	 
           	var paneltab = Ext.create('MyApp.view.patientPanel');
	        	Ext.getCmp('loginForm').destroy();
            	Ext.Viewport.add(paneltab);     
            	Ext.getCmp('hcpname').setHtml(firstName);
           	}
			},
			failure: function(error){
				console.log(error);
				Ext.getCmp('status').setHtml("Server Error. Try Again.");
				 Ext.getCmp('loginForm').setMasked(false);
				           
			}
        });
       
		
	}
})

function parse(jss) {	
	  var j=0;
	  pd=jss.patients;
	  Ext.getStore('Notes').setData(Ext.JSON.encode(pd));
	/*  console.log("Array :"+Ext.JSON.encode(pd));*/
	  doctorId=jss.userid;
	for(var i=0;i<jss.patients.length;i++)
	{
	    /*var patientId= jss.patients[i].patientid;   */	 
		var sid= jss.patients[i].ScheduleId;   
	    patientDetails[sid] = jss.patients[i];	 
	}
	
	 for(var key in patientDetails)
		 {
	 console.log("Patient details in global var : "+Ext.JSON.encode(patientDetails[key]));
		 }
	}
