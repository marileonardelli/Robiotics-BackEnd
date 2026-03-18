import { Router } from 'express';
import { 
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorDni,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/paciente.controller';

const router = Router();

router.post('/', crearPaciente);
router.get('/', obtenerPacientes);
router.get('/dni/:dni', obtenerPacientePorDni);
router.put('/dni/:dni', actualizarPaciente);
router.delete('/dni/:dni', eliminarPaciente);

export default router;