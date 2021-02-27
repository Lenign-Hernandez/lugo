function guardarLocalStorage() {
    var localStorage = window.localStorage;

    if (localStorage.getItem('categorias') == null) {
        localStorage.setItem('categorias', JSON.stringify(categorias));
    }
    if (localStorage.getItem('usuarios') === null) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

guardarLocalStorage();

var categoriaArray = [];

function mostrarCategorias() {
    document.getElementById('fila').innerHTML = '';
    categoriaArray = JSON.parse(localStorage.getItem('categorias'));
    categoriaArray.forEach(function(categoria, indice) {
        document.getElementById('fila').innerHTML +=
            `<div class="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3  mt-3">
            <div class="card" onclick="empresasCategoria(${indice})"
                style="background-color:rgb(${Math.floor(Math.random() * (254-102)+102)},
                                            ${Math.floor(Math.random() * (254-102)+102)}, 
                                            ${Math.floor(Math.random() * (254-102)+102)});
                                            border-radius:30px;
                                            cursor:pointer;">
                <i class="${ categoria.icono } fa-5x pt-4 pl-3"></i>
                <div class="card-body">
                    
                    <label id="titulo"> ${ categoria.nombreCategoria } </label><br>
                    <label id="cantidad">${categoria.empresas.length} Comercios</label>
                </div>
            </div>
        </div>`
    });

}

mostrarCategorias();

var usuariosArray = JSON.parse(localStorage.getItem('usuarios'));
usuariosArray.forEach(function(usuario) {
    document.getElementById("usuarioActual").innerHTML +=
        ` <option value="${usuario.nombre}">${usuario.nombre + ' ' + usuario.apellido}</option>`;
});

var ordenes = [];
var usuarioActual = '';

function cambiarUsuario() {
    usuarioActual = document.getElementById("usuarioActual").value;
    usuariosArray.forEach(function(usuario) {
        if (usuarioActual === usuario.nombre) {
            ordenes = usuario.ordenes;
        }
    });
}

cambiarUsuario();

function verOrdenes() {
    $('#ordenesModal').modal('show');
    document.getElementById('ordenBodyModal').innerHTML = '';

    document.getElementById('ordenHeaderModal').innerHTML =
        `<label>${usuarioActual}, Estas son tus ordenes</label>`;

    ordenes.forEach(function(orden) {
        document.getElementById('ordenBodyModal').innerHTML +=
            `<div>
            <label style="font-size:24px; font-weight:500; color:rgb(82, 22, 138);">${orden.nombreProducto}</label>
            <br><label>${orden.descripcion}</label>
            <label style="display:block; text-align:right; font-weight:700">$${orden.precio}</label>
        </div><hr>`;
    });
}

function mostrarUsuario() {

    document.getElementById('mostrarUser').innerHTML =
        `<label>${usuarioActual}, En hora buena</label>`;
}

function empresasCategoria(idcategoria) {
    $('#ordenesModal').modal('show');
    document.getElementById('ordenHeaderModal').innerHTML =
        `<label>Empresas</label>`;

    document.getElementById('ordenBodyModal').style.border = '0px';
    document.getElementById('ordenBodyModal').innerHTML =
        `<div id="div-empresa-row"  class="row">
        </div>`;

    categoriaArray[idcategoria].empresas.forEach(function(empresa, indice) {
        document.getElementById('div-empresa-row').innerHTML +=
            `<div class="col-6" style="margin:0px; padding:0px;">
            <div id="div-empresa-col${indice}" style="border-radius:25px 25px 0px 0px; margin:5px; border: 0.7px solid rgb(243, 236, 236);">
                <img src="${empresa.imagen}" class="img-fluid" style="border-radius:25px 25px 0px 0px" alt="">
                <label id="nombreEmp">${empresa.nombreEmpresa}</label>
            </div>
            
        </div>`;

        empresa.productos.forEach(function(producto, i) {
            document.getElementById(`div-empresa-col${indice}`).innerHTML +=
                `
            <label style="padding-left:15px; font-size:24px; font-weight:500; color:rgb(82, 22, 138);">${producto.nombreProducto}</label>
            <button id="btn-pedir" onclick="pedir(${idcategoria}, ${indice}, ${i})">Pedir</button>
            <br><label style="padding-left:15px;">${producto.descripcion}</label>
            <label style="font-size:18px; padding-right:20px; display:block; text-align:right; font-weight:700">$${producto.precio}</label>
            <hr>`
        })
    });

}

function pedir(idcategoria, indiceEmpresa, indice) {
    $('#cantidadModal').modal('show');
    console.log(indiceEmpresa, indice);
    console.log(categoriaArray[idcategoria].empresas[indiceEmpresa].productos[indice]);
    let product = categoriaArray[idcategoria].empresas[indiceEmpresa].productos[indice];

    document.getElementById('cantidadBodyModal').innerHTML =
        `
        <label style="padding-left:15px; font-size:24px; font-weight:500; color:rgb(82, 22, 138);">${product.nombreProducto}</label>
        <br><label style="padding-left:15px;">${product.descripcion}</label>
        <div class="row">
            <div class="col-5">
                <label>Cantidad a solicitar: </label>
            </div>
            <div class="col-7">
                <input id="cantidadProducto" class="form-control" type="number" placeholder="cantidad"> 
            </div>
        </div> 
        <label style="font-size:18px; margin-top:20px; padding-right:20px; display:block; text-align:right; font-weight:700">$${product.precio}</label>
        <hr>
        <button id="btn-procesar" onclick="nuevoPedido(${idcategoria},${indiceEmpresa}, ${indice})" type="button" class="btn" data-dismiss="modal">Procesar orden</button>
        `
}

function nuevoPedido(idcategoria, indiceEmpresa, indice) {
    console.log(usuariosArray, usuarioActual);
    var cant = parseInt(document.getElementById('cantidadProducto').value);
    let product = categoriaArray[idcategoria].empresas[indiceEmpresa].productos[indice];
    let nuevaorden = {
        nombreProducto: product.nombreProducto,
        descripcion: product.descripcion,
        cantidad: cant,
        precio: product.precio
    };

    usuariosArray.forEach(function(usuario) {
        if (usuario.nombre === usuarioActual) {
            usuario.ordenes.push(nuevaorden);
        }
    });
    console.log(usuariosArray);

    localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
    $('#cantidadModal').modal('hide');
    $('#ordenesModal').modal('hide');
}