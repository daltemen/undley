(function(){
    angular.module('movil.services',[])
    
    .factory('NavegacionService',['$timeout',function($timeout){
        var navegacion={};
        navegacion.categoria="";
        navegacion.subcategoria="";        
        
        
        function getNavegacion(){
            return navegacion;
        }
        
        var animacion_carrito = {};
        animacion_carrito.animar = false;
         
        function animarCarrito(){
            animacion_carrito.animar=true;
            $timeout(function(){
                animacion_carrito.animar=false;
            },2000);
        };
         
        function getAnimacionCarrito(){
            return animacion_carrito;
        };
        
        return{
            getNavegacion:getNavegacion,
            getAnimacionCarrito:getAnimacionCarrito,
            animarCarrito:animarCarrito
        };
    }])
    
    .factory('DatosExternosService',['$resource',function($resource){        
        var licorera={};
        licorera.id=0;
        licorera.usuario="";
        licorera.disponible=false;
        licorera.montoMinimo=0;
        licorera.costoEnvio=0;
        licorera.pagoEfectivo=false;
        licorera.pagoTarjeta=false;
        
        var cliente={};
        cliente.id=0;
        cliente.nombre="";
        
        function getLicorera(){
            return licorera;
        }
        
        function getCliente(){
            return cliente;
        }
        
        function horaActual(){
            return $resource('/datetime/');
        }
        
        function clienteAutenticado(){
            return $resource('/obtenerclienteautenticado/');
        }
        
        
        return{
            getLicorera:getLicorera,  
            getCliente:getCliente,
            horaActual:horaActual,
            clienteAutenticado:clienteAutenticado,
        };
    }])
    
    .factory('ProductosService',['$resource',function($resource){
        return $resource('/api/productos/',{disponibles:2},{isArray:true}); 
    }])
    
    .factory('CategoriaService',['$resource',function($resource){
        return $resource('/api/',{},{
            categoria:{url:'/api/categorias',method:'GET',isArray:true},
            subcategoria:{url:'/api/subcategorias',method:'GET',isArray:true}
        });
    }])
    
    .factory('CarritoService',function(){        
        
        function producto(id,marca,tamano,cantidad,importe,imagen){
            this.id=id;
            this.marca=marca;
            this.tamano=tamano;
            this.cantidad=cantidad;
            this.precio=importe;
            this.imagen=imagen;
        }

        
        var carrito={};
        carrito.items=[];
        carrito.total=0;
        carrito.descuento=0;
        carrito.idDescuento=0;
        carrito.serie="";
        carrito.cantidadDeItems=0;
        function getCarrito(){
            return carrito;
        }        
        
        function agregarAlCarrito(id,marca,tamano,cantidad,precio,imagen){
            var x=0;
            if(carrito.items.length>0){
                while(x<carrito.items.length){
                    if(carrito.items[x].id===id){
                        carrito.items[x].cantidad=cantidad;
                        calcularTotal();
                        calcularTotalItems();
                        return carrito.items[x];
                    }
                    x++;
                }
                if(x==carrito.items.length){
                    var nuevoProducto=new producto(id,marca,tamano,cantidad,precio,imagen);
                    carrito.items.push(nuevoProducto);                    
                    calcularTotal();
                    calcularTotalItems();
                }
            }else if(x==0){
                var nuevoProducto=new producto(id,marca,tamano,cantidad,precio,imagen);
                carrito.items.push(nuevoProducto);
                calcularTotal();
                calcularTotalItems();
            }           
        }
        
        function calcularTotal(){
            var subtotal;
            carrito.total=0;
            for(var i=0;i<carrito.items.length;i++){
                subtotal=(carrito.items[i].precio)*(carrito.items[i].cantidad);
                carrito.total+=subtotal;
            }
        }
        
        function calcularTotalItems(){
            carrito.cantidadDeItems=0;
            for(var i=0;i<carrito.items.length;i++){
                carrito.cantidadDeItems+=carrito.items[i].cantidad;
            }
        }
        
        function cambioUnitario(factor,id){
            var x=0;
            while(carrito.items[x].id!=id){
                x++;
            }
            if(factor==='menos'){
                carrito.items[x].cantidad-=1;
                calcularTotal();
                calcularTotalItems();
            }
            if(factor==='mas'){
                carrito.items[x].cantidad+=1;
                calcularTotal();
                calcularTotalItems();
            }
        }
        
        function eliminarProducto(id){
            var x=0;
            while(carrito.items[x].id!=id){
                x++;
            };
            carrito.items.splice(x,1);
            calcularTotal();
            calcularTotalItems();
        }
        
        return{
          agregarAlCarrito:agregarAlCarrito,
          getCarrito:getCarrito,  
          cambioUnitario:cambioUnitario,
          eliminarProducto:eliminarProducto,
        };
    })
    
    .factory('CuponService',['$resource',function($resource){
        return $resource('/api/cupon/',{},{
            aplicar:{url:'/api/aplicardescuento/',method:'GET',isArray:true},
            actualizar:{url:'/api/aplicardescuento/:id/',method:'PUT'}
        });
    }])
    
    .factory('OrdenService',['$resource',function($resource){
        var orden={};
        orden.direccion_cliente = ""; 
        orden.telefono_cliente = ""; 
        orden.horallegada = ""; 
        orden.subtotal = "";
        orden.cliente = ""; 
        orden.licorera = ""; 
        orden.pedido = []; 
        orden.observacion = "";
        orden.descuento = "";
        orden.total_compra = "";
        
        var ordenPost=$resource('/registrarorden/',{},{
            post:{url:'/registrarorden/',method:'POST'}
        });
        
        var alertaLicorera=$resource('/alert/',{},{isArray:true});
        
        function getOrden(){
            return orden;
        }
        
        return{
            getOrden:getOrden,
            ordenPost:ordenPost,
            alertaLicorera:alertaLicorera,
        };
    }])
    
    .factory('RegistroService',['$resource',function($resource){
        return $resource('/api/:registro/',{},{
            usuario:{method:'POST',params:{registro:'registrarusuario'}},
            cliente:{method:'POST',params:{registro:'registrarcliente'}}
        });
    }]);
    
    
})();