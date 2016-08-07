(function(){
    
    angular.module('ebrios',['ngRoute','ebrios.controllers','ebrios.services','ebrios.directives', 'angular-loading-bar','slickCarousel',])
    
    .config(['$httpProvider','slickCarouselConfig','$routeProvider',function($httpProvider,slickCarouselConfig,$routeProvider) {	    
	    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        slickCarouselConfig.dots=true;
        slickCarouselConfig.autoplay=false;
        
         $routeProvider.
        when('/',{
            templateUrl:'/static/partials/inicio_desktop.html'
        })
        .when('/categoria/:idCategoria/',{
            templateUrl:'/static/partials/categoria_desktop.html'
        })
        .when('/categoria/:idCategoria/:idSubcategoria',{
            templateUrl:'/static/partials/subcategoria_desktop.html'
        })
        .when('/carrito',{
            templateUrl:'/static/partials/carrito_desktop.html'
        })
        .when('/carrito/confirmar',{
            templateUrl:'/static/partials/confirmar_desktop.html'
        })
        .when('/enviado',{
            templateUrl:'/static/partials/pedidoenviado_desktop.html'
        })
        .otherwise({redirectTo:'/'});
        
	}]);
    
})();