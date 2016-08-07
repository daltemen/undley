(function() {
    angular.module('movil.controllers',[])
    
    .controller('TabsController',['NavegacionService','DatosExternosService','$location','$window','$scope','OrdenService','CarritoService',function(NavegacionService,DatosExternosService,$location,$window,$scope,OrdenService,CarritoService){   
        sessionStorage['continuarCarrito']=JSON.stringify(false);
        $scope.cliente=DatosExternosService.getCliente();  
        DatosExternosService.clienteAutenticado().get(function(data){
            $scope.cliente.id=data.id;
            $scope.cliente.nombre=data.nombreusuario;  
            console.log($scope.cliente);
        }); 
        
        
        
        this.rutaContinuar=function(){
            if($scope.cliente.nombre!='Anonimo'){
                this.go('/carrito/confirmar');
            }else{
                sessionStorage['continuarCarrito']=JSON.stringify(true);
                $window.location.href='/ingreso';                
            }
        }
    
        $scope.carrito=CarritoService.getCarrito();
        $scope.orden= OrdenService.getOrden();  
        $scope.licorera=DatosExternosService.getLicorera();
        
        this.validacion_direccion =  false;
        
        //cambia el valor de la validacion
        this.cambiarValorValidacionDireccion = function(){
            this.validacion_direccion =  true;
        }
        
        this.go = function ( path ) {
            $location.path( path );
        };
        
        //variable que almacena el estado anterior del carrito en el Session Storage.
        try {
            var carritoVacio_SS=JSON.parse(sessionStorage['carritoVacio_SS']);
             if(!carritoVacio_SS){
                 this.cambiarValorValidacionDireccion(); 
                 var tempCarrito = JSON.parse(sessionStorage['carrito']);
                 $scope.carrito.cantidadDeItems=tempCarrito.cantidadDeItems;
                 $scope.carrito.descuento=tempCarrito.descuento;
                 $scope.carrito.idDescuento=tempCarrito.idDescuento;
                 $scope.carrito.items=tempCarrito.items;
                 $scope.carrito.serie=tempCarrito.serie;
                 $scope.carrito.total=tempCarrito.total;
                 console.log($scope.carrito);
                 var tempOrden= JSON.parse(sessionStorage['orden']);  
                 $scope.orden.direccion_cliente=tempOrden.direccion_cliente;
                 console.log($scope.orden);
                 var tempLicorera=JSON.parse(sessionStorage['licorera']);
                 $scope.licorera.costoEnvio=tempLicorera.costoEnvio;
                 $scope.licorera.disponible=tempLicorera.disponible;
                 $scope.licorera.id=tempLicorera.id;
                 $scope.licorera.montoMinimo=tempLicorera.montoMinimo;
                 $scope.licorera.pagoEfectivo=tempLicorera.pagoEfectivo;
                 $scope.licorera.pagoTarjeta=tempLicorera.pagoTarjeta;
                 $scope.licorera.usuario=tempLicorera.usuario;
                 console.log($scope.licorera);
                 var mostrarCarrito = JSON.parse(sessionStorage['mostrarCarrito']);
                 if(mostrarCarrito){                     
                     this.go('carrito');
                     sessionStorage['mostrarCarrito']=JSON.stringify(false);
                 }
             }
        } catch (err) {
            console.error("Error parsing stored data: " + err);
        }       
        
       
        this.enviarDatos=function(){
            var orden=OrdenService.getOrden();
            var carrito=CarritoService.getCarrito();
            var licorera=DatosExternosService.getLicorera();
            sessionStorage['orden']=JSON.stringify(orden);
            sessionStorage['carrito']=JSON.stringify(carrito);
            sessionStorage['licorera']=JSON.stringify(licorera);
            if(carrito.items.length>0){
                sessionStorage['carritoVacio_SS']=false;    
            }else{
               sessionStorage['carritoVacio_SS']=true; 
            }  
        };      
        
        this.nombre_cliente=DatosExternosService.getCliente();  
        this.animacion_carrito = NavegacionService.getAnimacionCarrito();
        this.animarCarrito =  NavegacionService.animarCarrito;
        
        this.tab = 0;
        this.selectTab = function (tab) {
            this.tab = tab;       
        };
        this.navegacion=NavegacionService.getNavegacion();
        
        this.categoria=function(categoria){
            this.navegacion.categoria=categoria;
        }
        this.subcategoria=function(subcategoria){
            this.navegacion.subcategoria=subcategoria;
        }  
        
        //registra un evento a ga
        this.registrarEventoGa = function(categoria,accion,label){
            $window.ga('send','event',categoria,accion,label);
        };
        
        //registra un cambio de página a ga
        $scope.$on('$viewContentLoaded', function(event) {
            if($location.url() == '/'){
                $window.ga('set','page','/compras/');
                $window.ga('send', 'pageview');
            } else {
                $window.ga('set','page', $location.url());
                $window.ga('send', 'pageview');
            };
        });
        
        //registra evento de agregacion al carrito en facebook
        this.agregarAlCarritoFacebook = function(producto,categoria){
            $window.fbq('track', 'AddToCart', {content_name: producto, content_category: categoria});
        };
        
        //registra evento iniciar compra en facebook
        this.iniciarCompraFacebook = function(){
            $window.fbq('track', 'InitiateCheckout');
        };
        
        
    }])
    
    .controller('FechaController',['$scope',function($scope){
        $scope.fecha={};
        $scope.anios=[];       
        $scope.fecha.anio=null;
        $scope.fecha.mes=null;
        $scope.fecha.dia=null;
        $scope.esmayor=false;
        
        $scope.ingreso=function(){
            $scope.calcularEdad();
            if($scope.esmayor){   
                location.href="/compras/";
                
            }else{
                $().toastmessage('showErrorToast', 'Lo sentimos no eres mayor de edad, no puedes ingresar.');
            }
        }
        
        $scope.generarAnio=function(){
             var myDate = new Date();
             var year = myDate.getFullYear();
            var mayoredad=year-18;
            
            for(var i = 1930; i <=mayoredad; i++){
	           $scope.anios.push(i);
            }
        } 
        
        $scope.calcularEdad=function(){
            var mydate = new Date();
            var anio=mydate.getFullYear();
            var mes= mydate.getMonth()+1;  
            var dia= mydate.getDate();            
            var mayorEnAnio=anio-$scope.fecha.anio;
            var mayorEnMes= mes - parseInt($scope.fecha.mes);
            var mayorEnDia= dia - parseInt($scope.fecha.dia);
            if(mayorEnAnio>18){
                $scope.esmayor=true;
            }else if(mayorEnAnio!=18){
                $scope.esmayor=false;                
            }else{
                if(mayorEnMes>0){
                    $scope.esmayor=true;
                }else if(mayorEnMes<0){
                    $scope.esmayor=false;
                }else{
                    if(mayorEnDia>=0){
                        $scope.esmayor=true;
                    }else{
                        $scope.esmayor=false;
                    }
                }
            }            
        }   
        
    }])
    
    .controller('DireccionController',['$scope','$http','OrdenService','DatosExternosService',function($scope,$http,OrdenService,DatosExternosService){         
        //obtiene todas las zonas disponibles
        $http.get('/api/zonas/')
                .success(function(data){
                    $scope.zonas = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Se presentó un error inesperado, recarga la página.',
                        sticky: true,
                        type: 'warning',
                        close: function(){window.location.reload();},
                    });
                });
        
        //opciones de direccion
        $scope.opciones_direccion = [
            {"id":1, "nombre":'calle', "valor":1},
            {"id":2, "nombre":'carrera', "valor":2},
            {"id":3, "nombre":'Av. calle', "valor":1},
            {"id":4, "nombre":'Av. carrera', "valor":2},
            {"id":5, "nombre":'Circunvalar', "valor":2},
            {"id":6, "nombre":'Diagonal', "valor":1},
            {"id":7, "nombre":'Transversal', "valor":2},
        ];
        $scope.opcion_direccion_seleccionada = $scope.opciones_direccion[0];
        
        //valores del formulario
        $scope.valores = {};
        $scope.valores.valor_uno = "";
        $scope.valores.valor_dos = "";
        $scope.valores.valor_tres = "";
        $scope.valores.es_sur = false;
        $scope.valores.es_este = false;
        $scope.valores.complemento = "";
        
        //obtiene los datos de la orden (direccion,licorera,cliente) y el Usuario Licorera
        $scope.orden = OrdenService.getOrden();
        $scope.licorera=DatosExternosService.getLicorera();
        var LicoreraAnterior=$scope.licorera.id;
        
        //obtiene la licorera que provee esa zona
        $scope.obtenerLicorera = function(){
            
            $scope.licoreras_preseleccionadas = [];
            $scope.licoreras_preseleccionadas_dos = [];
            $scope.valor_uno_numero = $scope.valores.valor_uno.split(/[a-zA-Z]/,1);
            $scope.valor_dos_numero = $scope.valores.valor_dos.split(/[a-zA-Z]/,1);
            
            //filtra las licoreras que sean sur, este
            for(var i = 0; i< $scope.zonas.length; i++){
                if($scope.zonas[i].essur === $scope.valores.es_sur && $scope.zonas[i].eseste === $scope.valores.es_este){
                    $scope.licoreras_preseleccionadas.push($scope.zonas[i]);
                }
            };
            
            //si la opcion es calle
            if($scope.opcion_direccion_seleccionada.valor === 1){
                //compara la calle
                for(var i = 0; i < $scope.licoreras_preseleccionadas.length; i++){
                    if($scope.valor_uno_numero >= $scope.licoreras_preseleccionadas[i].callemenor && $scope.valor_uno_numero <= $scope.licoreras_preseleccionadas[i].callemayor){
                        $scope.licoreras_preseleccionadas_dos.push($scope.licoreras_preseleccionadas[i]);
                    }
                };
                //compara la carrera
                for(var i = 0; i < $scope.licoreras_preseleccionadas_dos.length; i++){
                    if($scope.valor_dos_numero >= $scope.licoreras_preseleccionadas_dos[i].carreramenor && $scope.valor_dos_numero <= $scope.licoreras_preseleccionadas_dos[i].carreramayor){
                        $scope.licorera.id=$scope.licoreras_preseleccionadas_dos[i].licorera;
                        $scope.licorera.usuario=$scope.licoreras_preseleccionadas_dos[i].usuariolicorera;
                        $scope.licorera.disponible=$scope.licoreras_preseleccionadas_dos[i].disponible;
                        $scope.licorera.montoMinimo=$scope.licoreras_preseleccionadas_dos[i].montominimo;
                        $scope.licorera.costoEnvio=$scope.licoreras_preseleccionadas_dos[i].costoenvio;
                        $scope.licorera.pagoEfectivo=$scope.licoreras_preseleccionadas_dos[i].efectivo;
                        $scope.licorera.pagoTarjeta=$scope.licoreras_preseleccionadas_dos[i].tarjeta;
                    }
                };
            };
            
            //si la opcion es carrera
            if($scope.opcion_direccion_seleccionada.valor === 2){
                //compara la carrera
                for(var i = 0; i < $scope.licoreras_preseleccionadas.length; i++){
                    if($scope.valor_uno_numero >= $scope.licoreras_preseleccionadas[i].carreramenor && $scope.valor_uno_numero <= $scope.licoreras_preseleccionadas[i].carreramayor){
                        $scope.licoreras_preseleccionadas_dos.push($scope.licoreras_preseleccionadas[i]);
                    }
                };
                //compara la calle
                for(var i = 0; i < $scope.licoreras_preseleccionadas_dos.length; i++){
                    if($scope.valor_dos_numero >= $scope.licoreras_preseleccionadas_dos[i].callemenor && $scope.valor_dos_numero <= $scope.licoreras_preseleccionadas_dos[i].callemayor){
                        $scope.licorera.id=$scope.licoreras_preseleccionadas_dos[i].licorera;
                        $scope.licorera.usuario=$scope.licoreras_preseleccionadas_dos[i].usuariolicorera;
                        $scope.licorera.disponible=$scope.licoreras_preseleccionadas_dos[i].disponible;
                        $scope.licorera.montoMinimo=$scope.licoreras_preseleccionadas_dos[i].montominimo;
                        $scope.licorera.costoEnvio=$scope.licoreras_preseleccionadas_dos[i].costoenvio;
                        $scope.licorera.pagoEfectivo=$scope.licoreras_preseleccionadas_dos[i].efectivo;
                        $scope.licorera.pagoTarjeta=$scope.licoreras_preseleccionadas_dos[i].tarjeta;
                    }
                };
            };
            
            $scope.sur = "";
            $scope.este = "";
            if($scope.valores.es_sur === true){
                $scope.sur = "sur";
            }
            if($scope.valores.es_este === true){
                $scope.este = "este";
            }
            if($scope.opcion_direccion_seleccionada.valor === 1){
                $scope.orden.direccion_cliente = $scope.opcion_direccion_seleccionada.nombre +' '+ $scope.valores.valor_uno + $scope.sur +' # '+ $scope.valores.valor_dos +' - '+ $scope.valores.valor_tres + ' ' + $scope.este + ' ' + $scope.valores.complemento;
            } else {
                $scope.orden.direccion_cliente = $scope.opcion_direccion_seleccionada.nombre +' '+ $scope.valores.valor_uno + $scope.este +' # '+ $scope.valores.valor_dos +' - '+ $scope.valores.valor_tres + ' ' + $scope.sur + ' ' + $scope.valores.complemento;
            }
            
            //obtiene la licorera seleccionada
            if($scope.licorera.id != 0){
                if($scope.licorera.disponible==true){
                    $().toastmessage('showSuccessToast', 'Bienvenido, ponte en modo Ebrios');
                    if($scope.licorera.id!=LicoreraAnterior){
                        sessionStorage.clear();
                    }
                }else{
                    $().toastmessage('showToast', {
                        text: 'La licorera se encuentra cerrada, intenta en unos minutos!!',
                        sticky: true,
                        type: 'notice',
                        close: function(){window.location.reload();},
                    });
                }                
            } else {
                $().toastmessage('showToast', {
                    text: 'En el momento no tenemos cobertura en tu zona, estamos trabajando para brindarte el servicio pronto.',
                    sticky: true,
                    type: 'warning',
                    close: function(){window.location.reload();},
                    cerrar: false
                });
            }
        };
        
    }])
    
    .controller('ProductosController',['$scope','ProductosService','DatosExternosService','CarritoService','OrdenService',function($scope,ProductosService,DatosExternosService,CarritoService,OrdenService){
        $scope.licorera=DatosExternosService.getLicorera();              
        
        function obtenerProducto(){
            if($scope.licorera.disponible==true){
                ProductosService.query({licorera:$scope.licorera.id},function(data){
                    $scope.productos=data;                    
                },function(error){
                    $().toastmessage('showToast', {
                        text: 'Ocurrió un problema inesperado con la carga de productos, por favor recarga la página e inténtalo de nuevo.',
                        sticky: true,
                        type: 'warning',
                        close: function(){window.location.reload();},
                        cerrar: false
                    });
                });                 
             }
        }
        
        obtenerProducto();
        
        $scope.$watch('licorera.id',function(newVal,oldVal){
            if(newVal != oldVal){
                obtenerProducto();
            }
        });
        $scope.agregar=CarritoService.agregarAlCarrito;
        
    }])
    
    .controller('CategoriaController',['$scope','NavegacionService','CategoriaService','$routeParams',function($scope,NavegacionService,CategoriaService,$routeParams){
        $scope.navegacion=NavegacionService.getNavegacion();   
        $scope.navegacion.categoria=$routeParams.idCategoria;
        CategoriaService.categoria(function(data){
            $scope.categorias=data;
            $scope.categoriaActual($scope.navegacion.categoria);
        });
        
        CategoriaService.subcategoria(function(data){
            $scope.subcategorias=data;
        });
        
         $scope.categoriaActual = function(categoria){
             var x=0;
            while(x<$scope.categorias.length){
                if($scope.categorias[x].nombre === categoria){
                    $scope.categoria = $scope.categorias[x].id;
                    x=$scope.categorias.length;
                }
                x++;
            };
        };
        
        $scope.$watch('navegacion.categoria',function(newVal,oldVal){
            if(newVal != oldVal){
                $scope.categoriaActual($scope.navegacion.categoria);
            }
        });        
       
    }])
    
    .controller('CarritoController',['$scope','CarritoService','DatosExternosService','CuponService',function($scope,CarritoService,DatosExternosService,CuponService){
        $scope.carrito=CarritoService.getCarrito();
        $scope.cambioUnitario=CarritoService.cambioUnitario;
        $scope.eliminarProducto=CarritoService.eliminarProducto;
        $scope.cliente=DatosExternosService.getCliente();
        $scope.licorera=DatosExternosService.getLicorera();
        $scope.cuponActivo=false;        
        $scope.cupon; 
        $scope.descuento;
        $scope.getCupon=function(serie){
            if($scope.cliente.id!='null'){
                if(serie!=""){
                    CuponService.query({serie:serie}).$promise.then(function(data){
                    $scope.cupon=data;
                    if($scope.cupon.length != 0){
                        CuponService.aplicar({pk_cliente:$scope.cliente.id,pk_cupon:$scope.cupon[0].id}).$promise.then(function(data){
                        $scope.descuento=data;
                        if($scope.descuento.length!=0){
                            if($scope.descuento[0].activo==true){
                                $scope.cuponActivo=true;                         
                                $scope.nuevoValorTotal=$scope.carrito.total*((100-$scope.cupon[0].descuento)/100);
                                $scope.carrito.descuento=$scope.cupon[0].descuento;
                                $scope.carrito.idDescuento=$scope.descuento[0].id;
                                $().toastmessage('showSuccessToast', 'Cupon activado');  
                            }else{
                                $scope.cuponActivo=false;
                                $().toastmessage('showNoticeToast', 'El cupon ya fue utilizado');
                            }
                        }else{
                            $().toastmessage('showWarningToast', 'No tienes permitido usar este cupon. Lo sentimos :(');
                        }   

                        });
                    }else{
                        $().toastmessage('showErrorToast', 'Este cupon no existe verifica el código');
                    };
                    });
                }else{
                    $().toastmessage('showErrorToast', 'Este cupon no existe verifica el código');
                }
            }else{
                $().toastmessage('showErrorToast', 'Debes iniciar sesión para poder usar un cupón');
            }
        }
        
         $scope.$watch('carrito.total', function(newValue, oldValue) {            
            if ( newValue !== oldValue ) {
                if($scope.cuponActivo){
                    if($scope.carrito.total==0){
                        $scope.cuponActivo=false;
                        $scope.carrito.descuento=0;
                        $scope.carrito.idDescuento=0;
                    }
                    $scope.nuevoValorTotal=$scope.carrito.total*((100-$scope.cupon[0].descuento)/100);
                    $scope.carrito.descuento=$scope.cupon[0].descuento;
                }
            }
        });
        
    }])
    
    .controller('OrdenController',['$scope','DatosExternosService','OrdenService','CarritoService','CuponService',function($scope,DatosExternosService,OrdenService,CarritoService,CuponService){
        $scope.orden=OrdenService.getOrden();
        var licorera=DatosExternosService.getLicorera();
        var cliente=DatosExternosService.getCliente();
        var carrito=CarritoService.getCarrito();
        
        $scope.llenarOrden=function(){ 
            $scope.orden.telefono_cliente =$scope.telefonoCliente;             
            $scope.orden.subtotal = carrito.total;
            $scope.orden.cliente = cliente.id; 
            $scope.orden.licorera = licorera.id;              
            $scope.orden.descuento = carrito.descuento;
            $scope.orden.total_compra = carrito.total*((100-carrito.descuento)/100);
            $scope.orden.total_compra=$scope.orden.total_compra+licorera.costoEnvio;
            armarPedido();            
            DatosExternosService.horaActual().get(function(data){
                $scope.orden.horallegada = data.hora;
                OrdenService.ordenPost.post($scope.orden,function(data){
                    $().toastmessage('showSuccessToast', 'Tu pedido se ha enviado correctamente');
                    if(carrito.descuento>0){
                        var putCupon={
                            activo:false,
                        }
                        CuponService.actualizar({id:carrito.idDescuento},putCupon);
                    }
                    //envia la notificacion a la licorera
                    OrdenService.alertaLicorera.get({user:licorera.usuario});
                    
                    carrito.items=[];
                    carrito.total=0;
                    carrito.descuento=0;
                    carrito.idDescuento=0;
                    carrito.serie="";
                    carrito.cantidadDeItems=0;
                    sessionStorage.clear();
                });
            });                        
        }
        
        function armarPedido(){
            var nuevoItem,id,cantidad;
            $scope.orden.pedido=[];
            for(var i=0;i<carrito.items.length;i++){
                id=carrito.items[i].id;
                cantidad=carrito.items[i].cantidad;
                nuevoItem=[id,cantidad];
                $scope.orden.pedido.push(nuevoItem);
            }
        }
        
        //registra la compra en facebook
        $scope.compraRealizadaFacebook = function(){
            $scope.compra_facebook =  ($scope.orden.total_compra - licorera.costoEnvio)*0.10;
            fbq('track', 'Purchase', {value: $scope.compra_facebook, currency: 'COP'});
        };

    }])
    
    .controller('RegistroController',['$scope','RegistroService',function($scope,RegistroService){    
        
        $scope.usuario={
            email:'',
            password:'',
            nombre:'',
            apellido:'',
        };
        
        $scope.cliente={
            telefono: '',
            fechanacimiento: null,
            sexo:'',
            direccioncompleta: '',
            calle: '',
            carrera: '',
            essur:'',
            eseste:'',
            empiezapor:'',
            usuariocliente: null,
        };
        
        $scope.direccion={}; 
        $scope.fecha={};  
        $scope.anios=[];       
        $scope.fecha.anio=null;
        $scope.fecha.mes=null;
        $scope.fecha.dia=null;
        $scope.esmayor=false;
        
        $scope.formulario=function(){            
            
            
            if($scope.cliente.empiezapor=='CALLE' || $scope.cliente.empiezapor=='AV.CALLE' || $scope.cliente.empiezapor=='DIAGONAL'){
               $scope.cliente.calle=$scope.direccion.dire1;
                $scope.cliente.carrera=$scope.direccion.dire2;
               if($scope.direccion.sureste1==' SUR'){
                   $scope.cliente.essur=true;
               }else{
                   $scope.cliente.essur=false;
               }
               if($scope.direccion.sureste2=='ESTE'){
                   $scope.cliente.eseste=true;
               }else{
                   $scope.cliente.eseste=false;
               }
            }else{
               $scope.cliente.calle=$scope.direccion.dire2;
               $scope.cliente.carrera=$scope.direccion.dire1;
               if($scope.direccion.sureste1==' ESTE'){
                   $scope.cliente.eseste=true;
               }else{
                   $scope.cliente.eseste=false;
               }
               if($scope.direccion.sureste2=='SUR'){
                   $scope.cliente.essur=true;
               }else{
                   $scope.cliente.essur=false;
               }
                
            }
            $scope.cliente.fechanacimiento=$scope.fecha.anio+'-'+$scope.fecha.mes+'-'+$scope.fecha.dia;
            
            $scope.calcularEdad();
            
            if($scope.esmayor){                
                RegistroService.usuario($scope.usuario,function(data){
                $scope.cliente.usuariocliente=data.id;
                RegistroService.cliente($scope.cliente,function(data){
                     location.href="/accounts/login";
                });
            });                
            }else{
                $().toastmessage('showErrorToast', 'Lo sentimos, este servicio es para mayores de edad.');
            }
        }       
        
        $scope.generarAnio=function(){
             var myDate = new Date();
             var year = myDate.getFullYear();
            var mayoredad=year-18;
            
            for(var i = 1930; i <=mayoredad; i++){
	           $scope.anios.push(i);
            }
        } 
        
        $scope.calcularEdad=function(){
            var mydate= new Date();
            var anio=mydate.getFullYear();
            var mes= mydate.getMonth()+1;  
            var dia= mydate.getDate();            
            var mayorEnAnio=anio-$scope.fecha.anio;
            var mayorEnMes= mes - parseInt($scope.fecha.mes);
            var mayorEnDia= dia - parseInt($scope.fecha.dia);
            if(mayorEnAnio>18){
                $scope.esmayor=true;
            }else if(mayorEnAnio!=18){
                $scope.esmayor=false;                
            }else{
                if(mayorEnMes>0){
                    $scope.esmayor=true;
                }else if(mayorEnMes<0){
                    $scope.esmayor=false;
                }else{
                    if(mayorEnDia>=0){
                        $scope.esmayor=true;
                    }else{
                        $scope.esmayor=false;
                    }
                }
            }            
        }        
        
    }]);
    
})();