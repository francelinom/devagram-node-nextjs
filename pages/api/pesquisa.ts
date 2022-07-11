import { UsuarioModel } from "./../../models/UsuarioModel";
import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

const pesquisaEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any[]>
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuarioEncrontrado = await UsuarioModel.findById(req?.query?.id);
        if (!usuarioEncrontrado) {
          return res.status(400).json({ erro: "Usuário não encontrado." });
        }
        usuarioEncrontrado.senha = null;
        return res.status(200).json(usuarioEncrontrado);
      } else {
        const { filtro } = req.query;
        if (!filtro || filtro.length < 2) {
          return res
            .status(400)
            .json({ erro: "Favor informar no mínimo 2 caracteres." });
        }
        const usuariosEncontrados = await UsuarioModel.find({
          $or: [
            { nome: { $regex: filtro, $options: "i" } },
            { email: { $regex: filtro, $options: "i" } },
          ],
        });
        usuariosEncontrados[0].senha = null;
        return res.status(200).json(usuariosEncontrados);
      }
    }
    return res.status(400).json({ erro: "Médoto não é válido." });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Não foi possível buscar usuário" + e });
  }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
