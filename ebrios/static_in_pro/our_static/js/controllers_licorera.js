(function () {
    angular.module('licorera.controllers', [])
    
    
    .controller('InterfazLicoreraController',['$http','$scope','ngAudio',function($http,$scope,ngAudio){
        
        //SECCIÓN PARA OBTENER TODOS LOS DATOS PARA LA LICORERA
        
        //obtiene el usuario registrado
        $http.get('/obtenerlicoreraautenticada/')
                .success(function(data){
                    $scope.usuario_registrado = data;
                    //obtiene el id de la licorera autenticada
                    $http.get('/api/licoreras/?pk_usuario='+$scope.usuario_registrado.id)
                        .success(function(data){
                            $scope.licorera_registrada = data;
                            //obtiene las zonas
                            $http.get('/api/zonas/?licorera='+$scope.licorera_registrada[0].id)
                                .success(function(data){
                                    $scope.zonas = data;
                                    $scope.cambiarEstadoZonasAbrir();
                                }).error(function(error){
                                    $().toastmessage('showToast', {
                                        text: 'Error (ZONAS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                                        sticky: true,
                                        type: 'error',
                                        close: function(){$scope.obtenerZonas();}
                                    });
                                });
                        }).error(function(error){
                            $().toastmessage('showToast', {
                                text: 'Error (AUTLIC). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                                sticky: true,
                                type: 'error',
                                close: function(){location.reload();}
                            });
                        });
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (AUTUS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){location.reload();}
                    });
                });
        
        //FUNCIONES PARA OBTENER LOS DATOS POR SEPARADO
        
         //función para obtener las ordenes
        $scope.obtenerOrdenes = function(){
            $http.get('/api/ordenes/?pk_cliente=&pk_licorera='+$scope.licorera_registrada[0].id)
                .success(function(data){
                    $scope.ordenes = data;
                    $scope.obtenerOrdenesEnviadas();
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (ORDENES). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerOrdenes();}
                    });
                });
        };
        
        //función para obtener los productos
        $scope.obtenerProductos = function(){
            $http.get('/api/productoslicorera/?licorera='+$scope.licorera_registrada[0].id+'&borrados=3')
                .success(function(data){
                    $scope.productos = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (PRODCUTOS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerProductos();}
                    });
                });
        };
        
        //función para obtener las categorias
        $scope.obtenerCategorias = function(){
            $http.get('/api/categorias/')
                .success(function(data){
                    $scope.categorias = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (CATEGORIAS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerCategorias();}
                    });
                });
        };
        
        //funcion para obtener las subcategorias
        $scope.obtenerSubcategorias = function(){
            $http.get('/api/subcategorias/')
                .success(function(data){
                    $scope.subcategorias = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (SUBCATEGORIAS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerSubcategorias();}
                    });
                });
        };
        
        //función para obtener todas las marcas
        $scope.obtenerMarcas = function(){
            $http.get('/api/marcas/')
                .success(function(data){
                    $scope.marcas = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (MARCAS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerMarcas();}
                    });
                });
        };
        
        //funcion para obtener los tamaños
        $scope.obtenerTamanos = function(){
            $http.get('/api/tamano/')
                .success(function(data){
                    $scope.tamanos = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (TAMAÑOS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerTamanos();}
                    });
                });
        };
        
        //función para obtener los reportes
        $scope.obtenerReportes = function(){
            $http.get('/api/rechazos/')
                .success(function(data){
                    $scope.reportes = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (REPORTES). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerReportes();}
                    });
                });
        };
        
        //función para obtener las zonas
        $scope.obtenerZonas = function(){
            $http.get('/api/zonas/?licorera='+$scope.licorera_registrada[0].id)
                .success(function(data){
                    $scope.zonas = data;
                }).error(function(error){
                    $().toastmessage('showToast', {
                        text: 'Error (ZONAS). Cierre la notificación para solucionar el problema. Si el error persiste contacte a su asesor.',
                        sticky: true,
                        type: 'error',
                        close: function(){$scope.obtenerZonas();}
                    });
                });
        };
        
        //funcion para cargar la seccion de catalogo
        $scope.obtenerDatosCatalogo = function(){
            $scope.obtenerProductos();
            $scope.obtenerCategorias();
            $scope.obtenerSubcategorias();
            $scope.obtenerMarcas();
            $scope.obtenerTamanos();
        };
        
        //funcion para cargar categorias subcategorias marcas y tamaños
        $scope.obtenerDatosAnadirProducto = function(){
            $scope.obtenerCategorias();
            $scope.obtenerSubcategorias();
            $scope.obtenerMarcas();
            $scope.obtenerTamanos();
        };
        
        //funcion para cargar ordenes y reportes
        $scope.obtenerDatosHistorial = function(){
            $scope.obtenerOrdenes();
            $scope.obtenerReportes();
        };
        
        //SECCIÓN DE ORDENES E HISTORIAL
        
        //obtiene el numero de ordenes con estado true
        $scope.obtenerOrdenesEnviadas = function(){
            $scope.ordenes_enviadas = [];
            for(var i = 0; i < $scope.ordenes.length;i++){
                if($scope.ordenes[i].estado === true){
                    $scope.ordenes_enviadas.push($scope.ordenes[i]);
                }
            }
        };
        
        //función para cambiar el estado de una orden
        $scope.cambiarEstadoOrden = function (id) {
            
            $http.get('/datetime/')
                .success(function(data){
                    $scope.nuevo_estado_orden = {
                        "id": id,
                        "fechaenvio": data.fecha,
                        "horaenvio": data.hora,
                        "estado": true
                    };
                    $http.put('/api/actualizarorden/'+id+'/',$scope.nuevo_estado_orden).
                        success(function(data){
                            $().toastmessage('showSuccessToast', 'se ha marcado la orden '+id+' como despachada');
                            $scope.obtenerOrdenes();
                        }).error(function(error){
                            $().toastmessage('showErrorToast', "no se pudo cambiar el estado de la orden.");
                        });
                }).error(function(error){
                    $().toastmessage('showErrorToast', "no se pudo cambiar el estado de la orden.");
                });
        };
        
         //funcion para obtener la orden de historial
        $scope.obtenerDatosOrdenHistorial = function(orden){
            $scope.orden_historial = orden;
        };
        
        //funcion para generar un reporte
        $scope.reporte = {};
        $scope.reporte.descripcion = "";
        $scope.reporte.fecha = "";
        $scope.reporte.hora = "";
        
        //funcion para generar el post del reporte
        $scope.generarReporte = function(){
            
            $scope.motivo = $scope.reporte.descripcion;
            $http.get('/datetime/')
                .success(function(data){
                    $scope.descipcion_reporte = {
                        "motivo": $scope.motivo,
                        "fechareporte": data.fecha,
                        "horareporte": data.hora
                    };
                    $http.post('/api/rechazos/',$scope.descipcion_reporte)
                        .success(function(data){
                            $().toastmessage('showSuccessToast', "se genero correctamente el reporte");
                            $scope.objeto_reporte = {
                                "id": $scope.id_orden_reportada,
                                "rechazado": data.id
                            };
                            $scope.obtenerReportes();
                            //asocia el reporte a la orden que la genero
                            $http.put('/api/ordenrechazada/'+$scope.orden_historial.id+'/',$scope.objeto_reporte)
                                    .success(function(data){
                                        $scope.obtenerOrdenes();
                                    }).error(function(error){
                                        $().toastmessage('showWarningToast', "Error en actualización reporte, comunicate con tu asesor");
                                    });

                        }).error(function(error){
                            $().toastmessage('showErrorToast', "no se pudo generar el reporte");
                        });
                }).error(function(error){
                    
                });        
        };
        
        //reinicia la descripcion del reporte
        $scope.reiniciarDescripcionReporte = function(){
            $scope.reporte.descripcion = "";
            $scope.reporte.fecha = "";
            $scope.reporte.hora = "";
        };
        
        //compara si la orden ya tiene reporte y bloquea el boton en caso de que si tenga
        $scope.obtenerDescripcionReporte = function(orden){
            if(orden.rechazado === null){
                $scope.reporte.descripcion = "";
                $scope.reporte.fecha = "";
                $scope.reporte.hora = "";
            } else {
                for(var i = 0; i < $scope.reportes.length; i++){
                    if(orden.rechazado === $scope.reportes[i].id){
                        $scope.reporte.descripcion = $scope.reportes[i].motivo;
                        $scope.reporte.fecha = $scope.reportes[i].fechareporte;
                        $scope.reporte.hora = $scope.reportes[i].horareporte;
                    }
                }
            }
        };
        
        //SECCIÓN DE CATALOGO
        
        //funcion para reestablecer los valores del filtrado en catalogo
        $scope.opciones_filtrado_producto = {};
        $scope.opciones_filtrado_producto.categoria = null;
        $scope.opciones_filtrado_producto.subcategoria = null;
        $scope.opciones_filtrado_producto.marca = null;
        
        //funcion para llenar los tamanos disponibles
        $scope.llenarTamanosDisponibles = function(marca){
            $scope.tamanos_disponibles = [];
            for(var i = 0;i < marca.tamano.length;i++){
                $scope.id_tamano = marca.tamano[i];
                for(var y = 0;y < $scope.tamanos.length;y++){
                    if($scope.id_tamano === $scope.tamanos[y].id){
                        $scope.tamanos_disponibles.push($scope.tamanos[y]);
                    }
                }
            }
        };
        
        //funcion para obtener el producto para modificar
        $scope.obtenerDatosProductoModificar = function(producto){
            $scope.producto_modificar = producto;
            $scope.producto_nuevo.referencia = producto.referencia;
            $scope.producto_nuevo.precio = Number(producto.precio);
            for(var i=0;i<$scope.categorias.length;i++){
                if (producto.categoria.id === $scope.categorias[i].id){
                    $scope.producto_nuevo.categoria = $scope.categorias[i];
                }
            }
            for(var i=0;i<$scope.subcategorias.length;i++){
                if (producto.subcategoria.id === $scope.subcategorias[i].id){
                    $scope.producto_nuevo.subcategoria = $scope.subcategorias[i];
                }
            }
            for(var i=0;i<$scope.tamanos.length;i++){
                if (producto.tamano.id === $scope.tamanos[i].id){
                    $scope.producto_nuevo.tamano = $scope.tamanos[i];
                }
            }
            for(var i=0;i<$scope.marcas.length;i++){
                if (producto.marca.id === $scope.marcas[i].id){
                    $scope.producto_nuevo.marca = $scope.marcas[i];
                    $scope.llenarTamanosDisponibles($scope.producto_nuevo.marca);
                }
            }
        };
        
        //funcion para comparar si el producto a modificar ha sido modificado y borrarlo o notificar
        $scope.validarIgualdadProductos = function(){
            if($scope.producto_nuevo.referencia === $scope.producto_modificar.referencia && $scope.producto_nuevo.categoria.id === $scope.producto_modificar.categoria.id && $scope.producto_nuevo.subcategoria.id === $scope.producto_modificar.subcategoria.id && $scope.producto_nuevo.marca.id === $scope.producto_modificar.marca.id && $scope.producto_nuevo.tamano.id === $scope.producto_modificar.tamano.id && $scope.producto_nuevo.precio == $scope.producto_modificar.precio){
                
                $().toastmessage('showWarningToast', "no se hicieron modificaciones");
                
            } else {
                
                $scope.imagen.marca = $scope.producto_nuevo.marca.nombre.replace(/\s/g,"").toLowerCase();
                $scope.imagen.tamano = $scope.producto_nuevo.tamano.nombre.replace(/\s/g,"").toLowerCase();
                $scope.imagen.nombre = $scope.imagen.marca+$scope.imagen.tamano;
                
                if($scope.producto_nuevo.marca.imagen === false){
                    $scope.producto_nuevo.imagen = "";
                } else {
                    $scope.producto_nuevo.imagen = "https://ebriostatic.s3.amazonaws.com/media/producto/"+$scope.imagen.nombre+".png";    
                }
                
                $scope.nuevo_producto_modificado = {
                    "precio": $scope.producto_nuevo.precio,
                    "referencia": $scope.producto_nuevo.referencia,
                    "disponible": true,
                    "borrado": false,
                    "imagen": $scope.producto_nuevo.imagen,
                    "licorera": $scope.licorera_registrada[0].id,
                    "categoria": $scope.producto_nuevo.categoria.id,
                    "tamano": $scope.producto_nuevo.tamano.id,
                    "subcategoria": $scope.producto_nuevo.subcategoria.id,
                    "marca": $scope.producto_nuevo.marca.id
                };
                
                $scope.nuevo_estado_producto = {
                    "id": $scope.producto_modificar.id,
                    "disponible": false
                };
                
                $scope.producto_borrado = {
                    "id": $scope.producto_modificar.id,
                    "borrado": true
                };
                
                //agrega el nuevo producto
                $http.post('/api/agregarproducto/',$scope.nuevo_producto_modificado)
                .success(function(data){
                    $().toastmessage('showSuccessToast', "se modifico correctamente el producto");
                    //marca como borrado el producto
                    $http.put('/api/borrarproducto/'+$scope.producto_modificar.id+'/', $scope.producto_borrado)
                        .success(function(data){
                            $scope.obtenerProductos();
                            // cambia el estado del producto a no disponible
                            $http.put('/api/cambiarestadoproducto/'+$scope.producto_modificar.id+'/',$scope.nuevo_estado_producto)
                                .success(function(data){
                                    $scope.obtenerProductos();
                                }).error(function(error){
                                    $().toastmessage('showWarningToast', "Error en actualización estado, comunicate con tu asesor");
                                    $scope.obtenerProductos();
                                });
                        }).error(function(error){
                            $().toastmessage('showWarningToast', "Error en actualización borrado, comunicate con tu asesor"); 
                            $scope.obtenerProductos();
                        });
                }).error(function(error){
                    $().toastmessage('showErrorToast', "no se modifico el producto");
                });
            }
        };
        
        //funcion para cambiar el estado de un producto
        $scope.cambiarEstadoProducto = function(id,estado_actual) {
            $scope.nuevo_estado_producto = {
                "id": id,
                "disponible": !estado_actual
            };
            $http.put('/api/cambiarestadoproducto/'+id+'/',$scope.nuevo_estado_producto).
                success(function(data){
                    if(estado_actual === true){
                        $().toastmessage('showSuccessToast', "su producto se ha marcado como NO DISPONIBLE");
                    } else {
                        $().toastmessage('showSuccessToast', "su producto se ha marcado como DISPONIBLE");
                    }
                    $scope.obtenerProductos();
                }).error(function(error){
                    $().toastmessage('showErrorToast', "no se pudo modificar el estado del producto");
                });
        };
        
        //SECCION DE ANADIR PRODUCTO
        
        //función para vista previa imagenes
        $scope.vista_previa = {};
        $scope.vista_previa.validacion = false;
        $scope.vista_previa.marca = "";
        $scope.vista_previa.tamano = "";
        $scope.vista_previa.url = "";
        
        $scope.vistaPreviaImagen = function(){
            $scope.vista_previa.validacion = $scope.producto_nuevo.marca.imagen;
            $scope.vista_previa.marca = $scope.producto_nuevo.marca.nombre.replace(/\s/g,"").toLowerCase();
            $scope.vista_previa.tamano = $scope.producto_nuevo.tamano.nombre.replace(/\s/g,"").toLowerCase();
            $scope.vista_previa.url = "https://ebriostatic.s3.amazonaws.com/media/producto/"+$scope.vista_previa.marca+$scope.vista_previa.tamano+".png";
        };
        
        //funcion para agregar un nuevo producto
        $scope.producto_nuevo = {};
        $scope.producto_nuevo.precio = "";
        $scope.producto_nuevo.referencia = "";
        $scope.producto_nuevo.imagen = "";
        $scope.producto_nuevo.categoria = null;
        $scope.producto_nuevo.tamano = null;
        $scope.producto_nuevo.subcategoria = null;
        $scope.producto_nuevo.marca = null;
        
        $scope.imagen = {};
        $scope.imagen.marca = "";
        $scope.imagen.tamano = "";
        $scope.imagen.nombre = "";
        
        $scope.agregarProducto = function() {
            
            $scope.imagen.marca = $scope.producto_nuevo.marca.nombre.replace(/\s/g,"").toLowerCase();
            $scope.imagen.tamano = $scope.producto_nuevo.tamano.nombre.replace(/\s/g,"").toLowerCase();
            $scope.imagen.nombre = $scope.imagen.marca+$scope.imagen.tamano;
            
            if($scope.producto_nuevo.marca.imagen === false){
                $scope.producto_nuevo.imagen = "";
            } else {
                $scope.producto_nuevo.imagen = "https://ebriostatic.s3.amazonaws.com/media/producto/"+$scope.imagen.nombre+".png";    
            }
            
            $scope.nuevo_producto = {
                "precio": $scope.producto_nuevo.precio,
                "referencia": $scope.producto_nuevo.referencia,
                "disponible": true,
                "borrado": false,
                "imagen": $scope.producto_nuevo.imagen,
                "licorera": $scope.licorera_registrada[0].id,
                "categoria": $scope.producto_nuevo.categoria.id,
                "tamano": $scope.producto_nuevo.tamano.id,
                "subcategoria": $scope.producto_nuevo.subcategoria.id,
                "marca": $scope.producto_nuevo.marca.id
            };
            $http.post('/api/agregarproducto/',$scope.nuevo_producto).
                success(function(data){
                    $().toastmessage('showSuccessToast', "se agrego el producto correctamente");
                    $scope.obtenerProductos();
                }).error(function(error){
                    $().toastmessage('showErrorToast', "no se pudo agregar el producto.");
                });
        };
        
        //funcion para reiniciar los valores del formulario agregar producto
        $scope.reestablecerFormularioAgregarProducto = function(){
            $scope.producto_nuevo.precio = "";
            $scope.producto_nuevo.referencia = "";
            $scope.producto_nuevo.categoria = null;
            $scope.producto_nuevo.tamano = null;
            $scope.producto_nuevo.subcategoria = null;
            $scope.producto_nuevo.marca = null;
            $scope.vista_previa.validacion = false;
            $scope.vista_previa.marca = "";
            $scope.vista_previa.tamano = "";
            $scope.vista_previa.url = "";
        };
        
        //funcion para obtener los tamanos disponibles 
        $scope.tamanos_disponibles = [];
        
        $scope.obtenerTamanosDisponibles = function(){
            $scope.tamanos_disponibles = [];
            for(var i = 0;i < $scope.producto_nuevo.marca.tamano.length;i++){
                $scope.id_tamano = $scope.producto_nuevo.marca.tamano[i];
                for(var y = 0;y < $scope.tamanos.length;y++){
                    if($scope.id_tamano === $scope.tamanos[y].id){
                        $scope.tamanos_disponibles.push($scope.tamanos[y]);
                    }
                }
            }
        };
        
        $scope.reiniciarValorTamanoDisponible = function(){
            $scope.producto_nuevo.tamano = null;
        };
        
        $scope.reiniciarTamanosDisponibles = function(){
            $scope.tamanos_disponibles = [];
        };
        
        $scope.reiniciarValorMarca = function(){
            $scope.producto_nuevo.marca = null;
            $scope.producto_nuevo.tamano = null;
        };
        
        //SECCION DE ADMINISTRAR ZONAS
        
        //funcion para cambiar el estado de una zona
        $scope.cambiarEstadoZonas = function(){
            
            for(var i =0; i < $scope.zonas.length;i++){
                $scope.nuevo_estado_zona = {
                    "id": $scope.zonas[i].id,
                    "disponible": !$scope.zonas[i].disponible
                };
                $scope.zona_actual = $scope.zonas[i];
                $scope.contador = 0;
                $http.put('/api/cambiarestadozona/'+$scope.zona_actual.id+'/',$scope.nuevo_estado_zona).
                success(function(data){
                    if($scope.contador < 1){
                        if($scope.zona_actual.disponible === true){
                            $().toastmessage('showSuccessToast', "se ha(n) marcado la(s) zona(s) como NO DISPONIBLE(S)");
                        } else {
                            $().toastmessage('showSuccessToast', "se ha(n) marcado la(s) zona(s) como DISPONIBLE(S)");
                        }
                    };
                    $scope.contador++;
                    $scope.obtenerZonas();
                }).error(function(error){
                    $().toastmessage('showErrorToast', "no se pudo modificar el estado de las zonas.");
                });
            };
            
        };
        
        $scope.cambiarEstadoZonasCerrar = function(){
            
            
            if($scope.zonas.length === 0){
                 window.location.href = '/accounts/logout/';
            } else {
                $scope.contador_cerrar = 0;
         
                for(var i =0; i < $scope.zonas.length; i++){
                    $scope.nuevo_estado_zona = {
                        "id": $scope.zonas[i].id,
                        "disponible": false
                    };
                    $scope.zona_actual = $scope.zonas[i];
                    $http.put('/api/cambiarestadozona/'+$scope.zona_actual.id+'/',$scope.nuevo_estado_zona).
                        success(function(data){
                            $scope.contador_cerrar =  $scope.contador_cerrar+1;
                            if($scope.contador_cerrar === $scope.zonas.length){
                                window.location.href = '/accounts/logout/';
                            };
                        }).error(function(error){
                            $().toastmessage('showErrorToast', "no se pudo modificar el estado de las zonas.");
                        });
                };
            }
            
        };
        
        $scope.cambiarEstadoZonasAbrir = function(){
            
            for(var i =0; i < $scope.zonas.length;i++){
                $scope.nuevo_estado_zona = {
                    "id": $scope.zonas[i].id,
                    "disponible": true 
                };
                $scope.zona_actual = $scope.zonas[i];
                $http.put('/api/cambiarestadozona/'+$scope.zona_actual.id+'/',$scope.nuevo_estado_zona).
                success(function(data){
                    $scope.obtenerZonas();
                }).error(function(error){
                    $().toastmessage('showErrorToast', "no se pudo modificar el estado de las zonas.");
                });
            };
            
            $().toastmessage('showSuccessToast', "se ha(n) marcado la(s) zona(s) como DISPONIBLE(S)");
        };
        
        //SECCION DE ACTUALIZACION VIA SOCKETS
        
        $scope.numero_notificaciones = 0;
        $scope.sonido_notificacion = ngAudio.load('https://ebriostatic.s3.amazonaws.com/media/producto/notificacion.mp3');
        $scope.sonido_notificacion.loop = true;
        
        $scope.reproducir = function(){
            $scope.numero_notificaciones += 1;
            $scope.sonido_notificacion.play();
        };
        
        $scope.parar = function(){
            $scope.numero_notificaciones -= 1;
            if($scope.numero_notificaciones == 0){
                $scope.sonido_notificacion.pause();
            }
        };
        
        ishout.on('alertchannel', function(data){
            
            $scope.reproducir();
            $().toastmessage('showToast', {
                text: 'TIENES UNA NUEVA ORDEN',
                sticky: true,
                type: 'success',
                close: function(){$scope.parar();}
            });
            $scope.obtenerOrdenes();

        });
        ishout.init();
        
        //SECCION DE POP UPS
        
        //funciones para abrir pop ups
        $scope.valor_modal_historial = false;
        $scope.abrirCerrarModalHistorial = function(valor){
            $scope.valor_modal_historial = valor;    
        };
        
        $scope.valor_modal_modificar = false;
        $scope.abrirCerrarModalModificar = function(valor){
            $scope.valor_modal_modificar = valor;    
        };
        
        $scope.valor_modal_reportar = false;
        $scope.abrirCerrarModalReportar = function(valor){
            $scope.valor_modal_reportar = valor;    
        };
                                              
    }])
    
    //controla el click en el nav
    .controller('NavController',['$scope',function($scope){
        $scope.nav = 0;
        
        $scope.selectNav = function(nav){
            $scope.nav = nav;
        };
    }])
    
    //controla el click en los tabs
    .controller('TabsController',['$scope',function($scope) {
        $scope.tab = 1;

        $scope.selectTab = function (tab) {
            $scope.tab = tab;
        };
    }])
    
    //controlador de la sección de historial
    .controller('HistorialController',['$scope',function($scope){
        
        //maneja el filtrado del historial
        $scope.opciones_filtrado = [
            {id:1, nombre:'número de orden'},
            {id:2, nombre:'fecha llegada'},
            {id:3, nombre:'fecha envio'},
            {id:4, nombre:'precio'},
            {id:5, nombre:'cliente'}
        ];
        $scope.opcion_filtrado_seleccionada = $scope.opciones_filtrado[0];
        
    }])
    
    //controlador de la sección de catalogo de productos
    .controller('ProductosController',['$scope',function($scope){
        
        //maneja el filtrado del catalogo de productos
        $scope.opciones_filtrado = [
            {id:1, nombre:'categoria'},
            {id:2, nombre:'subcategoria'},
            {id:3, nombre:'marca'}
        ];
        $scope.opcion_filtrado_seleccionada = $scope.opciones_filtrado[0];
        
    }]);
    
})();