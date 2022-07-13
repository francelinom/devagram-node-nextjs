import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import NextCors from "nextjs-cors";

export const politicaCORS =
  (hander: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
        optionsSuccessStatus: 200,
      });
      return hander(req, res);
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ erro: "Erro ao tratar a politica de CORS" });
    }
  };
