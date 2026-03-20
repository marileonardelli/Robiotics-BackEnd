import {Request, Response} from 'express';
import Turno from '../models/turno.model';
import Paciente from '../models/paciente.model';
import Medico from '../models/medico.model';

//Crear turno
export const crearTurno = async (req: Request, res: Response): Promise<void> => {
    try {
        //Frontend envia datos (DNI y matricula)
        const { dniPaciente, medico, fechaHora, tipo } = req.body;

        if (!dniPaciente || !medico || !fechaHora || !tipo) {
            res.status(400).json({ 
                mensaje: 'Todos los campos son obligatorios' });
            return;
        }

        //Buscar paciente por DNI
        const pacienteEncontrado = await Paciente.findOne({ dni: dniPaciente, activo: true });
        if (!pacienteEncontrado) {
            res.status(404).json({ 
                mensaje: 'Paciente no encontrado' });
            return;
        }

        //Buscar médico por matrícula
        const medicoEncontrado = await Medico.findOne({ matricula: medico, activo: true });
        if (!medicoEncontrado) {
            res.status(404).json({ 
                mensaje: 'Médico no encontrado' });
            return;
        }

        //Armar turno con id internos
        const nuevoTurno = new Turno({
            paciente: pacienteEncontrado._id,
            medico: medicoEncontrado._id,
            fechaHora,
            tipo
        });

        await nuevoTurno.save();

        //Usar populate para mostrar turno con datos legibles (no solo IDs)
        const turnoCompleto = await Turno.findById(nuevoTurno._id)
            .populate('paciente', 'nombre apellido dni')
            .populate('medico', 'nombre apellido matricula especialidad');

        res.status(201).json({ 
            mensaje: 'Turno creado exitosamente',
            turno: turnoCompleto
        });
    }

    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al crear turno',
            error: error
        });
    }
};

//Obtener todos los turnos
export const obtenerTurnos = async (req: Request, res: Response): Promise<void> => {
    try {
        const turnos = await Turno.find()
            .populate('paciente', 'nombre apellido dni')
            .populate('medico', 'nombre apellido matricula especialidad');
        res.status(200).json({ turnos });
    } 
    
    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al obtener turnos',
            error: error
        });
    }
};

//Cancelar turno
export const cancelarTurno = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const turnoCancelado = await Turno.findByIdAndUpdate(id, { estado: 'Cancelado' }, { new: true })
            .populate('paciente', 'nombre apellido dni')
            .populate('medico', 'nombre apellido matricula especialidad');
        res.status(200).json({ 
            mensaje: 'Turno cancelado exitosamente',
            turno: turnoCancelado
        });
    } 
    
    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al cancelar turno',
            error: error
        });
    }
};
