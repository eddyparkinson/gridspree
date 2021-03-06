/**!
 * Google Drive File Picker Example
 * By Daniel Lo Nigro (http://dan.cx/)
 */
(function() {
	/**
	 * Initialise a Google Driver file picker
	 */
  var FilePicker = window.FilePicker = function(options) {
    // console.log("window.FilePicker");
    // Config
    this.apiKey = options.apiKey;
    this.clientId = options.clientId;
    this.autoShowPicker = options.autoShowPicker;
    
    // Elements
    this.buttonEl = options.buttonEl;
    
    // Events
    this.onSelect = options.onSelect;
    this.buttonEl.addEventListener('click', this.open.bind(this));    
  
    // Disable the button until the API loads, as it won't work properly until then.
    this.buttonEl.disabled = true;
 
    this.isDriveApiLoaded = false;
    this.isPickerApiLoaded = false;
    // Load the drive API
    gapi.client.setApiKey(this.apiKey);
    gapi.client.load('drive', 'v2', this._driveApiLoaded.bind(this));
    google.load('picker', '1', { callback: this._pickerApiLoaded.bind(this) });
  }
 
	FilePicker.prototype = {
		/**
		 * Open the file picker.
		 */
		open: function() {		
	    // console.log("open");

			// Check if the user has already authenticated
			var token = gapi.auth.getToken();
			if (token) {
				this._showPicker();
			} else {
				// The user has not yet authenticated with Google
				// We need to do the authentication before displaying the Drive picker.
				this._doAuth(false, function() { this._showPicker(); }.bind(this));
			}
		},
		
		/**
		 * Show the file picker once authentication has been done.
		 * @private
		 */
		_showPicker: function() {
     // console.log("_showPicker");
			var accessToken = gapi.auth.getToken().access_token;
			this.picker = new google.picker.PickerBuilder().
				addView(google.picker.ViewId.SPREADSHEETS).
				setAppId(this.clientId).
				setOAuthToken(accessToken).
				setCallback(this._pickerCallback.bind(this)).
				build().
				setVisible(true);
		},
		
		/**
		 * Called when a file has been selected in the Google Drive file picker.
		 * @private
		 */
		_pickerCallback: function(data) {
	    // console.log("_pickerCallback");
		  
			if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				var file = data[google.picker.Response.DOCUMENTS][0],
					id = file[google.picker.Document.ID],
					request = gapi.client.drive.files.get({
						fileId: id
					});
					
				request.execute(this._fileGetCallback.bind(this));
			}
		},
		/**
		 * Called when file details have been retrieved from Google Drive.
		 * @private
		 */
		_fileGetCallback: function(file) {
      // console.log("_fileGetCallback");
			if (this.onSelect) {
				this.onSelect(file);
			}
		},
		
		/**
		 * Called when the Google Drive file picker API has finished loading.
		 * @private
		 */
		_pickerApiLoaded: function() {
      // console.log("_pickerApiLoaded");
		  //this.open().bind(this);
		  this.isPickerApiLoaded = true;
			this.buttonEl.disabled = false;
      this._authAndLaunch();
		},
		
		/**
		 * Called when the Google Drive API has finished loading.
		 * @private
		 */
		_driveApiLoaded: function() {
      // console.log("_driveApiLoaded");
      this.isDriveApiLoaded = true;
      this._authAndLaunch();
		},

    /**
     * Called after Google Drive API & picker has finished loading.
     * @private
     */
    _authAndLaunch: function() {
      if (this.isPickerApiLoaded && this.isDriveApiLoaded) {
        
        // console.log("_authAndLaunch");
        if (this.autoShowPicker) this._doAuth(true, this.open.bind(this) ); 
        else  this._doAuth(true);

      }
    },

		
		/**
		 * Authenticate with Google Drive via the Google JavaScript API.
		 * @private
		 */
		_doAuth: function(immediate, callback) {	
     // console.log("_doAuth: immediate"+ immediate);
		  
			gapi.auth.authorize({
				client_id: this.clientId,
				scope: 'https://www.googleapis.com/auth/drive.readonly',
				immediate: immediate
			}, callback);
		}
	};
}());
