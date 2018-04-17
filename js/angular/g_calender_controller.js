var app = angular.module("g_calender", [])

app.controller("GCalenderController", function($scope, GoogleCalenderService) {

	$scope.events = [];

	$scope.newEvent = []



    $scope.showEvents = function(dateForm) {
        if(dateForm)
        dateForm.isSubmitting = true;

        GoogleCalenderService.fetchEvents($scope.date, function(events) {
        	console.log(events);
        	if(events.length == 0)
        		$scope.events = null
        	else
        		$scope.events = events;
        	$scope.$apply();
        });

        if(dateForm)
        dateForm.isSubmitting = false;
    }

    $scope.checkAuth = function() {
        GoogleCalenderService.checkAuth(handleAuthResult);
        $scope.api_authorized = true 
        //console.log($scope.api_authorized)
    }

    $scope.authorizeAccess = function() {
    	GoogleCalenderService.startAuthFlow(handleAuthResult);
    }

    $scope.addEvent = function() {
    	// console.log($scope.newEvent);
    	GoogleCalenderService.addEvent($scope.newEvent, $scope.date, function() {
    		alert("Event Added");
            $scope.showEvents();
    		$scope.newEvent = [];
    		
    	});
    }



    /**
	* Handle response from authorization server.
	*
	* @param {Object} authResult Authorization result.
	*/
	function handleAuthResult(authResult) {
	    // var authorizeDiv = document.getElementById('authorize-div');
	    if (authResult && !authResult.error) {
			// Hide auth UI, then load Calendar client library.
			//console.log("authorized")
			$scope.api_authorized = true
		} else {
			// Show auth UI, allowing the user to initiate authorization by
			// clicking authorize button.
			//console.log("not authorized")
			$scope.api_authorized = false
		}
		$scope.$apply();
	}


});