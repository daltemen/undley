(function() {
    angular.module('ebriosMovil',['ngRoute','ngResource','movil.controllers','movil.services','movil.directives'])
    
    .config(['$resourceProvider','$httpProvider','$routeProvider',function($resourceProvider,$httpProvider,$routeProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        
        $routeProvider.
        when('/',{
            templateUrl:'/static/partials/inicio_movil.html'
        })
        .when('/carrito',{
            templateUrl:'/static/partials/carrito_movil.html'
        })
        .when('/carrito/confirmar',{
            templateUrl:'/static/partials/confirmar_movil.html'
        })
        .when('/categoria/:idCategoria/',{
            templateUrl:'/static/partials/categoria_movil.html'
        })
        .when('/categoria/:idCategoria/:idSubcategoria',{
            templateUrl:'/static/partials/subcategoria_movil.html'
        })
        .when('/enviado',{
            templateUrl:'/static/partials/pedidoenviado_movil.html'
        });
  
    }]);  
})();