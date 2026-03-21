import { Router } from 'express';
import {
    registrarPaciente,
    registrarMedico,
    login
} from '../controllers/usuario.controller';
import { 
    verificarToken, 
    esAdmin
 } from '../middlewares/usuario.middleware';

const router = Router();

//Rutas públicas
router.post('/registro/paciente', registrarPaciente);
router.post('/login', login);

//Rutas protegidas (requieren autenticación y rol de admin)
router.post('/registro/medico', verificarToken, esAdmin, registrarMedico);


export default router;