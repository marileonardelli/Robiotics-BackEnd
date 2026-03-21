import { Router } from 'express';
import { 
    crearTurno,
    obtenerTurnos,
    obtenerTurnosPaciente,
    obtenerTurnosMedico,
    cancelarTurno,
    atenderPaciente,
    confirmarTurno
} from '../controllers/turno.controller';

const router = Router();

router.post('/', crearTurno);
router.get('/', obtenerTurnos);
router.get('/paciente/:dni', obtenerTurnosPaciente);
router.get('/medico/:matricula', obtenerTurnosMedico);
router.put('/cancelar/:id', cancelarTurno);
router.put('/atender/:id', atenderPaciente);
router.put('/confirmar/:id', confirmarTurno);

export default router;