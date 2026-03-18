import { Router } from 'express';
import { 
    crearMedico,
    obtenerMedicos,
    obtenerMedicoPorMatricula,
    actualizarMedico,
    eliminarMedico
} from '../controllers/medico.controller';

const router = Router();

router.post('/', crearMedico);
router.get('/', obtenerMedicos);
router.get('/matricula/:matricula', obtenerMedicoPorMatricula);
router.put('/matricula/:matricula', actualizarMedico);
router.delete('/matricula/:matricula', eliminarMedico); 

export default router;