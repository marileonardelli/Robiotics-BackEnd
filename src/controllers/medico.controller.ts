import { Request, Response } from "express";
import Medico from "../models/medico.model";

//Exportar función para usarla en rutas
export const crearMedico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, matricula, especialidad, email } = req.body;
        //Validar campos obligatorios
        if (!nombre || !apellido || !matricula || !especialidad || !email) {
            res.status(400).json({ 
                mensaje: "Todos los campos son obligatorios" });
            return;
        }

        //Buscar si ya existe un médico con la misma matrícula o email
        const medicoExistente = await Medico.findOne({ $or: [{ matricula }, { email }] });
        if (medicoExistente) {
            res.status(400).json({ 
                mensaje: "Ya existe un médico con esa matrícula o email" });
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
            mensaje: "Médico creado exitosamente",
            medico: nuevoMedico
        });
    } 
    
    catch (error) {
        res.status(500).json({ 
            mensaje: "Error al crear el médico",
            error
        });

    }
};