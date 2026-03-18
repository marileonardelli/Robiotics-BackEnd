import { Router } from 'express';
import { crearPaciente } from '../controllers/paciente.controller';

const router = Router();

//Cuando llega petición POST a la raiz de esta ruta
//se ejecuta función "crearPaciente"
router.post('/', crearPaciente);

export default router;