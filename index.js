const express = require("express");

const mysql = require("mysql");

const app = express();

let conexion = mysql.createConnection({
    host: "localhost",
    database: "v&n_colors",
    user: "root",
    password: ""
})

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/public', express.static('public'));

app.use('/img', express.static('img'));

app.get('/', (req, res) =>{
    res.render('index')
});

app.get('/views/index.ejs', (req, res) =>{
    res.render('index')
});

app.get('/views/login.ejs', (req, res) =>{
    res.render('login')
});

app.get('/views/registro.ejs', (req, res) =>{
    res.render('registro')
});

app.get('/views/confirmacion.ejs', (req, res) =>{
    res.render('confirmacion')
});

app.get('/public/style.css', (req, res) =>{
    res.sendFile(__dirname + 'public/style.css')
});

app.post("/validar", function(req, res){
    const datos = req.body;
    
    let nombre = datos.nom;
    let cedula = datos.ced;
    let email = datos.correo;
    let telefono = datos.tel;
    let contraseña = datos.pass;

    let buscar = "SELECT * FROM usuarios WHERE cedula = "+cedula+" ";

    conexion.query(buscar, function(error, row){
        if(error){
            throw error;
        }else{
            if(row.lenght>0){
                console.log("No se puede registrar, usuario ya existe");
            }else{
                let registrar = "INSERT INTO usuarios (cedula, nombre, telefono, correo, contrasenia) VALUES ('"+cedula+"', '"+nombre+"', '"+telefono+"', '"+email+"', '"+contraseña+"')";

                conexion.query(registrar, function(error){
                if(error){
                    throw error;
                }
                else{
                    console.log("Datos almacenados correctamente");
                    res.redirect('/views/confirmacion.ejs?success=true');
                }
                });
            }
        }
    })
});

app.post("/login", function(req, res){
    const datos = req.body;
    
    let cedula = datos.cedula;
    let contraseña = datos.pass;

    let buscar = "SELECT * FROM usuarios WHERE cedula = ? AND contrasenia = ?";
    
    conexion.query(buscar, [cedula, contraseña], function(error, rows){
        if(error){
            throw error;
        } else {
            if(rows.length > 0){
                console.log("Inicio de sesión exitoso");
                res.redirect('/views/index.ejs'); // Cambia "/dashboard" con la ruta a tu página principal después del inicio de sesión
            } else {
                console.log("Credenciales incorrectas");
                res.redirect('/views/login.ejs?error=true'); // Puedes agregar un parámetro para mostrar un mensaje de error en la página de inicio de sesión
            }
        }
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Servidor creado http://localhost:3000");
});