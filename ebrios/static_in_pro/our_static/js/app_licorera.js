(function(){
    
    angular.module('licorera',['licorera.controllers', 'angular-loading-bar', 'ngAudio'])
    
    .config(function($httpProvider) {	    
	    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	});
    
})();