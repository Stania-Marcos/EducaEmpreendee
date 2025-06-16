import conexao from "../../config/server.mjs";

// Rota para verificar o código de e-mail
export const emailVerification = async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res
      .status(400)
      .json({ message: "Código de verificação é obrigatório." });
  }
  console.log(codigo);

  try {
    const query = "SELECT * FROM conta WHERE codigo_verificacao = ?";
    const [results] = await conexao.execute(query, [codigo]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.log(results);

    const usuario = results[0];
    console.log("Código recebido:", codigo);
    console.log("Código armazenado no banco:", usuario.codigo_verificacao);

    // Verifica se o código inserido corresponde ao código de verificação do usuário
    if (parseInt(usuario.codigo_verificacao) === parseInt(codigo)) {
      const updateQuery = "UPDATE conta SET email_verificado = 1 WHERE id = ?";
      await conexao.execute(updateQuery, [usuario.id]);

      return res.status(200).json({
        message: "E-mail verificado com sucesso.",
        emailVerificado: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Código de verificação inválido." });
    }
  } catch (error) {
    console.error("Erro ao verificar o código de verificação:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
