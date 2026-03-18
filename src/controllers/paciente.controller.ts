import { Request, Response } from "express";
import Paciente from "../models/paciente.model";

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