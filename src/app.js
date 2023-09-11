import express from "express";
import {config} from "./config/config.js";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { connectDB } from "./config/dbConnection..js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passportConfig.js";
import passport from "passport";
import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { chatModel } from './dao/models/chat.models.js';
import {__dirname} from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";




const port = config.server.port;
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true})); //manejo de formularios de vistas



//configuracion de los sesiones
app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongo.url
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
}));

//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


const httpsServer = app.listen(port,()=>console.log(`Server esta funcionando en el puerto ${port}`));

//conectamos a la base de datos
connectDB();

//configuracion de motor de plantillas
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

//rutas
app.get("/",(req,res)=>{
    res.render("home")
});

app.post("/crearCookie",(req,res)=>{
    const loginInfo = req.body;
    res.cookie("infoUser",'{user:${loginInfo.email}}',{maxAge:50000}).send("Se recibio la informacion");
});

app.get("/leerCookkies",(req,res)=>{
    const cookies = req.cookies;
    res.send(cookies);
});

//ruta para generar la sesion de usuario
app.get("/login",(req,res)=>{
    const {username} = req.query;
    req.session.user={username, visitas:1}
    res.send("usuario registrado")
});

app.get("/visitas",(req,res)=>{
    console.log(req.session)
    if(req.session.user && req.session.user.username){
        req.session.user.visitas++;
        res.send("Ya existe el usuario")
    } else {
        res.send("necesitas resgistrarte")
    }
});

// Crear servidor de websocket
const socketServer = new Server(httpsServer);
let messages = [];



// Crear el canal de comunicacion, detectar socket del cliente
socketServer.on("connection", (socketConnected)=>{
    console.log(`Nuevo cliente conectado  ${socketConnected.id}`);
    // Capturar info del cliente
    socketConnected.on("messageKey", (data)=>{
        console.log(data);
        messages.push({userId:socketConnected.id,message:data});
    });

    

    socketConnected.on("nuevoProducto", (nuevoProd)=>{
        console.log(data);
       // messages.push({userId:socketConnected.id,message:data});

        // Enviar todos los mensajes a todos los clientes
        socketServer.emit("nuevoProducto", data);
    });


   // Maneja el evento 'authenticated'
   socket.on("authenticated", async (msg)=>{
    const messages = await chatModel.find();
    socket.emit("messageHistory", messages);
    socket.broadcast.emit("newUser",msg);
   });

   //recibir el mensaje del cliente
   socket.on("message",async(data)=>{
    console.log("data", data);
    const messageCreated = await chatModel.create(data);
    const messages = await chatModel.find();
    //cada vez que recibamos este mensaje, enviamos todos los mensajes actualizados a todos los clientes conectados
    servidorSocket.emit("messageHistory", messages);
    })
});


//acceso de routes
app.use(viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

