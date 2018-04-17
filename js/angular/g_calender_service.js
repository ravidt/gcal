'use strict';

/**
 * @ngdoc function
 * @name GoogleCalenderService
 * @description # GoogleCalenderService Controller of the gcalender app
 */
angular.module('g_calender').service(
	'GoogleCalenderService',
	function($http) {

		//replace your client id here , if you want to make it work with another google apli client and add your own

		var CLIENT_ID = '513796455815-3io38pvoicjkqra5tpqil9sdgs6t5p20.apps.googleusercontent.com';

		var SCOPES = ['https://www.googleapis.com/auth/calendar'];
		
		this.fetchEvents = function(date, callback) {
			// console.log(date);
			gapi.client.load('calendar', 'v3', function() {

				// Format date to YYYY-MM-DD. Doesn't work otherwise!
				var yyyy = date.getFullYear().toString();
				var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
				var dd  = date.getDate().toString();

				var start_date = new Date( yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-"+(dd[1]?dd:"0"+dd[0])  );

				//console.log("start date "+ start_date)

				start_date.setDate(start_date.getDate())

				// Add 24hrs in seconds to get all events of a particular day.
				var end_Date = new Date((start_date.getTime()+ 1*24*60*60*1000 ));

				//console.log("end date "+end_Date)

				var request = gapi.client.calendar.events.list({
			        'calendarId': 'primary',
			        'timeMin': start_date.toISOString(),
			        'timeMax' : end_Date.toISOString(),
			        'showDeleted': true,
			        'singleEvents': true,
			        'maxResults': 10,
			        'orderBy': 'startTime'
			    });

			    request.execute(function(resp) {
			    	callback(resp.items);
			    })
			});

		}


		/**
		* Check if current user has authorized this application.
		*/
		this.checkAuth = function(callback) {
			gapi.auth.authorize(
		    	{
			        'client_id': CLIENT_ID,
			        'scope': SCOPES,
			        'immediate': true
		    	}, 
		    	callback
		    );
		}

		/**
		* Initiate auth flow in response to user clicking authorize button.
		*/
		this.startAuthFlow = function(callback) {
			return gapi.auth.authorize(
	        	{
	        		client_id: CLIENT_ID, 
	        		scope: SCOPES, 
	        		immediate: false
	        	},
	        	callback
	        );
	        // return false;
		}

		/**
		* Add event on particular date
		*/
		this.addEvent = function(event,date, callback) {
			// console.log(date);
			// console.log(event);
			var yyyy = date.getFullYear().toString();
			var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = date.getDate().toString();
			var start_date = yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-"+(dd[1]?dd:"0"+dd[0]);
			//console.log("add Event start date " + start_date);
			var resource = {
				"summary": event.summary,
				"location": event.location,
				"description" : event.description,
				"start": {
					"date":  start_date
				},
				"end": {
					"date": start_date
				}
			};

			var request = gapi.client.calendar.events.insert({
				'calendarId': 'primary',
				'resource': resource
			});

			request.execute(function(resp) {
				//console.log(resp);
				if(typeof resp.error == "undefined")
					callback();
			});

		}



	}
);
