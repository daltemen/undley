(function(){
    
    angular.module('ebrios.directives',[])
    
    .directive('ingresodireccion',function(){
        return{
            restrict: 'E',
            templateUrl:'/static/partials/ingresodireccion_desktop.html'
        };
    })
    
    .directive('buzonsugerencias',function(){
        return{
            restrict: 'E',
            templateUrl:'/static/partials/buzon_desktop.html'
        };
    });
    
})();