import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import conexao from "../../config/server.mjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

export const loginUsuario = async (req, res) => {
  const SECRET_KEY = process.env.JWT_SECRET;
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const [rows] = await conexao.execute(
      "SELECT * FROM  conta WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email não cadastrado" });
    }

    const usuario = rows[0];

    // Verificação de email pendente
    if (!usuario.email_verificado) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      await conexao.execute(
        "UPDATE conta SET codigo_verificacao = ?, codigo_expiracao = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?",
        [verificationCode, email]
      );

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Código de Verificação ",
        text: `Seu código de verificação é: ${verificationCode}. O código expira em 10 minutos.`,
      };

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Código de verificação enviado para o seu email.",
      });
    }

    // Verificação de senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(400).json({ message: "Senha inválida" });
    }

    // Geração do token
    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: "1h" });

    // Definir o token no cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Usar true em produção com HTTPS
      maxAge: 3600 * 1000, // 1 hora de validade
      sameSite: "Strict", // Recomendado para segurança
    });

    // Retorno de resposta de sucesso
    res.json({
      message: "Login bem-sucedido",
      token,
      emailVerificado: usuario.email_verificado,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
