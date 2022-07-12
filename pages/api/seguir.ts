import { NextApiResponse, NextApiRequest } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { SeguidorModel } from "../../models/SeguidorModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

const endpointSeguir = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      // Usuário logado/autenticado = quem esta fazendo as ações
      const { userId, id } = req?.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ erro: "Usuário logado não encontrado" });
      }
      // Id do usuário a ser seguido - query
      const usuarioAserSeguido = await UsuarioModel.findById(id);
      if (!usuarioAserSeguido) {
        return res
          .status(400)
          .json({ erro: "Usuário a ser seguido não encontrado" });
      }
      // Buscar se EU LOGADO sigo ou não esse usuário
      const euJaSigoEsseUsuario = await SeguidorModel.find({
        usuarioId: usuarioLogado._id,
        usuarioSeguidoId: usuarioAserSeguido._id,
      });
      if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
        euJaSigoEsseUsuario.forEach(
          async (e: any) =>
            await SeguidorModel.findByIdAndDelete({ _id: e._id })
        );
        usuarioLogado.seguindo--;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        );

        usuarioAserSeguido.seguidores--;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioAserSeguido._id },
          usuarioAserSeguido
        );

        return res
          .status(200)
          .json({ msg: "Deixou de seguir o usuário com sucesso." });
      } else {
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioSeguidoId: usuarioAserSeguido._id,
        };
        await SeguidorModel.create(seguidor);

        usuarioLogado.seguindo++;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        );

        usuarioAserSeguido.seguidores++;
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioAserSeguido._id },
          usuarioAserSeguido
        );
        return res.status(200).json({ msg: "Usuário seguido com sucesso" });
      }
    }
    return res.status(405).json({ erro: "Método informado não existe." });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Não foi possível seguir/deseguir o usuário informado." });
  }
};

export default validarTokenJWT(conectarMongoDB(endpointSeguir));
