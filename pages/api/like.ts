import { NextApiResponse, NextApiRequest } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { politicaCORS } from "../../middlewares/politicaCORS";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

const likeEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const { id } = req?.query;
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ erro: "Publicação não existe" });
      }
      const { userId } = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ erro: "Usuário não encontrado." });
      }
      const indexDoUsuarioNoLike = publicacao.likes.findIndex(
        (e: any) => e.toString() === usuario._id.toString()
      );
      if (indexDoUsuarioNoLike != -1) {
        publicacao.likes.splice(indexDoUsuarioNoLike, 1);
        await PublicacaoModel.findByIdAndUpdate(
          { _id: publicacao._id },
          publicacao
        );
        return res
          .status(200)
          .json({ msg: "Publicação descurtida com sucesso" });
      } else {
        publicacao.likes.push(usuario._id);
        await PublicacaoModel.findByIdAndUpdate(
          { _id: publicacao._id },
          publicacao
        );
        return res.status(200).json({ msg: "Publicação curtida com sucesso" });
      }
    }
    return res.status(405).json({ erro: "Método não é válido." });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ erro: "Erro " });
  }
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));
