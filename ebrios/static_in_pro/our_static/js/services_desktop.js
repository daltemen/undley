(function(){
    
    angular.module('ebrios.services',[])
    
    .factory('DatosService',['$http',function($http){
        
        //guarda la categoria seleccionada
        var categoria_seleccionada = {};
        categoria_seleccionada.categoria = "";
        
        //retorna la categoria seleccionada
        function getCategoriaSeleccionada(){
            return categoria_seleccionada;
        }; 
        
        //objeto con los datos necesarios para la orden(cliente,licorera,pedido,direccion)
        var datos_orden = {};
        datos_orden.direccion_cliente = ""; // direccion controller
        datos_orden.telefono_cliente = "";  // carrito controller
        datos_orden.horallegada = "";       // carrito controller
        datos_orden.subtotal = "";          // carrito controller
        datos_orden.cliente = "";           // principal controller
        datos_orden.licorera = "";          // direccion controller
        datos_orden.pedido = [];            // carrito controller
        datos_orden.observacion = "";       // carrito controller
        datos_orden.descuento = "";         // carrito controller
        datos_orden.total_compra = "";      // carrito controller
        
        //retorna los datos de la orden
        function getDatosOrden(){
            return datos_orden;
        };
        
        //contiene el id del usuario de la licorera
        var id_usuario_licorera = {};
        id_usuario_licorera.id = "";
        id_usuario_licorera.disponible = false;
        id_usuario_licorera.montominimo = 30000;
        id_usuario_licorera.costoenvio = 5000;
        id_usuario_licorera.efectivo = false;
        id_usuario_licorera.tarjeta = false;
        
        //retorna el usuario de la licorera
        function getIdUsuarioLicorera(){
            return id_usuario_licorera;
        };
        
        //contiene los datos de la transaccion para analytics
        var datos_transaccion_analytics = {};
        datos_transaccion_analytics.id = "";          // ID de la transaccion que incluye el producto 
        datos_transaccion_analytics.affiliation = ""; // Nombre de la licorera - direccion controller
        datos_transaccion_analytics.revenue = "";     // Total incluido envio - carrito controller
        datos_transaccion_analytics.shipping = "";     // Costo envio - carrito controller
        
        //retorna los datos de la transaccion para analytics
        function getDatosTransaccionAnalytics(){
            return datos_transaccion_analytics;
        };
        
        //arreglo con los productos de la licorera seleccionada
        var productos = {};
        productos.items = [];
        
        //retorna el arreglo de productos
        function getProductos(){
            return productos;
        };
        
        //reinicia los valores del servicio
        function reiniciarValores(){
            datos_orden.hora = "";
            datos_orden.subtotal = "";
            datos_orden.pedido = []; 
            datos_orden.observacion = "";
            datos_orden.descuento = "";
            datos_orden.total_compra = "";
            datos_transaccion_analytics.id = "";          
            datos_transaccion_analytics.affiliation = ""; 
            datos_transaccion_analytics.revenue = "";    
            datos_transaccion_analytics.shipping = ""; 
        };
        
        return{
            getDatosOrden:getDatosOrden,
            getProductos:getProductos,
            getIdUsuarioLicorera:getIdUsuarioLicorera,
            reiniciarValores:reiniciarValores,
            getCategoriaSeleccionada:getCategoriaSeleccionada,
            getDatosTransaccionAnalytics:getDatosTransaccionAnalytics
        };
        
    }])
    
    .factory('CarritoService',[function(){
        
        //array con los productos individuales de cada pedido
        var productos_pedido = [];
        var arreglo_post_productos = [];
        
        //array con los productos de la compra para analytics
        var productos_analytics = [];
        
        function anadirProducto(producto,cantidad){
            var coincidencia =  false;
            var nuevo_producto = [producto,cantidad];
            var producto_orden = [producto.id,cantidad];
            var item_analytics = {
                'id': '',                                        // Transaction ID. Required.
                'name': producto.marca + ' ' +producto.tamano,   // Product name. Required.
                'category': producto.subcategoria,               // Category or variation.
                'price': producto.precio,                        // Unit price.
                'quantity': cantidad                             // Quantity.
            };
            
            for(var i = 0; i < productos_pedido.length; i++){
                if(producto.id === productos_pedido[i][0].id){
                    var index = i;
                    coincidencia = true;
                }
            }
            
            if(coincidencia === false){
                productos_analytics.push(item_analytics);
                productos_pedido.push(nuevo_producto);
                arreglo_post_productos.push(producto_orden);
            } else {
                productos_analytics[index] = (item_analytics);
                productos_pedido[index] = (nuevo_producto);
                arreglo_post_productos[index] = (producto_orden);
            }
        };
        
        //devuelve el array con los productos individuales
        function getProductosPedido(){
            return productos_pedido;
        };
        
        //devuelve el array con la lista definitiva de productos
        function getArregloPostProductos(){
            return arreglo_post_productos;
        };
        
        //devuelve el array con los productos para analytics
        function getProductosAnalytics(){
            return productos_analytics;
        };
        
        //valor del total de la compra
        var valor_total_compra = {};
        valor_total_compra.total = 0;
        valor_total_compra.condescuento = 0;
        
        //recalcula el valor total de la compra
        function calcularTotalCompra(){
            valor_total_compra.total= 0;
            if(productos_pedido.length == 0) {
                valor_total_compra.total = 0;
            } else {
                for(var i = 0; i < productos_pedido.length; i++){
                    valor_total_compra.total += productos_pedido[i][0].precio*productos_pedido[i][1];
                }
            }
        };
        
        //devuelve el valor total de la compra
        function getValorTotalCompra(){
            return valor_total_compra;
        };
        
        //numero total de productos
        var numero_productos = {};
        numero_productos.valor = 0;
        
        //calcula el numero total de productos
        function calcularNumeroProductos(){
            numero_productos.valor = 0;
            if(productos_pedido.length == 0){
                numero_productos.valor = 0;
            } else {
                for(var i = 0; i < productos_pedido.length; i++){
                    numero_productos.valor += productos_pedido[i][1];
                }
            }
        }
        
        //devuelve el numero de productos
        function getNumeroProductos(){
            return numero_productos;
        };

        //variables cupon descuento
        var cupon = {};
        cupon.activo = false;
        cupon.cupon = [];
        cupon.descuento = [];
        cupon.serie = "";

        //devuelve el cupon
        function getCupon(){
            return cupon;
        };
        
        //reinicia los valores del carrito
        function reiniciarValores(){
            productos_pedido = [];
            arreglo_post_productos = [];
            productos_analytics = [];
            valor_total_compra.total = 0;
            numero_productos.valor = 0;
            cupon.activo = false;
            cupon.cupon = [];
            cupon.descuento = [];
            cupon.serie = "";
        };
        
        return{
            anadirProducto: anadirProducto,
            getProductosPedido:getProductosPedido,
            getArregloPostProductos:getArregloPostProductos,
            getProductosAnalytics:getProductosAnalytics,
            calcularTotalCompra: calcularTotalCompra,
            getValorTotalCompra: getValorTotalCompra,
            calcularNumeroProductos: calcularNumeroProductos,
            getNumeroProductos: getNumeroProductos,
            getCupon:getCupon,
            reiniciarValores:reiniciarValores
        };
        
    }])
    
     .factory('ActualizarService',['$timeout',function($timeout){
        
        var cargar_contenido={};
        cargar_contenido.valor = true;
         
        function actualizarCarousel(){
            cargar_contenido.valor=false;
            $timeout(function(){
                cargar_contenido.valor=true;
            },100);
        };
         
        function getContenido(){
            return cargar_contenido;
        };
         
        var animacion_carrito = {};
        animacion_carrito.animar = false;
         
        function animarCarrito(){
            animacion_carrito.animar=true;
            $timeout(function(){
                animacion_carrito.animar=false;
            },3000);
        };
         
        function getAnimacionCarrito(){
            return animacion_carrito;
        };
        
        return{
            getContenido:getContenido,
            actualizarCarousel:actualizarCarousel,
            getAnimacionCarrito: getAnimacionCarrito,
            animarCarrito: animarCarrito
        };
        
    }]);
    
})();