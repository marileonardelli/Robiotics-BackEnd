import mongoose, {Schema, Document} from "mongoose";

export interface IEstudio extends Document {
    paciente: mongoose.Types.ObjectId;
    medicoSolicitante: mongoose.Types.ObjectId; //Medico que firma la orden
    medicoRealizador?: mongoose.Types.ObjectId; //Medico que realiza el estudio (puede ser el mismo que el solicitante o diferente)
    turnoAsignado?: mongoose.Types.ObjectId; //Turno que saca el paciente para realizar estudio
    tipoEstudio: string; //Ej: Radiografía, Ecografía, Resonancia, Análisis de Sangre, etc.
    fechaSolicitud: Date;
    resultado?: string; //Resultado del estudio: texto o link a PDF de resultado
    estado: string; //Pendiente, Completado
}

const EstudioSchema: Schema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El paciente es obligatorio']
    },
    medicoSolicitante: {
        type: Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El médico solicitante es obligatorio']
    },
    medicoRealizador: {
        type: Schema.Types.ObjectId,
        ref: 'Medico'
    },
    turnoAsignado: {
        type: Schema.Types.ObjectId,
        ref: 'Turno'
    },
    tipoEstudio: {
        type: String,
        required: [true, 'El tipo de estudio es obligatorio']
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    },
    resultado: {
        type: String
    },
    estado: {
        type: String,
        enum: ['Orden Generada', 'Turno Asignado', 'Completado'],
        default: 'Orden Generada'
    }
}, {
    timestamps: true
});

export default mongoose.model<IEstudio>('Estudio', EstudioSchema);