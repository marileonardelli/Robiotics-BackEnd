import mongoose, {Schema, Document} from "mongoose";

export interface IMedico extends Document {
    nombre: string;
    apellido: string;
    matricula: string;
    especialidad: string;
    email: string;
    activo: boolean;
}

const MedicoSchema: Schema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    apellido: {
        type: String,
        required: [true, "El apellido es obligatorio"]
    },
    matricula: {
        type: String,
        required: [true, "La matrícula es obligatoria"],
        unique: true
    },
    especialidad: {
        type: String,
        required: [true, "La especialidad es obligatoria"]
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IMedico>('Medico', MedicoSchema);
