import mongoose, { Schema } from "mongoose";

const UsuarioSchema = new Schema({
  nome: { type: String, requerid: true },
  email: { type: String, requerid: true },
  senha: { type: String, requerid: true },
  avatar: { type: String, requerid: false },
  seguidores: { type: Number, default: 0 },
  seguindo: { type: Number, default: 0 },
  publicacoes: { type: Number, default: 0 },
});

export const UsuarioModel =
  mongoose.models.usuarios || mongoose.model("usuarios", UsuarioSchema);
