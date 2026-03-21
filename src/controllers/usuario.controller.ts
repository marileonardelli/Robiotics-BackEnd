import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.model';
import Paciente from '../models/paciente.model';
import Medico from '../models/medico.model';

//Firma secreta del centro medico. Se guarda en un archivo oculto
const JWT_SECRET = process.env.JWT_SECRET || 'clave_respaldo'; 

//Registro de pacientes
export const registrarPaciente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, dni, fechaNacimiento, email, password } = req.body;

        //Validar campos
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            res.status(400).json({ mensaje: 'Ya existe un usuario con ese email' });
            return;
        }

        //Crear ficha médica del paciente
        const nuevoPaciente = new Paciente({
            nombre,
            apellido,
            dni,
            fechaNacimiento,
        });
        await nuevoPaciente.save();

        //Crear usuario para login
        const nuevoUsuario = new Usuario({
            email,
            password,
            rol: 'Paciente',
            referenciaId: nuevoPaciente._id
        });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Paciente registrado exitosamente' });
    } 
    
    catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar paciente', error });
    }
};

//Registro de médicos
export const registrarMedico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellido, matricula, especialidad, email, password } = req.body;
        
        //Validar campos
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            res.status(400).json({ mensaje: 'Ya existe un usuario con ese email' });
            return;
        }

        //Crear ficha del médico
        const nuevoMedico = new Medico({
            nombre,
            apellido,
            matricula,
            especialidad
        });
        await nuevoMedico.save();

        //Crear usuario para login
        const nuevoUsuario = new Usuario({
            email,
            password,
            rol: 'Medico',
            referenciaId: nuevoMedico._id
        });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Médico registrado exitosamente' });
    }

    catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar médico', error });
    }
};

//Login único para todos (Paciente, Médico, Administrador)
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        //Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }

        //Verificar contraseña
        const passwordValida = await (usuario as any).compararPassword(password);
        if (!passwordValida) {
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }

        //Generar token JWT
        const token = jwt.sign({
            idUsuario: usuario._id,
            rol: usuario.rol,
            referenciaId: usuario.referenciaId
        },
        JWT_SECRET,
        { expiresIn: '8h' }); //Token válido por 8 horas

        res.status(200).json({ 
            mensaje: 'Login exitoso',
            token: token,
            rol: usuario.rol
        });
    }

    catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
    }
};
