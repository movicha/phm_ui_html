package com.phmhealth.nfc.plugin;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentFilter.MalformedMimeTypeException;
import android.nfc.*;
import android.nfc.tech.MifareClassic;
import android.nfc.tech.Ndef;
import android.nfc.tech.NdefFormatable;
import android.os.Parcelable;
import android.util.Log;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

public class NfcPlugin extends CordovaPlugin {
    private static final String REGISTER_MIME_TYPE = "registerMimeType";
    private static final String REGISTER_NDEF = "registerNdef";
    private static final String REGISTER_NDEF_FORMATABLE = "registerNdefFormatable";
    private static final String REGISTER_DEFAULT_TAG = "registerTag";
    private static final String WRITE_TAG = "writeTag";
    private static final String ERASE_TAG = "eraseTag";
    private static final String SHARE_TAG = "shareTag";
    private static final String UNSHARE_TAG = "unshareTag";
    private static final String INIT = "init";

    private static final String NDEF = "ndef";
    private static final String NDEF_MIME = "ndef-mime";
    private static final String NDEF_FORMATABLE = "ndef-formatable";
    private static final String TAG_DEFAULT = "tag";

    private static final String STATUS_NFC_OK = "NFC_OK";
    private static final String STATUS_NO_NFC = "NO_NFC";
    private static final String STATUS_NFC_DISABLED = "NFC_DISABLED";
    private static final String STATUS_NDEF_PUSH_DISABLED = "NDEF_PUSH_DISABLED";

    private static final String TAG = "NfcPlugin";
    private final List<IntentFilter> intentFilters = new ArrayList<IntentFilter>();
    private final ArrayList<String[]> techLists = new ArrayList<String[]>();

    private NdefMessage p2pMessage = null;
    private PendingIntent pendingIntent = null;

    private Intent savedIntent = null;

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        Log.d(TAG, "execute " + action);

        if (!getNfcStatus().equals(STATUS_NFC_OK)) {
            callbackContext.error(getNfcStatus());
            return true; // short circuit
        }

        createPendingIntent();
        
        if (action.equalsIgnoreCase(REGISTER_MIME_TYPE)) {
            registerMimeType(data, callbackContext);

        } else if (action.equalsIgnoreCase(REGISTER_NDEF)) {
            registerNdef(callbackContext);

        } else if (action.equalsIgnoreCase(REGISTER_NDEF_FORMATABLE)) {
            registerNdefFormattable(callbackContext);

        }  else if (action.equals(REGISTER_DEFAULT_TAG)) {
            registerDefaultTag(callbackContext);

        } else if (action.equalsIgnoreCase(WRITE_TAG)) {
            writeTag(data, callbackContext);

        } else if (action.equalsIgnoreCase(ERASE_TAG)) {
            eraseTag(callbackContext);

        } else if (action.equalsIgnoreCase(SHARE_TAG)) {
            shareTag(data, callbackContext);

        } else if (action.equalsIgnoreCase(UNSHARE_TAG)) {
            unshareTag(callbackContext);

        } else if (action.equalsIgnoreCase(INIT)) {
            init(callbackContext);

        } else {
            // invalid action
            return false;
        }

