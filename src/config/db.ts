import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Conectado a: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a MongoDB: `, error);
        process.exit(1); //Si falla la BD, detener servidor por seguridad
    }
};