import { Request, Response } from 'express';
import Estudio from '../models/estudio.model';
import Paciente from '../models/paciente.model';
import Medico from '../models/medico.model';
import Turno from '../models/turno.model';

//Medico genera orden de estudio
export const crearOrdenEstudio = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dniPaciente, matriculaSolicitante, tipoEstudio } = req.body;

        if (!dniPaciente || !matriculaSolicitante || !tipoEstudio) {
            res.status(400).json({ mensaje: 'Faltan datos para generar la orden' });
            return;
        }

        const paciente = await Paciente.findOne({ dni: dniPaciente, activo: true });
        if (!paciente) {
            res.status(404).json({ mensaje: 'Paciente no encontrado' });
            return;
        }

        const medicoSolicitante = await Medico.findOne({ matricula: matriculaSolicitante, activo: true });
        if (!medicoSolicitante) {
            res.status(404).json({ mensaje: 'Médico solicitante no encontrado' });
            return;
        }

        //Crear la orden
        const nuevaOrden = new Estudio({
            paciente: paciente._id,
            medicoSolicitante: medicoSolicitante._id,
            tipoEstudio: tipoEstudio
        });

        await nuevaOrden.save();

        const ordenCompleta = await Estudio.findById(nuevaOrden._id)
            .populate('paciente', 'nombre apellido dni')
            .populate('medicoSolicitante', 'nombre apellido matricula especialidad');

        res.status(201).json({ 
            mensaje: 'Orden de estudio creada exitosamente',
            orden: ordenCompleta
        });
    }

    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al crear orden de estudio',
            error
        });
    }
};

//Paciente saca turno para realizar estudio
export const sacarTurnoEstudio = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idEstudio } = req.params; 
        const { idTurno } = req.body;

        //Validar que turno exista
        const turnoExistente = await Turno.findById(idTurno);
        if (!turnoExistente) {
            res.status(404).json({ mensaje: 'Turno no encontrado' });
            return;
        }

        //Actualizar estudio
        const estudioActualizado = await Estudio.findByIdAndUpdate(
            idEstudio,
            {
                turnoAsignado: turnoExistente._id,
                estado: 'Turno Asignado'
            },
            { new: true }
        )
        .populate('paciente', 'nombre apellido dni')
        .populate('medicoSolicitante', 'nombre apellido matricula especialidad')
        .populate('turnoAsignado', 'fechaHora medico');

        if (!estudioActualizado) {
            res.status(404).json({ mensaje: 'Estudio no encontrado' });
            return;
        }

        res.status(200).json({ 
            mensaje: 'Turno asignado al estudio exitosamente',
            estudio: estudioActualizado
        });
    }

    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al asignar turno al estudio',
            error
        });
    }
};

//Medico realiza estudio y carga resultados
export const cargarResultados = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idEstudio } = req.params; 
        const { matriculaRealizador, resultado } = req.body;

        if (!matriculaRealizador || !resultado) {
            res.status(400).json({ mensaje: 'Faltan datos para cargar resultados' });
            return;
        }

        const medicoRealizador = await Medico.findOne({ matricula: matriculaRealizador, activo: true });
        if (!medicoRealizador) {
            res.status(404).json({ mensaje: 'Médico realizador no encontrado' });
            return;
        }

        const estudioCompletado = await Estudio.findByIdAndUpdate(
            idEstudio,
            {
                resultado: resultado,
                medicoRealizador: medicoRealizador._id,
                estado: 'Completado'
            },
            { new: true }
        )
        .populate('paciente', 'nombre apellido dni')
        .populate('medicoSolicitante', 'nombre apellido matricula especialidad')
        .populate('medicoRealizador', 'nombre apellido matricula especialidad')

        if (!estudioCompletado) {
            res.status(404).json({ mensaje: 'Estudio no encontrado' });
            return;
        }

        res.status(200).json({ 
            mensaje: 'Resultados cargados correctamente. El paciente ya puede verlos',
            estudio: estudioCompletado
        });
    }

    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al cargar resultados del estudio',
            error
        });
    }
};
