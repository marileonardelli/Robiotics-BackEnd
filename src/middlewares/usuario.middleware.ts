import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_respaldo';

export interface UsuRequest extends Request {
    usuario?: any;
}

//Revisa que sea token válido
export const verificarToken = (req: UsuRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1]; //Token enviado como "Bearer token"

    if (!token) {
        res.status(401).json({ mensaje: 'Acceso denegado. No hay token de seguridad.' });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        //Guardar datos usuario en req para usar en rutas protegidas
        req.usuario = payload;
        next();
    }

    catch (error) {
        res.status(400).json({ mensaje: 'Token no válido', error });
    }
};

//Revisar que sea Administrador
export const esAdmin = (req: UsuRequest, res: Response, next: NextFunction): void => {
    if (req.usuario?.rol !== 'Administrador') {
        res.status(403).json({ mensaje: 'Acceso denegado. Requiere rol de Administrador.' });
        return;
    }
    next();
};