        return true;
    }

    private String getNfcStatus() {
        NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getActivity());
        if (nfcAdapter == null) {
            return STATUS_NO_NFC;
        } else if (!nfcAdapter.isEnabled()) {
            return STATUS_NFC_DISABLED;
        } else {
            return STATUS_NFC_OK;
        }
    }

    private void registerDefaultTag(CallbackContext callbackContext) {
        addTagFilter();
        callbackContext.success();
    }

    private void registerNdefFormattable(CallbackContext callbackContext) {
        addTechList(new String[]{NdefFormatable.class.getName()});
        callbackContext.success();
    }

    private void registerNdef(CallbackContext callbackContext) {
        addTechList(new String[]{Ndef.class.getName()});
        callbackContext.success();
    }

    private void unshareTag(CallbackContext callbackContext) {
        p2pMessage = null;
        stopNdefPush();
        callbackContext.success();
    }

    private void init(CallbackContext callbackContext) {
        Log.d(TAG, "Enabling plugin " + getIntent());

        startNfc();
        if (!recycledIntent()) {
            parseMessage();
        }
        callbackContext.success();
    }

    private void registerMimeType(JSONArray data, CallbackContext callbackContext) throws JSONException {
        String mimeType = "";
        try {
            mimeType = data.getString(0);
            intentFilters.add(createIntentFilter(mimeType));
            callbackContext.success();
        } catch (MalformedMimeTypeException e) {
            callbackContext.error("Invalid MIME Type " + mimeType);
        }
    }

    // Cheating and writing an empty record. We may actually be able to erase some tag types.
    private void eraseTag(CallbackContext callbackContext) throws JSONException {
        Tag tag = savedIntent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        NdefRecord[] records = {
            new NdefRecord(NdefRecord.TNF_EMPTY, new byte[0], new byte[0], new byte[0])
        };
        writeNdefMessage(new NdefMessage(records), tag, callbackContext);
    }
    
    private void writeTag(JSONArray data, CallbackContext callbackContext) throws JSONException {
        if (getIntent() == null) {  // TODO remove this and handle LostTag
            callbackContext.error("Failed to write tag, received null intent");
        }

        Tag tag = savedIntent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        NdefRecord[] records = Util.jsonToNdefRecords(data.getString(0));
        writeNdefMessage(new NdefMessage(records), tag, callbackContext);
    }

    private void writeNdefMessage(final NdefMessage message, final Tag tag, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Ndef ndef = Ndef.get(tag);
                    if (ndef != null) {
                        ndef.connect();

                        if (ndef.isWritable()) {
                            int size = message.toByteArray().length;
                            if (ndef.getMaxSize() < size) {
                                callbackContext.error("Tag capacity is " + ndef.getMaxSize() +
                                        " bytes, message is " + size + " bytes.");
                            } else {
                                ndef.writeNdefMessage(message);
                                callbackContext.success();
                            }
                        } else {
                            callbackContext.error("Tag is read only");
                        }
                        ndef.close();
                    } else {
                        NdefFormatable formatable = NdefFormatable.get(tag);
                        if (formatable != null) {
                            formatable.connect();
                            formatable.format(message);
                            callbackContext.success();
                            formatable.close();
                        } else {
                            callbackContext.error("Tag doesn't support NDEF");
                        }
                    }
                } catch (FormatException e) {
                    callbackContext.error(e.getMessage());
                } catch (TagLostException e) {
                    callbackContext.error(e.getMessage());
                } catch (IOException e) {
                    callbackContext.error(e.getMessage());
                }
            }
        });
    }

    private void shareTag(JSONArray data, CallbackContext callbackContext) throws JSONException {
        NdefRecord[] records = Util.jsonToNdefRecords(data.getString(0));
        this.p2pMessage = new NdefMessage(records);

        startNdefPush(callbackContext);
    }

    private void createPendingIntent() {
        if (pendingIntent == null) {
            Activity activity = getActivity();
            Intent intent = new Intent(activity, activity.getClass());
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            pendingIntent = PendingIntent.getActivity(activity, 0, intent, 0);
        }
    }

    private void addTechList(String[] list) {
        this.addTechFilter();
        this.addToTechList(list);
    }

    private void addTechFilter() {
        intentFilters.add(new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED));
    }

    private void addTagFilter() {
        intentFilters.add(new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED));
    }

    private void startNfc() {
        createPendingIntent(); // onResume can call startNfc before execute

        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getActivity());

                if (nfcAdapter != null && getActivity().isFinishing() == false) {
                    nfcAdapter.enableForegroundDispatch(getActivity(), getPendingIntent(), getIntentFilters(), getTechLists());

                    if (p2pMessage != null) {
                        nfcAdapter.setNdefPushMessage(p2pMessage, getActivity());
                    }

                }
            }
        });
    }

    private void stopNfc() {
        Log.d(TAG, "stopNfc");
        getActivity().runOnUiThread(new Runnable() {
            public void run() {

                NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getActivity());

                if (nfcAdapter != null) {
                    nfcAdapter.disableForegroundDispatch(getActivity());
                }
            }
        });
    }

    private void startNdefPush(final CallbackContext callbackContext) {
        getActivity().runOnUiThread(new Runnable() {
            public void run() {

                NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getActivity());

                if (nfcAdapter == null) {
                    callbackContext.error(STATUS_NO_NFC);
                // isNdefPushEnabled would be nice, but requires android-17
                //} else if (!nfcAdapter.isNdefPushEnabled()) {
                //    callbackContext.error(STATUS_NDEF_PUSH_DISABLED);
                } else {
                    nfcAdapter.setNdefPushMessage(p2pMessage, getActivity());
                    callbackContext.success();
                }
            }
        });
    }

    private void stopNdefPush() {
        getActivity().runOnUiThread(new Runnable() {
            public void run() {

                NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getActivity());

                if (nfcAdapter != null) {
                    nfcAdapter.setNdefPushMessage(null, getActivity());
                }

            }
        });
    }

    private void addToTechList(String[] techs) {
        techLists.add(techs);
    }

    private IntentFilter createIntentFilter(String mimeType) throws MalformedMimeTypeException {
        IntentFilter intentFilter = new IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED);
        intentFilter.addDataType(mimeType);
        return intentFilter;
    }

    private PendingIntent getPendingIntent() {
        return pendingIntent;
    }

    private IntentFilter[] getIntentFilters() {
        return intentFilters.toArray(new IntentFilter[intentFilters.size()]);
    }

    private String[][] getTechLists() {
        //noinspection ToArrayCallWithZeroLengthArrayArgument
        return techLists.toArray(new String[0][0]);
    }

    void parseMessage() {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "parseMessage " + getIntent());
                Intent intent = getIntent();
                String action = intent.getAction();
                Log.d(TAG, "action " + action);
                if (action == null) {
                    return;
                }

                Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
                Parcelable[] messages = intent.getParcelableArrayExtra((NfcAdapter.EXTRA_NDEF_MESSAGES));

                if (action.equals(NfcAdapter.ACTION_NDEF_DISCOVERED)) {
                    Ndef ndef = Ndef.get(tag);
                    fireNdefEvent(NDEF_MIME, ndef, messages);

                } else if (action.equals(NfcAdapter.ACTION_TECH_DISCOVERED)) {
                    for (String tagTech : tag.getTechList()) {
                        Log.d(TAG, tagTech);
                        if (tagTech.equals(NdefFormatable.class.getName())) {
                            fireNdefFormatableEvent(tag);
                        } else if (tagTech.equals(Ndef.class.getName())) { //
                            Ndef ndef = Ndef.get(tag);
                            Log.d(TAG, "Ndef null check : "+ndef);
                            
                         

                            // get NDEF message details
                           /* NdefMessage ndefMesg = ndef.getCachedNdefMessage();
                            NdefRecord[] ndefRecords = ndefMesg.getRecords();
                            int len = ndefRecords.length;
                            String[] recTypes = new String[len];     // will contain the NDEF record types
                            for (int i = 0; i < len; i++) {
                              recTypes[i] = new String(ndefRecords[i].getType());
                              
                              byte[] mesg = ndefRecords[i].getPayload();
                              try {
								Log.d("TAG","Record : "+new String(mesg, "UTF-8"));
							} catch (UnsupportedEncodingException e) {
								e.printStackTrace();
							}
                            }*/
                            
                            
                            fireNdefEvent(NDEF, ndef, messages);
                        }
                    }
                    /*   Log.d("Ashray","calling RI");
                   resolveIntent(intent); */
                }

                if (action.equals(NfcAdapter.ACTION_TAG_DISCOVERED)) {
                    fireTagEvent(tag);
                }

               // setIntent(new Intent());
                
                
                //Reading Mifare tag
                
                //IntentFilter ndef = new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED);
                
                //try {
                  //  ndef.addDataType("*/*");
                //} catch (MalformedMimeTypeException e) {
                  //  throw new RuntimeException("fail", e);
                //}
                //IntentFilter[] mFilters = new IntentFilter[] {
                  //      ndef,
                //};

                // Setup a tech list for all NfcF tags
                //String[][] mTechLists = new String[][] { new String[] { MifareClassic.class.getName() } };
                
                //Intent intnt = getIntent();
                
                //resolveIntent(intent); 
                
            }

            void resolveIntent(Intent intent) {
            	 Log.d(TAG, "Starting RI");
                // 1) Parse the intent and get the action that triggered this intent
                String action = intent.getAction();
                Log.d(TAG, "Got intent's action : "+action);
                // 2) Check if it was triggered by a tag discovered interruption.
                if (NfcAdapter.ACTION_TECH_DISCOVERED.equals(action)) {
                    //  3) Get an instance of the TAG from the NfcAdapter
                    Tag tagFromIntent = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
                    Log.d(TAG, "Got tagFromIntent : "+tagFromIntent);
                    // 4) Get an instance of the Mifare classic card from this TAG intent
                    MifareClassic mfc = MifareClassic.get(tagFromIntent);
                    Log.d(TAG, "Instance of Mifare Classic card : "+mfc);
                    byte[] data;
                    
                    try {       //  5.1) Connect to card 
                    mfc.connect();
                    Log.d(TAG, "Connected to card");
                    boolean auth = false;
                    String cardData = null;
                    // 5.2) and get the number of sectors this card has..and loop thru these sectors
                    int secCount = mfc.getSectorCount();
                    Log.d(TAG, "No of sectors : "+secCount);
                    int bCount = 0;
                    int bIndex = 0;
                    for(int j = 0; j < secCount; j++){
                        // 6.1) authenticate the sector
                        auth = mfc.authenticateSectorWithKeyA(j, MifareClassic.KEY_NFC_FORUM);
                        if(auth){
                        	Log.d(TAG, "If auth passed");
                            // 6.2) In each sector - get the block count
                            bCount = mfc.getBlockCountInSector(j);
                            Log.d(TAG, "Block count : "+bCount);
                            bIndex = 0;
                            for(int i = 0; i < bCount; i++){
                                bIndex = mfc.sectorToBlock(j);
                                // 6.3) Read the block
                                data = mfc.readBlock(bIndex);    
                                Log.d(TAG, "Data : "+data);
                                // 7) Convert the data into a string from Hex format.                
                                Log.i(TAG, convertHexToString(getHexString(data)));
                                
                                fireMifareTagEvent("MIFARE", getHexString(data));
                                bIndex++;
                            }
                        }else{ // Authentication failed - Handle it
                        	Log.d(TAG, "Auth failed");
                        }
                    }    
                }catch (IOException e) { 
                        Log.e(TAG, e.getLocalizedMessage());
                    }
            }// End of method
                Log.d(TAG, "Ending RI");
        }

		
				 final byte[] HEX_CHAR_TABLE = {
					    (byte)'0', (byte)'1', (byte)'2', (byte)'3',
					    (byte)'4', (byte)'5', (byte)'6', (byte)'7',
					    (byte)'8', (byte)'9', (byte)'a', (byte)'b',
					    (byte)'c', (byte)'d', (byte)'e', (byte)'f'
					  };    

					  public String getHexString(byte[] raw) 
					    throws UnsupportedEncodingException 
					  {
					    byte[] hex = new byte[2 * raw.length];
					    int index = 0;

					    for (byte b : raw) {
					      int v = b & 0xFF;
					      hex[index++] = HEX_CHAR_TABLE[v >>> 4];
					      hex[index++] = HEX_CHAR_TABLE[v & 0xF];
					    }
					    return new String(hex, "ASCII");
					  }
				
			});
    }
    
    private void fireMifareTagEvent(String type, String patientID)
    {
    	// String command = MessageFormat.format(javaScriptEventTemplate, type, "{'patientid':'" + patientID + "'}");
    	Log.v(TAG, "handleMifareTag");
    	this.webView.sendJavascript("handleMifareTag(" + patientID + ")");
    }

    private void fireNdefEvent(String type, Ndef ndef, Parcelable[] messages) {

        JSONObject jsonObject = buildNdefJSON(ndef, messages);
        String tag = jsonObject.toString();

        String command = MessageFormat.format(javaScriptEventTemplate, type, tag);
        Log.v(TAG, command);
        this.webView.sendJavascript(command);

    }

    private void fireNdefFormatableEvent (Tag tag) {

        String command = MessageFormat.format(javaScriptEventTemplate, NDEF_FORMATABLE, Util.tagToJSON(tag));
        Log.v(TAG, command);
        this.webView.sendJavascript(command);
    }

    private void fireTagEvent (Tag tag) {

        String command = MessageFormat.format(javaScriptEventTemplate, TAG_DEFAULT, Util.tagToJSON(tag));
        Log.v(TAG, command);
        this.webView.sendJavascript(command);
    }

    JSONObject buildNdefJSON(Ndef ndef, Parcelable[] messages) {

        JSONObject json = Util.ndefToJSON(ndef);

        // ndef is null for peer-to-peer
        // ndef and messages are null for ndef format-able
        if (ndef == null && messages != null) {

            try {

                if (messages.length > 0) {
                    NdefMessage message = (NdefMessage) messages[0];
                    json.put("ndefMessage", Util.messageToJSON(message));
                    // guessing type, would prefer a more definitive way to determine type
                    json.put("type", "NDEF Push Protocol");
                }

                if (messages.length > 1) {
                    Log.wtf(TAG, "Expected one ndefMessage but found " + messages.length);
                }

            } catch (JSONException e) {
                // shouldn't happen
                Log.e(Util.TAG, "Failed to convert ndefMessage into json", e);
            }
        }
        return json;
    }

    private boolean recycledIntent() { // TODO this is a kludge, find real solution

        int flags = getIntent().getFlags();
        if ((flags & Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) == Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) {
            Log.i(TAG, "Launched from history, killing recycled intent");
            setIntent(new Intent());
            return true;
        }
        return false;
    }

    @Override
    public void onPause(boolean multitasking) {
        Log.d(TAG, "onPause " + getIntent());
        super.onPause(multitasking);
        stopNfc();
    }

    @Override
    public void onResume(boolean multitasking) {
        Log.d(TAG, "onResume " + getIntent());
        super.onResume(multitasking);
        startNfc();
    }

    @Override
    public void onNewIntent(Intent intent) {
        Log.d(TAG, "onNewIntent " + intent);
        super.onNewIntent(intent);
        setIntent(intent);
        savedIntent = intent;
        parseMessage();
    }

    private Activity getActivity() {
        return this.cordova.getActivity();
    }

    private Intent getIntent() {
        return getActivity().getIntent();
    }

    private void setIntent(Intent intent) {
        getActivity().setIntent(intent);
    }

    String javaScriptEventTemplate =
        "var e = document.createEvent(''Events'');\n" +
        "e.initEvent(''{0}'');\n" +
        "e.tag = {1};\n" +
        "document.dispatchEvent(e);";

    public String convertHexToString(String hex){
    	 
    	   StringBuilder sb = new StringBuilder();
    	   StringBuilder temp = new StringBuilder();
    	 
    	   //49204c6f7665204a617661 split into two characters 49, 20, 4c...
    	   for( int i=0; i<hex.length()-1; i+=2 ){
    	 
    	       //grab the hex in pairs
    	       String output = hex.substring(i, (i + 2));
    	       //convert hex to decimal
    	       int decimal = Integer.parseInt(output, 16);
    	       //convert the decimal to character
    	       sb.append((char)decimal);
    	 
    	       temp.append(decimal);
    	   }
    	   System.out.println("Decimal : " + temp.toString());
    	 
    	   return sb.toString();
    	  }
}
