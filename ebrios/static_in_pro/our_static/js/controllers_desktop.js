(function(){
    
    angular.module('ebrios.controllers',[])
    
    //CONTROLADOR DEL REGISTRO
    .controller('RegistroController',['$scope','$http',function($scope,$http){
        
         //obtiene la fecha y hora actuales
         $http.get('/datetime/')
                .success(function(data){
                    $scope.fecha_actual = data.fecha.split("-",3);
                });
        
        //datos nuevo usuario
        $scope.usuario = {};
        $scope.usuario.email = "";
        $scope.usuario.password = "";
        $scope.usuario.nombre = "";
        $scope.usuario.apellido = "";
        
        $scope.confirmar_contrasena = "";
        
        //valor de la fecha de nacimiento en el registro
        $scope.fecha_registro = {};
        $scope.fecha_registro.dia = "";
        $scope.fecha_registro.mes = "";
        $scope.fecha_registro.ano = "";
        
        //valor de la fecha de nacimiento en el inicio
        $scope.fecha_inicio = {};
        $scope.fecha_inicio.dia = "";
        $scope.fecha_inicio.mes = "";
        $scope.fecha_inicio.ano = "";
        
        $scope.cliente = {};
        $scope.cliente.telefono = "";
        $scope.cliente.fechanacimiento = "";
        $scope.cliente.sexo = "";
        $scope.cliente.usuariocliente = "";
        
        //valida igualdad de contraseñas
        $scope.validacion_contrasenas = false;
        
        $scope.validarIgualdadContrasenas =  function(){
            if($scope.usuario.password === $scope.confirmar_contrasena){
                $scope.validacion_contrasenas = true;
            } else {
                $scope.validacion_contrasenas = false;
            }
        };
        
        //aceptacion de condiciones
        $scope.validacion_condiciones = false;
        
        //valores para la fecha
        $scope.dias = [];
        $scope.meses = [];
        $scope.anos = [];
        
        //agrega los dias y meses a las variables
        for(var i = 0; i < 31; i++){
            $scope.dias[i] = i+1;
        };
        for(var i = 0; i < 12; i++){
            $scope.meses[i] = i+1;
        };
        
        //calcula la cantidad de años
        $scope.calcularAnos =  function(){
            $scope.ano_actual = $scope.fecha_actual[0]-18;
            for(var i = 0; i <= 50; i++){
                $scope.anos[i] =  $scope.ano_actual-i;
            };
            $scope.cliente.fechanacimiento = $scope.fecha_registro.ano+"-"+$scope.fecha_registro.mes+"-"+$scope.fecha_registro.dia;
        };
        
        //registra usuario y cliente
        $scope.registrar = function(){
            $http.post('/api/registrarusuario/',$scope.usuario).
                success(function(data){
                    $scope.cliente.usuariocliente = data.id;
                    $http.post('/api/registrarcliente/',$scope.cliente).
                        success(function(data){
                            $scope.datos_activar_cupon = {
                                "activo": true,
                                "cupon": 1,
                                "cliente": data.id
                            };
                            $http.post('/api/aplicardescuento/',$scope.datos_activar_cupon).
                                success(function(data){
                                    $scope.datos_correo = {
                                        "id": $scope.cliente.usuariocliente,
                                        "correo": $scope.usuario.email
                                    };
                                    $http.post('/enviarcorreo/',$scope.datos_correo).
                                        success(function(data){
                                            setTimeout(function(){
                                                window.location.href = '/accounts/login/';
                                            },2000);
                                        }).error(function(error){
                                            setTimeout(function(){
                                                window.location.href = '/accounts/login/';
                                            },2000);
                                        });
                                }).error(function(error){
                                    setTimeout(function(){
                                        window.location.href = '/accounts/login/';
                                    },2000);
                                });
                        }).error(function(error){
                            $http.delete('/api/registrarusuario/'+$scope.cliente.usuariocliente+'/');
                        });
                }).error(function(error){
                    $().toastmessage('showErrorToast', 'NO SE PUDO CREAR TU USUARIO, INTENTALO DE NUEVO');
                    $().toastmessage('showErrorToast', error.email[0]);
                });
        };
        
    }])
    
    //CONTROLADOR DE LA NAVEGACIÓN PRINCIPAL Y OBTENCIÓN DE DATOS
    .controller('NavController',['$scope','$location','DatosService','CarritoService','$window','$http',function($scope,$location,DatosService,CarritoService,$window,$http){
        
        sessionStorage['continuarCarrito']=JSON.stringify(false);
        
        //guarda si el cliente ya digito la direccion
        $scope.validacion_direccion =  false;
        
        //cambia el valor de la validacion
        $scope.cambiarValorValidacionDireccion = function(){
            $scope.validacion_direccion =  !$scope.validacion_direccion;
        }      
        
        //controla la url interna
        $scope.go = function ( path ) {
            $location.path( path );
        };
        
        //controla la navegacion del sitio
        $scope.nav = 0;
        
        $scope.selectNav = function(nav){
            $scope.nav = nav;
        };
        
        //contiene los datos de la orden
        $scope.datos_orden = DatosService.getDatosOrden();
        $scope.productos_pedido = CarritoService.getProductosPedido();
        $scope.arreglo_post_productos = CarritoService.getArregloPostProductos();       
        $scope.id_usuario_licorera =  DatosService.getIdUsuarioLicorera();
        
        //obtiene los datos del cliente autenticado
        $http.get('/obtenerclienteautenticado/')
                .success(function(data){
                    $scope.cliente_autenticado = data;
                    $scope.datos_orden.cliente = $scope.cliente_autenticado.id;
                }).error(function(error){
                    window.location.href = '/accounts/logout/';
                });
        
        //registra un evento a ga
        $scope.registrarEventoGa = function(categoria,accion,label){
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
        
        $scope.rutaContinuar=function(){
            if($scope.cliente_autenticado.nombreusuario!='Anonimo'){
                $scope.go('/carrito/confirmar');
            }else{
                sessionStorage['continuarCarrito']=JSON.stringify(true);
                $window.location.href='/ingreso';                
            }
        }
        
        try {
            var carritoVacio_SS=JSON.parse(sessionStorage['carritoVacio_SS']);
             if(!carritoVacio_SS){
                 $scope.cambiarValorValidacionDireccion(); 
                 var tempProductosPedido = JSON.parse(sessionStorage['productos_pedido']);
                 for(var i=0;i<tempProductosPedido.length;i++){
                     $scope.productos_pedido.push(tempProductosPedido[i]);
                 }
                 console.log($scope.productos_pedido);
                 var tempArregloPostProductos = JSON.parse(sessionStorage['arreglo_post_productos']);
                 for(var i=0;i<tempArregloPostProductos.length;i++){
                     $scope.arreglo_post_productos.push(tempArregloPostProductos[i]);
                 }
                 console.log($scope.arreglo_post_productos);
                 CarritoService.calcularNumeroProductos();
                 CarritoService.calcularTotalCompra();
                 var tempOrden= JSON.parse(sessionStorage['datos_orden']);  
                 $scope.datos_orden.direccion_cliente = tempOrden.direccion_cliente;
                 $scope.datos_orden.subtotal = tempOrden.subtotal;
                 $scope.datos_orden.cliente = tempOrden.cliente;
                 $scope.datos_orden.licorera = tempOrden.licorera;
                 $scope.datos_orden.pedido = tempOrden.pedido;
                 $scope.datos_orden.descuento = tempOrden.descuento;
                 $scope.datos_orden.total_compra = tempOrden.total_compra;
                 console.log($scope.datos_orden);
                 var tempLicorera=JSON.parse(sessionStorage['id_usuario_licorera']);
                 $scope.id_usuario_licorera.id = tempLicorera.id;
                 $scope.id_usuario_licorera.disponible = tempLicorera.disponible;
                 $scope.id_usuario_licorera.montominimo = tempLicorera.montominimo;
                 $scope.id_usuario_licorera.costoenvio = tempLicorera.costoenvio;
                 $scope.id_usuario_licorera.efectivo = tempLicorera.efectivo;
                 $scope.id_usuario_licorera.tarjeta = tempLicorera.tarjeta;
                 console.log($scope.id_usuario_licorera);
                 var mostrarCarrito = JSON.parse(sessionStorage['mostrarCarrito']);
                 if(mostrarCarrito){                     
                     $scope.go('carrito');
                     sessionStorage['mostrarCarrito']=JSON.stringify(false);
                 }
             }
        } catch (err) {
            console.error("Error parsing stored data: " + err);
        }
        
        $scope.enviarDatos=function(){
            var productos_pedido = CarritoService.getProductosPedido();
            var arreglo_post_productos = CarritoService.getArregloPostProductos();       
            var datos_orden = DatosService.getDatosOrden();
            var id_usuario_licorera =  DatosService.getIdUsuarioLicorera();
        
            sessionStorage['datos_orden']=JSON.stringify(datos_orden);
            sessionStorage['productos_pedido']=JSON.stringify(productos_pedido);
            sessionStorage['arreglo_post_productos']=JSON.stringify(arreglo_post_productos);
            sessionStorage['id_usuario_licorera']=JSON.stringify(id_usuario_licorera);
            if(productos_pedido.length>0){
                sessionStorage['carritoVacio_SS']=false;    
            }else{
               sessionStorage['carritoVacio_SS']=true; 
            }
        }
        
        $scope.agregarAlCarritoFacebook = function(producto,categoria){
            $window.fbq('track', 'AddToCart', {content_name: producto, content_category: categoria});
        };
        
        $scope.iniciarCompraFacebook = function(){
            $window.fbq('track', 'InitiateCheckout');
        };
        
    }])
    
    //CONTROLADOR DEL BUZON DE SUGERENCIAS
    .controller('BuzonController',['$scope','DatosService','$http', function($scope,DatosService,$http){
        
        //opciones del buzon
        $scope.opciones_buzon = [ 'Sugerencia','Felicitación','Queja o reclamo'];
        
        //obtiene el correo del cliente
        $scope.datos_orden = DatosService.getDatosOrden();
        
        $scope.buzon = {};
        $scope.buzon.cliente_comentario = "";
        $scope.buzon.categoria_comentario = $scope.opciones_buzon[0];
        $scope.buzon.comentario = "";
        
        $scope.enviarBuzon = function(){
            $scope.buzon.cliente_comentario = $scope.datos_orden.cliente;
            $http.post('/buzondesugerencias/',$scope.buzon).
                success(function(data){
                    $scope.buzon.comentario = "";
                    $().toastmessage('showSuccessToast', 'Gracias, tu opinión es muy importante para nosotros!!');
                }).error(function(error){
                    $().toastmessage('showErrorToast', 'No pudimos registrar tu comentario, intentalo de nuevo');
                });
        };
        
    }])
    
    //CONTROLADOR DE LA NAVEGACIÓN PRINCIPAL Y OBTENCIÓN DE DATOS
    .controller('DireccionController',['$scope','$http','DatosService',function($scope,$http,DatosService){
        
        //obtiene todas las zonas disponibles
        $http.get('/api/zonas/')
                .success(function(data){
                    $scope.zonas = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Se presento un error inesperado, recarga la página',
                        sticky: true,
                        type: 'warning',
                        close: function(){window.location.reload();}
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
        
        //obtiene los datos de la orden (direccion,licorera,cliente)
        $scope.datos_orden = DatosService.getDatosOrden();
        $scope.id_usuario_licorera = DatosService.getIdUsuarioLicorera();
        var LicoreraAnterior=$scope.id_usuario_licorera.id;
        //obtiene los productos de la licorera
        $scope.productos = DatosService.getProductos();
        
        //obtiene los datos de la transaccion para analytics
        $scope.datos_transaccion_analytics = DatosService.getDatosTransaccionAnalytics();
        
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
                        $scope.datos_transaccion_analytics.affiliation = $scope.licoreras_preseleccionadas_dos[i].razon_social;
                        $scope.datos_orden.licorera = $scope.licoreras_preseleccionadas_dos[i].licorera;
                        $scope.id_usuario_licorera.id = $scope.licoreras_preseleccionadas_dos[i].usuariolicorera;
                        $scope.id_usuario_licorera.disponible = $scope.licoreras_preseleccionadas_dos[i].disponible;
                        $scope.id_usuario_licorera.montominimo = $scope.licoreras_preseleccionadas_dos[i].montominimo;
                        $scope.id_usuario_licorera.costoenvio = $scope.licoreras_preseleccionadas_dos[i].costoenvio;
                        $scope.id_usuario_licorera.efectivo = $scope.licoreras_preseleccionadas_dos[i].efectivo;
                        $scope.id_usuario_licorera.tarjeta = $scope.licoreras_preseleccionadas_dos[i].tarjeta;
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
                        $scope.datos_transaccion_analytics.affiliation = $scope.licoreras_preseleccionadas_dos[i].razon_social;
                        $scope.datos_orden.licorera = $scope.licoreras_preseleccionadas_dos[i].licorera; 
                        $scope.id_usuario_licorera.id = $scope.licoreras_preseleccionadas_dos[i].usuariolicorera;
                        $scope.id_usuario_licorera.disponible = $scope.licoreras_preseleccionadas_dos[i].disponible;
                        $scope.id_usuario_licorera.montominimo = $scope.licoreras_preseleccionadas_dos[i].montominimo;
                        $scope.id_usuario_licorera.costoenvio = $scope.licoreras_preseleccionadas_dos[i].costoenvio;
                        $scope.id_usuario_licorera.efectivo = $scope.licoreras_preseleccionadas_dos[i].efectivo;
                        $scope.id_usuario_licorera.tarjeta = $scope.licoreras_preseleccionadas_dos[i].tarjeta;
                    }
                };
                
            };
            
            $scope.sur = "";
            $scope.este = "";
            if($scope.valores.es_sur === true){
                $scope.sur = " sur";
            }
            if($scope.valores.es_este === true){
                $scope.este = " este";
            }
            if($scope.opcion_direccion_seleccionada.valor === 1){
                $scope.datos_orden.direccion_cliente = $scope.opcion_direccion_seleccionada.nombre +' '+ $scope.valores.valor_uno + $scope.sur +' # '+ $scope.valores.valor_dos +' - '+ $scope.valores.valor_tres + ' ' + $scope.este + ' ' + $scope.valores.complemento;
            } else {
                $scope.datos_orden.direccion_cliente = $scope.opcion_direccion_seleccionada.nombre +' '+ $scope.valores.valor_uno + $scope.este +' # '+ $scope.valores.valor_dos +' - '+ $scope.valores.valor_tres + ' ' + $scope.sur + ' ' + $scope.valores.complemento;
            }
            
            //obtiene los productos de acuerdo a la licorera seleccionada
            if($scope.datos_orden.licorera != ''){
                
                if($scope.id_usuario_licorera.disponible === true){
                    if($scope.id_usuario_licorera.id!=LicoreraAnterior){
                        sessionStorage.clear();
                    }
                    $http.get('/api/productos/?licorera='+$scope.datos_orden.licorera+'&borrados=3&disponibles=2')
                        .success(function(data){
                            $scope.productos.items = data;
                        }).error(function(error){
                            $().toastmessage('showErrorToast', 'No se pudieron cargar los licores, porfavor recarga la página');
                        });
                    $().toastmessage('showSuccessToast', 'Bienvenido, ponte en modo Ebrios');
                } else {
                    $().toastmessage('showToast', {
                        text: 'La licorera se encuentra cerrada, vuelve en minutos!!',
                        sticky: true,
                        type: 'notice',
                        close: function(){window.location.reload();},
                        cerrar: false
                    });
                }
            } else {
                $().toastmessage('showToast', {
                    text: 'En el momento no tenemos cobertura en tu zona, estamos trabajando para brindarte el servicio pronto!',
                    sticky: true,
                    type: 'warning',
                    close: function(){window.location.reload();},
                    cerrar: false
                });
            };
        };
        
    }])
    
    //CONTROLADOR DE LA PAGINA PRINCIPAL
    .controller('PrincipalController',['$scope','$http','ActualizarService','CarritoService','$routeParams',function($scope,$http,ActualizarService,CarritoService,$routeParams){
        
        //controla la animacion del carrito
        $scope.animacion_carrito = ActualizarService.getAnimacionCarrito();
        $scope.animarCarrito =  ActualizarService.animarCarrito;       
        
        //habilita el buzon de sugerencias
        $scope.validacion_buzon =  false;
        
        //cambia el valor de la validacion
        $scope.cambiarValorValidacionBuzon = function(){
            $scope.validacion_buzon =  !$scope.validacion_buzon;
        } 
        
        //obtiene las subcategorias
        $http.get('/api/subcategorias/')
                .success(function(data){
                    $scope.subcategorias = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'No se pudieron cargar las subcategorias, recarga la página',
                        sticky: true,
                        type: 'error',
                        close: function(){window.location.reload();}
                    });
                });
        
        //selecciona la subcategoria
        $scope.subcategoria = null;
        
        $scope.escogerSubcategoria = function(subcategoria){
            $scope.subcategoria = subcategoria;
        };
        
        //actualiza el carousel
        $scope.actualizarCarousel=ActualizarService.actualizarCarousel;
        
        //obtiene el numero total de productos
        $scope.numero_productos = CarritoService.getNumeroProductos();
        
    }])
    
    //CONTROLADOR DE LAS CATEGORIAS
    .controller('CategoriaController',['$scope','$http','$routeParams','DatosService',function($scope,$http,$routeParams,DatosService){
        
        //obtiene las categorias
        $scope.url_categoria = $routeParams.idCategoria;
        $http.get('/api/categorias/')
                .success(function(data){
                    $scope.categorias = data;
                    $scope.escogerCategoria($scope.url_categoria);
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'No se pudieron cargar las categorias, recarga la página',
                        sticky: true,
                        type: 'error',
                        close: function(){window.location.reload();}
                    });
                });
        
        //selecciona la categoria
        $scope.categoria = null;
        $scope.categoria_seleccionada = DatosService.getCategoriaSeleccionada();
        
        $scope.escogerCategoria = function(categoria){
            for(var i = 0; i < $scope.categorias.length ;i++){
                if($scope.categorias[i].nombre === categoria){
                    $scope.categoria = $scope.categorias[i];
                    $scope.categoria_seleccionada.categoria = $scope.categorias[i].nombre;
                };
            };
        };
        
        $scope.$watch('url_categoria',function(newVal,oldVal){
            if(newVal != oldVal){
                $scope.categoriaActual($scope.url_categoria);
            }
        }); 
        
    }])
    
    //CONTROLADOR DE LOS PRODUCTOS
    .controller('ProductosController',['$scope','$http','CarritoService','ActualizarService','DatosService','$timeout',function($scope,$http,CarritoService,ActualizarService,DatosService,$timeout){
        
        //variable con la categoria anterior
        $scope.categoria_seleccionada = DatosService.getCategoriaSeleccionada();
        
        //obtiene los productos
        $scope.productos = DatosService.getProductos();
        
        try{
            var carritoVacio_SS=JSON.parse(sessionStorage['carritoVacio_SS']);
            if(!carritoVacio_SS){
                $scope.datos_orden=DatosService.getDatosOrden();
                $http.get('/api/productos/?licorera='+$scope.datos_orden.licorera+'&borrados=3&disponibles=2')
                    .success(function(data){
                        $scope.productos.items = data;
                    }).error(function(error){
                        $().toastmessage('showErrorToast', 'No se pudieron cargar los licores, porfavor recarga la página');
                });
            }
        }catch (err) {
            console.error("Error parsing stored data: " + err);
        }
        
                
        //actualiza los productos
        $scope.cargar_contenido = ActualizarService.getContenido();
        
        //configuracion carousel
        $scope.slickConfig={
            enabled:true,
            autoPlay: true,
            draggable: false,
            autoplaySpeed: 3000,
            dots:true,
            mobileFirst:true,
            infinite:true,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                  breakpoint: 1800,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                  }
                },
                {
                  breakpoint: 1350,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                  }
                },
                {
                  breakpoint: 985,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                  }
                },
                {
                  breakpoint: 1,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                },
              ]
        }; 
        
        //cantidad de cada producto
        $scope.cantidad_producto = 1;
        
        //añade el producto al carrito
        $scope.anadirProducto = function(producto,cantidad){
            CarritoService.anadirProducto(producto,cantidad);
        };
        
        //calcula el valor total de la compra
        $scope.calcularTotalCompra = function(){
            CarritoService.calcularTotalCompra();
        };
        
        //calcula el numero total de productos
        $scope.calcularNumeroProductos = function(){
            CarritoService.calcularNumeroProductos();
        }
        
    }])
    
    
    //CONTROLADOR DEL CARRITO
    .controller('CarritoController',['$scope','$http','CarritoService','DatosService','$location',function($scope,$http,CarritoService,DatosService,$location){
        
        //obtiene el array de productos en el pedido
        $scope.productos_pedido = CarritoService.getProductosPedido();
        
        //obtiene el array definitivo de los productos
        $scope.arreglo_post_productos = CarritoService.getArregloPostProductos();
        
        //obtiene los datos de la transaccion para analytics
        $scope.datos_transaccion_analytics = DatosService.getDatosTransaccionAnalytics();
        
        //obtiene el array de productos para analytics
        $scope.productos_analytics = CarritoService.getProductosAnalytics();
        
        //obtiene los datos de la orden
        $scope.datos_orden = DatosService.getDatosOrden();
        $scope.datos_orden.pedido = $scope.arreglo_post_productos;
        $scope.id_usuario_licorera =  DatosService.getIdUsuarioLicorera();
        
        
        //elimina un producto del carrito
        $scope.eliminarProducto = function(index){
            $scope.productos_pedido.splice(index,1);
            $scope.arreglo_post_productos.splice(index,1);
            $scope.productos_analytics.splice(index,1);
        };
        
        //suma uno en la cantidad de productos
        $scope.sumarCantidadProducto = function(index){
            $scope.nuevo_producto = [$scope.productos_pedido[index][0],$scope.productos_pedido[index][1]+1];
            $scope.producto_orden = [$scope.arreglo_post_productos[index][0],$scope.arreglo_post_productos[index][1]+1];
            $scope.productos_pedido[index] = $scope.nuevo_producto;
            $scope.arreglo_post_productos[index] = $scope.producto_orden;
            //$scope.productos_analytics[index].quantity += 1;
        };
        
        //resta uno en la cantidad de productos
        $scope.restarCantidadProducto = function(index){
            $scope.nuevo_producto = [$scope.productos_pedido[index][0],$scope.productos_pedido[index][1]-1];
            $scope.producto_orden = [$scope.arreglo_post_productos[index][0],$scope.arreglo_post_productos[index][1]-1];
            $scope.productos_pedido[index] = $scope.nuevo_producto;
            $scope.arreglo_post_productos[index] = $scope.producto_orden;
            //$scope.productos_analytics[index].quantity -= 1;
        };
        
        //obtiene el valor total de la compra
        $scope.valor_total_compra = CarritoService.getValorTotalCompra();
        console.log("valor total compra "+$scope.valor_total_compra.total);
        
        //calcula el valor total de la compra
        $scope.calcularTotalCompra = function(){
            CarritoService.calcularTotalCompra();
            $scope.datos_orden.subtotal = $scope.valor_total_compra.total;
        };
        
        //obtiene el numero total de productos
        $scope.numero_productos = CarritoService.getNumeroProductos();
        
        //calcula el numero total de producto
        $scope.calcularNumeroProductos = function(){
            CarritoService.calcularNumeroProductos();
        }
        
        //calcula el total del pedido
        $scope.calcularDatosOrden = function(){
            $scope.calcularTotalCompra();
            if($scope.cupon.activo == true){
                $scope.datos_orden.descuento = $scope.cupon.cupon[0].descuento;
                $scope.datos_orden.total_compra = $scope.valor_total_compra.condescuento;
                $scope.datos_orden.total_compra += $scope.id_usuario_licorera.costoenvio;
            } else {
                $scope.datos_orden.descuento = 0;
                $scope.datos_orden.total_compra = $scope.valor_total_compra.total;
                $scope.datos_orden.total_compra += $scope.id_usuario_licorera.costoenvio;
            };
            $scope.datos_transaccion_analytics.revenue = $scope.datos_orden.total_compra;
            $scope.datos_transaccion_analytics.shipping = $scope.id_usuario_licorera.costoenvio;
        };
        
        //mantiene las variables actualizadas
        $scope.datos = function(){
            $scope.productos_pedido = CarritoService.getProductosPedido();
            $scope.arreglo_post_productos = CarritoService.getArregloPostProductos();
            $scope.productos_analytics = CarritoService.getProductosAnalytics();
            $scope.datos_orden = DatosService.getDatosOrden();
            $scope.datos_orden.pedido = $scope.arreglo_post_productos;
            $scope.valor_total_compra = CarritoService.getValorTotalCompra();
            $scope.numero_productos = CarritoService.getNumeroProductos();
            $scope.cupon = CarritoService.getCupon();
        };
        $scope.$watch($scope.datos);
        
        //actualiza el valor del descuento
        $scope.$watch('valor_total_compra.total',function(nuevo,viejo){
            if(nuevo != viejo){
                if($scope.cupon.activo){
                    $scope.valor_total_compra.condescuento = $scope.valor_total_compra.total*((100-$scope.cupon.cupon[0].descuento)/100);
                }
            }
        });
        
        //registra la compra en facebook
        $scope.compraRealizadaFacebook = function(valor){
            $scope.compra_facebook =  (valor - $scope.id_usuario_licorera.costoenvio)*0.10;
            fbq('track', 'Purchase', {value: $scope.compra_facebook, currency: 'COP'});
        };
        
        //envia la orden realizada
        $scope.enviarOrden = function(){
            
            //obtiene la fecha y hora actuales
            $http.get('/datetime/')
                .success(function(data){
                    $scope.datos_orden.horallegada = data.hora;
                    $http.post('/registrarorden/',$scope.datos_orden).
                        success(function(data){
                            $scope.datos_transaccion_analytics.id = data.id;
                            ga('ecommerce:addTransaction',$scope.datos_transaccion_analytics);
                            for(var i = 0; i < $scope.productos_analytics.length; i++){
                                $scope.productos_analytics[i].id = data.id;
                                ga('ecommerce:addItem',$scope.productos_analytics[i]);
                                if(i == $scope.productos_analytics.length-1){
                                    ga('ecommerce:send');
                                }
                            };
                            $location.path('enviado');
                            $().toastmessage('showSuccessToast', 'Tu pedido se ha enviado correctamente');
                            if($scope.cupon.activo === true){
                                $scope.cambiar_estado_cupon = {
                                    'activo':false
                                };
                                $http.put('/api/cambiarestadodescuento/'+$scope.cupon.descuento[0].id+'/',$scope.cambiar_estado_cupon).
                                success(function(data){
                                    $scope.reiniciarValores();
                                });
                            } else {
                                $scope.reiniciarValores();
                            }
                            sessionStorage.clear();
                            //envia la notificacion a la licorera
                            $http.get('/alert/?user='+$scope.id_usuario_licorera.id)
                                .success(function(data){
                                }); 
                        }).error(function(error){
                            $().toastmessage('showToast', {
                                text: 'No se ha enviado tu pedido, prueba nuevamente',
                                sticky: true,
                                type: 'error'
                            });
                        });
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'No se ha enviado tu pedido, prueba nuevamente',
                        sticky: true,
                        type: 'error'
                    });
                });       
        };
        
        //recarga la página
        $scope.recargarPagina = function(){
            window.location.reload();
        };
        
        //cupon activo
        $scope.cupon = CarritoService.getCupon();
        
        //obtiene el cupon
        $scope.getCupon =  function(){
            if($scope.datos_orden.cliente!='null'){  
                $http.get('/api/cupon/?serie='+$scope.cupon.serie)
                    .success(function(data){
                        $scope.cupon.cupon = data;
                        //confirmar relacion-cliente-cupon
                        if($scope.cupon.cupon.length != 0){
                            $http.get('/api/aplicardescuento/?pk_cliente='+$scope.datos_orden.cliente+'&pk_cupon='+$scope.cupon.cupon[0].id)
                                .success(function(data){
                                    $scope.cupon.descuento = data;
                                    if($scope.cupon.descuento.length != 0){
                                        if($scope.cupon.descuento[0].activo == true){
                                            $scope.cupon.activo = true;
                                            $scope.valor_total_compra.condescuento = $scope.valor_total_compra.total*((100-$scope.cupon.cupon[0].descuento)/100);
                                            $().toastmessage('showSuccessToast', 'Cupon activado');
                                        } else {
                                            $scope.cupon.activo = false;
                                            $().toastmessage('showNoticeToast', 'El cupon ya fue utilizado');
                                        }
                                    }else{
                                        $().toastmessage('showWarningToast', 'No tienes permitido usar este cupon. Lo sentimos :(');
                                    }                            
                                });
                        } else {
                            $().toastmessage('showErrorToast', 'Este cupon no existe verifica el código');
                        };
                    }).error(function(data){

                    });
            }else{
                $().toastmessage('showErrorToast', 'Debes iniciar sesión para poder usar un cupón');
            }
        };

        //reinicia los valores del carrito y de los datos de la compra
        $scope.reiniciarValores = function(){
            DatosService.reiniciarValores();
            CarritoService.reiniciarValores();
        }
        
    }]);
    
})();