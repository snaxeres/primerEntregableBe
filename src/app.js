import express from 'express';
import mongoose from 'mongoose';
import indexRoutes from "./routes/index.routes.js";
import { initializePassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import passport from "passport";
import  routes  from "./routes/auth.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import { sessionRoutes}  from "./routes/session.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
initializePassport();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRoutes);
app.use("/", viewsRoutes);
app.use("/api/sessions", sessionRoutes);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use("/api/auth", routes);
app.use(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  userRouter
);


mongoose.connect('mongodb+srv://Enrialegre:Metamorfos1s@cluster0.oldnu.mongodb.net/trabajoCoder?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
  });



io.on('connection', (socket) => {
  console.log('Cliente conectado');


  socket.on('productoActualizado', (data) => {
    io.emit('actualizacionProductos', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

export default io; 