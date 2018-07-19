


class Usuario {
    constructor(nombre, usuario, contraseña, cuent) {
        var cuentos = [];
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
        this.cuentos = cuent.slice();
    }

};

class Preguntas {
    constructor(pregunta, respuesta, imagens) {
        var imagens = [];
        this.pregunta = pregunta;
        this.respuesta = respuesta;
        this.imagens = imagens.slice();

    }

};

class Cuento {
    constructor(titulo, descripcion, creditos, imagenes, audio, preguntas) {
        var ilustraciones = [];
        var audios = [];
        var preguntas = [];
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.creditos = creditos;
        this.imagenes = imagenes.slice();
        this.audios = audios.slice();
        this.preguntas = preguntas.slice();
    }


};

class Rutas {
    constructor(src) {

        this.src = src;


    }

};

$(document).ready(function () {
var hoja = 5;
var paginas = 4;
var id = 0;
var cuentos = [];
var cuentosIm = [];
var cuentosAu = [];
var ImPreguntas = [];
var ImPreguntas2 = [];
var ArrPreg = [];

var idCuento = 5;
    var arrayUsuarios = [];
    var CuentosTodos = [];
    $.getJSON('../php/datos.json', function (data) {
        for (var usuario of data) {
            var cuenteros = [];

            for (var cuentito of usuario.cuentos) {
                var imagenes = [];
                var audios = [];
                var preguntas = [];
                if (cuentito.imagenes != null) {
                    for (var pagina of cuentito.imagenes) {
                        let pa = new Rutas(pagina.src);
                        imagenes.push(pa);
                        if (cuentito.audios != null) {
                            for (var audi of cuentito.audios) {
                                let pa = new Rutas(audi.src);
                                audios.push(pa);
                            }
                            if (cuentito.preguntas != null) {
                                for (var preguntona of cuentito.preguntas) {
                                    if (preguntona.imagens != null) {
                                        var preguntasI = [];
                                        for (var pregunt of preguntona.imagens) {
                                            let p = new Rutas(pregunt.src);
                                            preguntasI.push(pa);
                                        }

                                        let pregunta = new Preguntas(preguntona.pregunta, preguntona.respuesta, preguntasI);
                                        preguntas.push(pregunta);


                                    }
                                }
                            }
                        }
                    }
                }
                var cuentoporUser = new Cuento(cuentito.titulo, cuentito.descripcion, cuentito.creditos, imagenes, audios, preguntas);
                cuenteros.push(cuentoporUser);

                CuentosTodos.push(cuentoporUser); //para tener todos los cuentos sin saber usuario 

            }


            var user = new Usuario(usuario.nombre, usuario.usuario, usuario.pass, cuenteros);
            console.log(user);
            arrayUsuarios.push(user);
            console.log(arrayUsuarios);



        }
    });


    cargar();
    $(".contPreguntas").hide();

    ActivarDroppablePreguntas();
    $(".NuevaHoja").click(function () {
        var Thtml = "<div class='item'>\
                      <div id='hojaBln" + hoja + "'>\
                        \
                      </div>\
                    </div>"
        $(".carousel-inner").append(Thtml);
        $(".nav-dots").append("<li data-target='#carousel-example-generic' data-slide-to=" + paginas + " class='nav-dot'><div class='hojas' id=n" + hoja + "></div></li>");
        $(".ContAu").append("<h3>Audio" + hoja + "</h3><span><div class='HojAud' id=au" + hoja + "></div></span>");
        paginas++;
        id++;
        hoja++;
        cargar();
        ActivarDroppableAudio();


    });
    
    //limpiar pantalla
    $("#limpiar").click(function () {
        $('#titulo').val('');
        $('.descri').val('');
        $('.credi').val('');
    });

    //mostrarPreguntas
    $(".button3").click(function () {
        $(".contPreguntas").show();
        alert("Dirijase hacia la parte inferior de la pagina");


    });

//guardar

    $("#boton").click(function () {

        $(".hojas img").each(function () {
            AgrImg = ($(this).attr('src'));
            item = {};
            item["src"] = AgrImg;
            cuentosIm.push(item);
        });


        $(".HojAud audio").each(function () {
            AgrAud = ($(this).children().attr('src'));
            item = {};
            item["src"] = AgrAud;
            cuentosAu.push(item);
        });
        guardarPreguntas();
        var tit = $('input:text[name=fname]').val();
        var des = $('input:text[name=fdescripcion]').val();
        var credi = $('input:text[name=fcredi]').val();
        let cuentoNuevo = new Cuento(tit, des,credi,cuentosIm, cuentosAu, ArrPreg);
        for (let user of arrayUsuarios) {
            if (user.nombre == "yander") {
                user.cuentos.push(cuentoNuevo);
            }

        }

        var cue = JSON.stringify(arrayUsuarios);

        $.ajax({
            url: '../php/writeJson.php',
            method: 'post',
            data: {
                "identificador": cue
            },
            success: function (data) {
                alert(data);

            }
        });




    });

    $('.AgregarAudio').click(function () {
        //información del formulario
        var formData = new FormData($(".formulario2")[0]);
        var message = "";
        //hacemos la petición ajax  
        $.ajax({
            url: '../php/upload.php',
            type: 'POST',
            // Form data
            //datos del formulario
            data: formData,
            //necesario para subir archivos via ajax
            cache: false,
            contentType: false,
            processData: false,
            //mientras enviamos el archivo
            beforeSend: function () {
                message = $("<span class='before'>Subiendo la imagen, por favor espere...</span>");
                showMessage(message)
            },
            //una vez finalizado correctamente
            success: function (data) {
                alert("entro1");
                message = $("<span class='success'>La imagen ha subido correctamente.</span>");
                showMessage(message);
                if (isAudio(fileExtension)) {

                    $(".insertAudio").append("<audio id='draggable' controls><source src='../imagenes/historias/" + data + "' type='audio/mpeg'></audio> <span>" + fileName + "</span>");
                    ActivarDroppableAudio();
                }
            },
            //si ha ocurrido un error
            error: function () {
                message = $("<span class='error'>Ha ocurrido un error.</span>");
                showMessage(message);
            }
        });
    });



    //++++++++++++++++++++++++++++++++++++++++++++++Subir Imagenes++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //Agregar imagenes al contenedor

    $(".messages").hide();
    //queremos que esta variable sea global
    var fileExtension = "";
    //función que observa los cambios del campo file y obtiene información
    $(':file').change(function () {
        //obtenemos un array con los datos del archivo
        var file = $("#imagen")[0].files[0];
        //obtenemos el nombre del archivo
        var fileName = file.name;
        //obtenemos la extensión del archivo
        fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        //obtenemos el tamaño del archivo
        var fileSize = file.size;
        //obtenemos el tipo de archivo image/png ejemplo
        var fileType = file.type;
        //mensaje con la información del archivo
        showMessage("<span class='info'>Archivo para subir: " + fileName + ", peso total: " + fileSize + " bytes.</span>");
});


    //al enviar el formulario
    $('.AgregarImg').click(function () {
        //información del formulario
        var formData = new FormData($(".formulario")[0]);
        var message = "";
        //hacemos la petición ajax  
        $.ajax({
            url: '../php/upload.php',
            type: 'POST',
            // Form data
            //datos del formulario
            data: formData,
            //necesario para subir archivos via ajax
            cache: false,
            contentType: false,
            processData: false,
            //mientras enviamos el archivo
            beforeSend: function () {
                message = $("<span class='before'>Subiendo la imagen, por favor espere...</span>");
                showMessage(message)
            },
            //una vez finalizado correctamente
            success: function (data) {
                message = $("<span class='success'>La imagen ha subido correctamente.</span>");
                showMessage(message);
                
                if (isImage(fileExtension)) {
                   
                    $(".showImages").append("<img id='draggable' src='../imagenes/historias/" + data + "' />");
                    cargar();
                      ActivarDroppablePreguntas();
                }
            },
            //si ha ocurrido un error
            error: function () {
                message = $("<span class='error'>Ha ocurrido un error.</span>");
                showMessage(message);
            }
        });
    });

//link del tutorial para subir imagenes con jquery y Javascript
//https://www.uno-de-piera.com/subir-imagenes-con-php-y-jquery/

//+++++++++++++++++++++++++++++++++++++++++++++Subir Audios+++++++++++++++++++++++++++++++++++++++++++++++++++++++

    $(".messages").hide();
    //queremos que esta variable sea global
    var fileExtension = "";
    var fileName="";
    //función que observa los cambios del campo file y obtiene información
    $(':file').change(function () {
        //obtenemos un array con los datos del archivo
        var file = $("#audios")[0].files[0];
        //obtenemos el nombre del archivo
        fileName = file.name;
        //obtenemos la extensión del archivo
        fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        //obtenemos el tamaño del archivo
        var fileSize = file.size;
        //obtenemos el tipo de archivo image/png ejemplo
        var fileType = file.type;
        //mensaje con la información del archivo
        showMessage("<span class='info'>Archivo para subir: " + fileName + ", peso total: " + fileSize + " bytes.</span>");
    });

//Agregar al contenedor

    $('.AgregarAudio').click(function () {
        //información del formulario
        var formData = new FormData($(".formulario2")[0]);
        var message = "";
        //hacemos la petición ajax  
        $.ajax({
            url: '../php/upload.php',
            type: 'POST',
            // Form data
            //datos del formulario
            data: formData,
            //necesario para subir archivos via ajax
            cache: false,
            contentType: false,
            processData: false,
            //mientras enviamos el archivo
            beforeSend: function () {
                message = $("<span class='before'>Subiendo la imagen, por favor espere...</span>");
                showMessage(message)
            },
            //una vez finalizado correctamente
            success: function (data) {
                alert("entro1");
                message = $("<span class='success'>La imagen ha subido correctamente.</span>");
                showMessage(message);
                if (isAudio(fileExtension)) {
                    
                    $(".insertAudio").append("<audio id='draggable' controls><source src='../imagenes/historias/"+data+"' type='audio/mpeg'></audio> <span>"+fileName+"</span>");
                    ActivarDroppableAudio();
                }
            },
            //si ha ocurrido un error
            error: function () {
                message = $("<span class='error'>Ha ocurrido un error.</span>");
                showMessage(message);
            }
        });
});
    

function showMessage(message) {
    $(".messages").html("").show();
    $(".messages").html(message);
}

//comprobamos si el archivo a subir es una imagen
//para visualizarla una vez haya subido
function isImage(extension) {
    switch (extension.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'png':
        case 'jpeg':
            return true;
            break;
             case 'jpg':
        case 'mp3':
        case 'wav':
            return true;
            break;
        default:
            return false;
            break;
    }
}


//Comprobamos si es audio
function isAudio(extension) {
    switch (extension.toLowerCase()) {
        case 'mp3':
            return true;
            break;
        case 'wav':
            return true;
            break;
        default:
            return false;
            break;
    }
}




function cargar() {
    $("[id^=draggable]").draggable({
        revert: true
    });
    $("[id^=n]").droppable({
        drop: function (event, ui) {
            agregar = $(ui.draggable).attr('src');
            idA = $(this).attr("id");
            $("#" + idA + "").empty(); // vaciar los contenedores en el caso que este lleno
            $("#hojaBl" + idA + "").empty(); // vaciar los contenedores en el caso que este lleno
            $("#hojaBl" + idA + "").append("<img src=" + agregar + ">"); //agrego la imagen al contenedor del slider          
            $("#" + idA + "").append("<img src=" + agregar + ">"); //agrego la imagen a la pagina en miniatura.

        }
    });
}

function ActivarDroppableAudio() {
    $("[id^=draggable]").draggable({
        revert: true
    });
    $("[id^=au]").droppable({
        drop: function (event, ui) {
            agregar = $(ui.draggable).children().attr('src');
            idA = $(this).attr("id");
            $("#" + idA + "").empty(); // vaciar los contenedores en el caso que este lleno
            $("#" + idA + "").append("<audio id='draggable' controls><source src='" + agregar + "' type='audio/mpeg'></audio> ");

        }
    });
}


function ActivarDroppablePreguntas() {
    $("[id^=draggable]").draggable({
        revert: true
    });
    $("[id^=ImP]").droppable({
        drop: function (event, ui) {
            alert("encontro");
            agregar = $(ui.draggable).attr('src');
            idA = $(this).attr("id");
            $("#" + idA + "").empty(); // vaciar los contenedores en el caso que este lleno


            $("#" + idA + "").append("<img src=" + agregar + ">"); //agrego la imagen a la pagina en miniatura.

        }
    });
}
    
    
function guardarPreguntas() {

    var pre1 = $('input:text[name=preg1]').val();
    var pre2 = $('input:text[name=preg2]').val();
    var resp1 = document.getElementById("resp1").selectedIndex;
    var resp2 = document.getElementById("resp2").selectedIndex;
    console.log(pre1 + pre2 + resp1 + resp2);

    $(".preg1 img").each(function () {
        AgrImg = ($(this).attr('src'));
        item = {};
        item["src"] = AgrImg;
        ImPreguntas.push(item);
    });

    $(".preg2 img").each(function () {
        AgrImg = ($(this).attr('src'));
        item = {};
        item["src"] = AgrImg;
        ImPreguntas2.push(item);
    });


    var pregunta1 = new Preguntas(pre1, resp1, ImPreguntas);
    var pregunta2 = new Preguntas(pre2, resp2, ImPreguntas);


    ArrPreg.push(pregunta1);
    ArrPreg.push(pregunta2);


}



});

function showMessage(message) {
    $(".messages").html("").show();
    $(".messages").html(message);
}





