import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db' //Importa conexión

import pacienteRoutes from './routes/paciente.routes';

//Inicializar vairables de entorno
dotenv.config();
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Conectar a base de datos
connectDB();

//Ruta de prueba
app.get('/api/ping', (req: Request, res: Response) => {
    res.json({mensaje: 'API funcionando correctamente'});
});

//Cualquier petición que empiece con /api/pacientes manejada por pacienteRoutes
app.use('/api/pacientes', pacienteRoutes);

//Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});