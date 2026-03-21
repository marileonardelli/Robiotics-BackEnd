import { Request, Response } from 'express';
import Medico from '../models/medico.model';

//Exportar función para usarla en rutas
export const crearMedico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, matricula, especialidad, email } = req.body;
        //Validar campos obligatorios
        if (!nombre || !apellido || !matricula || !especialidad || !email) {
            res.status(400).json({ 
                mensaje: 'Todos los campos son obligatorios' });
            return;
        }

        //Buscar si ya existe un médico con la misma matrícula o email
        const medicoExistente = await Medico.findOne({ $or: [{ matricula }, { email }] });
        if (medicoExistente) {
            res.status(400).json({ 
                mensaje: 'Ya existe un médico con esa matrícula o email' });
            return;
        }

        //Crear nuevo médico
        const nuevoMedico = new Medico({ 
            nombre, 
            apellido, 
            matricula, 
            especialidad, 
            email 
        });

        //Guardar en base de datos
        await nuevoMedico.save();

        //Responder con el médico creado
        res.status(201).json({ 
            mensaje: 'Médico creado exitosamente',
            medico: nuevoMedico
        });
    } 
    
    catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al crear el médico',
            error
        });

    }
};

//LEER TODOS LOS MEDICOS (los activos) con filtro por especialidad
export const obtenerMedicos = async (req: Request, res: Response): Promise<void> => {
    try {
        const { especialidad } = req.query;
        const filtro: any = { activo: true };
        if (especialidad) {
            filtro.especialidad = especialidad;
        }

        const medicos = await Medico.find({filtro});
        res.status(200).json(medicos);
    }
    catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener médicos',
            error
        });
    }
};

//LEER UN MÉDICO POR MATRÍCULA
export const obtenerMedicoPorMatricula = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matricula } = req.params; //Extrae matricula de URL
        const medico = await Medico.findOne({ matricula: matricula, activo: true});
        
        if (!medico) {
            res.status(404).json({ mensaje: 'Médico no encontrado' });
            return;
        }
        res.status(200).json(medico);
    }
    catch (error) {
        res.status(500).json({
            mensaje: 'Error al buscar médico',
            error
        });
    }
};

//MODIFICAR MEDICO
export const actualizarMedico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matricula } = req.params; //Matrícula del médico a modificar
        const datosActualizar = req.body; //Datos a actualizar
        const medicoActualizado = await Medico.findOneAndUpdate({ matricula: matricula }, datosActualizar, { new: true });

        if (!medicoActualizado) {
            res.status(404).json({ mensaje: 'Médico no encontrado' });
            return;
        }
        res.status(200).json({
            mensaje: 'Médico actualizado exitosamente',
            medico: medicoActualizado
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar médico',
            error
        });
    }
};

//ELIMINAR MÉDICO (borrado lógico)
export const eliminarMedico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { matricula } = req.params; //Matrícula del médico a eliminar
        const medicoEliminado = await Medico.findOneAndUpdate({ matricula: matricula }, { activo: false }, { new: true });

        if (!medicoEliminado) {
            res.status(404).json({ mensaje: 'Médico no encontrado' });
            return;
        }
        res.status(200).json({
            mensaje: 'Médico eliminado exitosamente',
            medico: medicoEliminado
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar médico',
            error
        });
    }
};
