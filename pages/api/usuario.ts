import { UsuarioModel } from "./../../models/UsuarioModel";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";

const handler = nc()
  .use(upload.single("avatar"))
  .put(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);

      if (!usuario) {
        return res.status(400).json({ erro: "Usuário não encontrado." });
      }

      const { nome } = req.body;
    } catch (e) {
      console.log(e);
    }
    return res
      .status(400)
      .json({ erro: "Não foi possível atualizar usuário." });
  });

const usuarioEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>
) => {
  try {
    const { userId } = req?.query;
    const usuario = await UsuarioModel.findById(userId);
    usuario.senha = null;
    return res.status(200).json(usuario);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ erro: "Não foi possível obter dados do usuário" });
  }
};

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));
