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

        //Validar que no haya otro turno para el mismo médico a la misma hora
        const turnoExistente = await Turno.findOne({
            medico: medicoEncontrado._id,
            fechaHora: fechaHora,
            estado: { $in: ['Pendiente', 'Confirmado'] }
        });

        if (turnoExistente) {
            res.status(400).json({ 
                mensaje: 'Horario no disponible. El médico ya tiene paciente asignado para esa fecha y hora' });
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

//Ver turnos pendientes de paciente
export const obtenerTurnosPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params;
        const paciente = await Paciente.findOne({ dni: dni, activo: true });
        if (!paciente) {
            res.status(404).json({ 
                mensaje: 'Paciente no encontrado' });
            return;
        }

        const turnos = await Turno.find({ paciente: paciente._id, estado: 'Pendiente' })
            .populate('medico', 'nombre apellido matricula especialidad');
        res.status(200).json({ turnos });
    }
    
    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al obtener turnos del paciente',
            error: error
        });
    }
};

//Ver turnos asignados de médico
export const obtenerTurnosMedico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matricula } = req.params;
        const medico = await Medico.findOne({ matricula: matricula, activo: true });
        if (!medico) {
            res.status(404).json({ 
                mensaje: 'Médico no encontrado' });
            return;
        }

        const turnos = await Turno.find({ medico: medico._id, estado: 'Pendiente' })
            .populate('paciente', 'nombre apellido dni');
        res.status(200).json({ turnos });
    }
    
    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al obtener turnos del médico',
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

//Completar turno y agregar notas
export const atenderPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { notasMedico } = req.body;

        if (!notasMedico) {
            res.status(400).json({ 
                mensaje: 'Las notas del médico son obligatorias para completar el turno' });
            return;
        }
        
        //Validaciones
        const turnoActual = await Turno.findById(id);
        if (!turnoActual) {
            res.status(404).json({ 
                mensaje: 'Turno no encontrado' });
            return;
        }

        if (turnoActual.estado === 'Cancelado') {
            res.status(400).json({ 
                mensaje: 'No se puede completar un turno cancelado' });
            return;
        }

        if (turnoActual.estado === 'Completado') {
            res.status(400).json({ 
                mensaje: 'El turno ya fue completado anteriormente' });
            return;
        }

        //Actualizar estado a Completado y agregar notas
        const turnoCompletado = await Turno.findByIdAndUpdate(
            id, {
                estado: 'Completado',
                notasMedico: notasMedico
            }, 
            { new: true }
        )
        .populate('paciente', 'nombre apellido dni')
        .populate('medico', 'nombre apellido matricula especialidad');
        
        res.status(200).json({ 
            mensaje: 'Turno completado exitosamente',
            turno: turnoCompletado
        });
    }

    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al completar turno',
            error: error
        });
    }
};

//Confirmar asistencia a turno
export const confirmarTurno = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; //ID del turno a confirmar

        const turnoActual = await Turno.findById(id);

        if (!turnoActual) {
            res.status(404).json({ 
                mensaje: 'Turno no encontrado' });
            return;
        }

        if (turnoActual.estado !== 'Pendiente') {
            res.status(400).json({ 
                mensaje: 'Solo se pueden confirmar turnos en estado Pendiente' });
            return;
        }

        const turnoConfirmado = await Turno.findByIdAndUpdate(
            id, 
            { estado: 'Confirmado' },
            { new: true }
        )
        .populate('paciente', 'nombre apellido dni')
        .populate('medico', 'nombre apellido matricula especialidad');

        res.status(200).json({ 
            mensaje: 'Turno confirmado exitosamente',
            turno: turnoConfirmado
        });
    }

    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al confirmar turno',
            error: error
        });
    }
};