import mongoose, {Schema, Document} from "mongoose";

export interface IPaciente extends Document {
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: Date;
    edad: number;
    email: string;
    activo: boolean;
}

const PacienteSchema: Schema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    apellido: {
        type: String,
        required: [true, "El apellido es obligatorio"]
    },
    dni: {
        type: String,
        required: [true, "El DNI es obligatorio"],
        unique: true
    },
    fechaNacimiento: {
        type: Date,
        required: [true, "La fecha de nacimiento es obligatoria"]
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
    timestamps: true, //Agrega createdAt y updatedAt automáticamente
    //Incluye virtuals de Mongoose para calcular edad a partir de fechaNacimiento
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// Virtual para calcular edad
PacienteSchema.virtual('edad').get(function(this: IPaciente) {
    if (!this.fechaNacimiento) return null;

    const hoy = new Date();
    let edadCalculada = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const diferenciaMeses = hoy.getMonth() - this.fechaNacimiento.getMonth();

    // Si no pasó el mes de cumpleaños o si es el mes pero no el día aún
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < this.fechaNacimiento.getDate())) {
        edadCalculada--;
    }

    return edadCalculada;
});

export default mongoose.model<IPaciente>('Paciente', PacienteSchema);
