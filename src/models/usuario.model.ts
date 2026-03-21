import mongoose, {Schema, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
    email: string;
    password: string;
    rol: string; //Paciente, Medico, Administrador
    referenciaId?: mongoose.Types.ObjectId; //Referencia al ID del Paciente o Medico asociado
}

const UsuarioSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        enum: ['Paciente', 'Medico', 'Administrador'],
        required: [true, 'El rol es obligatorio']
    },
    referenciaId: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true
});

//Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function(this:any, next: any) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }

    catch (error) {
        next(error);    
}
});

//Compara contraseña ingresada con la almacenada en la base de datos
UsuarioSchema.methods.compararPassword = async function(passwordIngresada: string): Promise<boolean> {
    return await bcrypt.compare(passwordIngresada, this.password);
};

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);