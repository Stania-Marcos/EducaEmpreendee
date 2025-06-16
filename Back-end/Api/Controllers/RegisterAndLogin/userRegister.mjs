import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import conexao from "../../config/server.mjs"; // Importa a conexão com o banco

// funcao para cadastrar um novo usuário

export const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se todos os campos foram enviadoss
  if (!nome || !email || !senha) {
    console.log("Erro: Dados incompletos", req.body); // Log para ajudar no debug
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    // Verificando se o email já existe
    const [rows] = await conexao.execute(
      "SELECT * FROM conta WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email já cadastrado!" });
    }

    // Criptografando a senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Inserção no banco de dados
    const query =
      "INSERT INTO conta (nome, email, senha_hash) VALUES (?, ?, ?)";
    const [result] = await conexao.execute(query, [nome, email, hashedSenha]);

    // Sucesso
    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      id: result.insertId,
    });
  } catch (error) {
    // Caso ocorra um erro inesperado
    console.error("Erro do servidor:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
