import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

export const Autenticar = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Captura o token do cabeçalho

  if (!token) {
    return res.status(403).json({ message: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    req.user = decoded; // Salva o usuário decodificado no objeto de requisição
    console.log("Usuário autenticado:", req.user); // Adiciona um log para verificação (lembre-se de remover logs sensíveis em produção)
    next(); // Chama o próximo middleware ou a função final
  });
};
