import { Router } from 'express';
import { crearMedico } from '../controllers/medico.controller';

const router = Router();

//Cuando llega petición POST a la raiz de esta ruta
//se ejecuta función "crearMedico"
router.post('/', crearMedico);

export default router;