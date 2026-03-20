import mongoose, {Schema, Document} from 'mongoose';

export interface ITurno extends Document {
    paciente: mongoose.Types.ObjectId;
    medico: mongoose.Types.ObjectId;
    fechaHora: Date;
    tipo: string; //Consulta, Estudio, Intervención
    estado: string; //Pendiente, Confirmado, Completado, Cancelado
    notasMedico?: string;
}

const TurnoSchema: Schema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El paciente es obligatorio']
    },
    medico: {
        type: Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El médico es obligatorio']
    },
    fechaHora: {
        type: Date,
        required: [true, 'La fecha y hora son obligatorias']
    },
    tipo: {
        type: String,
        enum: ['Consulta', 'Estudio', 'Intervención'],
        required: [true, 'El tipo de turno es obligatorio']
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'],
        required: [true, 'El estado del turno es obligatorio'],
        default: 'Pendiente' //Todo turno empieza como Pendiente
    },
    notasMedico: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model<ITurno>('Turno', TurnoSchema);