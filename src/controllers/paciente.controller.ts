import { Request, Response } from "express";
import Paciente from "../models/paciente.model";

//CREAR PACIENTE
//Exportar función para usarla en rutas
export const crearPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, dni, fechaNacimiento, email } = req.body;
        //Validar campos obligatorios
        if (!nombre || !apellido || !dni || !fechaNacimiento || !email) {
            res.status(400).json({ 
                mensaje: "Todos los campos son obligatorios" });
            return;
        }

        //Buscar si ya existe un paciente con el mismo DNI o email
        const pacienteExistente = await Paciente.findOne({ $or: [{ dni }, { email }] });
        if (pacienteExistente) {
            res.status(400).json({ 
                mensaje: "Ya existe un paciente con el mismo DNI o email" });
            return;
        }

        //Crear nuevo paciente
        const nuevoPaciente = new Paciente({
            nombre,
            apellido,
            dni,
            fechaNacimiento,
            email
        });

        //Guardar en base de datos
        await nuevoPaciente.save();

        //Responder con el paciente creado
        res.status(201).json({
            mensaje: "Paciente creado exitosamente",
            paciente: nuevoPaciente
        });
    } 
    catch (error) {
        res.status(500).json({ 
            mensaje: "Error al crear paciente", 
            error
        });
    }
};

//LEER TODOS LOS PACIENTES (los activos)
export const obtenerPacientes = async (req: Request, res: Response): Promise<void> => {
    try {
        const pacientes = await Paciente.find({activo: true});
        res.status(200).json(pacientes);
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener pacientes",
            error
        });
    }
};

//LEER UN PACIENTE POR DNI
export const obtenerPacientePorDni = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params; //Extrae DNI de URL
        const paciente = await Paciente.findOne({ dni: dni, activo: true});
        
        if (!paciente) {
            res.status(404).json({ mensaje: "Paciente no encontrado" });
            return;
        }
        res.status(200).json(paciente);
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar paciente",
            error
        });
    }
};

//MODIFICAR PACIENTE
export const actualizarPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params; //DNI del paciente a modificar
        const datosActualizar = req.body; //Datos a actualizar
        const pacienteActualizado = await Paciente.findOneAndUpdate({ dni: dni }, datosActualizar, { new: true });

        if (!pacienteActualizado) {
            res.status(404).json({ mensaje: "Paciente no encontrado" });
            return;
        }
        res.status(200).json({
            mensaje: "Paciente actualizado exitosamente",
            paciente: pacienteActualizado
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar paciente",
            error
        });
    }
};

//ELIMINAR PACIENTE (borrado lógico)
export const eliminarPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { dni } = req.params; //DNI del paciente a eliminar
        const pacienteEliminado = await Paciente.findOneAndUpdate({ dni: dni }, { activo: false }, { new: true });

        if (!pacienteEliminado) {
            res.status(404).json({ mensaje: "Paciente no encontrado" });
            return;
        }
        res.status(200).json({
            mensaje: "Paciente eliminado exitosamente",
            paciente: pacienteEliminado
        });
    }
    catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar paciente",
            error
        });
    }
};
