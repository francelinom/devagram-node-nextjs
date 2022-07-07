import type { NextApiRequest, NextApiResponse } from "next";
import type { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";

const endpointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;
    if (login === "admin@admin.com" && senha === "admin") {
      return res.status(200).json({ msg: "Usuário autenticado com sucesso." });
    }
    return res.status(405).json({ erro: "Usuário ou Senha não encontrado." });
  }
  return res.status(405).json({ erro: "Metodo informado não é válido." });
};

export default conectarMongoDB(endpointLogin);
