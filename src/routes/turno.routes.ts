import { Router } from 'express';
import { 
    crearTurno,
    obtenerTurnos,
    cancelarTurno
} from '../controllers/turno.controller';

const router = Router();

router.post('/', crearTurno);
router.get('/', obtenerTurnos);
router.put('/cancelar/:id', cancelarTurno);

export default router;