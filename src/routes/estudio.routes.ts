import {Router} from 'express';
import {
    crearOrdenEstudio,
    sacarTurnoEstudio,
    cargarResultados
} from '../controllers/estudio.controller';

const router = Router();

router.post('/orden/:matricula', crearOrdenEstudio);
router.post('/turno/:idEstudio', sacarTurnoEstudio);
router.put('/resultados/:idEstudio', cargarResultados);

export default router;