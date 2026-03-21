import { Router } from 'express';
import {
    registrarPaciente,
    registrarMedico,
    login
} from '../controllers/usuario.controller';

const router = Router();

router.post('/registro/paciente', registrarPaciente);
router.post('/registro/medico', registrarMedico);
router.post('/login', login);

export default router;