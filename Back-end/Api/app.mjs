// server.mjs convertido para PostgreSQL
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.mjs";
import uploads from "./Config/multer.mjs";
import conexao from "./Config/server.mjs"; // já com Pool do PostgreSQL
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const router = express.Router();
const app = express();
const port = 4000;

app.use(cors({ origin: "http://127.0.0.1:5500" }));
dotenv.config({ path: "./config/.env" });
const SECRET_KEY = process.env.JWT_SECRET;
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));
app.use(express.static(path.join(__dirname, '../../Front-End')));

// Rotas para HTMLs
["Main2", "Main", "Admin", "blog", "diagnosticoEmpresarial", "InformacoesBlog", "index", "servicos", "confirmarEmail"].forEach(pagina => {
  app.get(`/${pagina}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, `../../Front-End/Html/${pagina}.html`));
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "educaempreende2024@gmail.com",
    pass: "ivxq eonm bjvi cngf",
  },
});

const codigosVerificacao = new Map();
function gerarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
function salvarCodigo(email, codigo) { codigosVerificacao.set(email, codigo); }
function pegarCodigoSalvo(email) { return codigosVerificacao.get(email); }
function limparCodigos() { codigosVerificacao.clear(); }
async function ativarUsuario(email) {
  await conexao.query("UPDATE usuarios SET ativo = 1 WHERE email = $1", [email]);
}

app.post("/api/cadastrar", async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;
  try {
    const { rows } = await conexao.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (rows.length > 0) return res.status(400).json({ mensagem: "E-mail já está cadastrado." });

    const senha_hash = await bcrypt.hash(senha, 10);
    await conexao.query(
      "INSERT INTO usuarios (nome, sobrenome, email, senha_hash, ativo) VALUES ($1, $2, $3, $4, 0)",
      [nome, sobrenome, email, senha_hash]
    );

    const codigoVerificacao = gerarCodigo();
    limparCodigos(); salvarCodigo(email, codigoVerificacao);

    await transporter.sendMail({
      from: "seuemail@gmail.com",
      to: email,
      subject: "Código de Verificação",
      text: `Seu código de verificação é: ${codigoVerificacao}`,
    });
    return res.status(200).json({ mensagem: "Código enviado para o e-mail" });
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
});

app.post("/api/verificar-codigo", async (req, res) => {
  const { email, codigo } = req.body;
  if (codigo === pegarCodigoSalvo(email)) {
    await ativarUsuario(email);
    codigosVerificacao.delete(email);
    res.status(200).json({ redirect: "/Main.html" });
  } else {
    res.status(400).json({ mensagem: "Código incorreto" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ mensagem: "Campos obrigatórios." });
  try {
    const { rows } = await conexao.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (rows.length === 0) return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });

    const usuario = rows[0];
    if (!usuario.ativo) return res.status(403).json({ mensagem: "Usuário não verificado." });

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });

    res.status(200).json({ mensagem: "Login bem-sucedido", redirect: "/Main.html" });
  } catch (err) {
    console.error("Erro login:", err);
    res.status(500).json({ mensagem: "Erro interno." });
  }
});

app.post('/sugestao', async (req, res) => {
  const { nome, email, categoria, conteudo } = req.body;
  if (!nome || !conteudo) return res.status(400).json({ mensagem: 'Nome e conteúdo obrigatórios.' });
  try {
    const sql = `INSERT INTO BlogSugestoes (nome_usuario, email, categoria, conteudo) VALUES ($1, $2, $3, $4)`;
    await conexao.query(sql, [nome, email, categoria, conteudo]);
    res.status(201).json({ mensagem: 'Sugestão enviada com sucesso!' });
  } catch (err) {
    console.error("Erro sugestão:", err.message);
    res.status(500).json({ mensagem: 'Erro ao salvar sugestão.' });
  }
});

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/criar-post', upload.single('imagem'), async (req, res) => {
  const { titulo, categoria, conteudo } = req.body;
  const imagem = req.file ? req.file.filename : null;
  if (!titulo || !categoria || !conteudo || !imagem)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  try {
    await conexao.query(
      `INSERT INTO blog (titulo, categoria, imagem, conteudo) VALUES ($1, $2, $3, $4)`,
      [titulo, categoria, imagem, conteudo]
    );
    res.status(200).json({ message: 'Post criado com sucesso!' });
  } catch (err) {
    console.error('Erro ao criar post:', err.message);
    res.status(500).json({ error: 'Erro ao criar o post.' });
  }
});

app.get('/api/blog', async (req, res) => {
  try {
    const { rows } = await conexao.query('SELECT titulo,categoria,imagem,conteudo,data_publicacao FROM blog ORDER BY data_publicacao DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao buscar posts:', err.message);
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
});

app.use("/api/usuarios", userRoutes);
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout bem-sucedido" });
});

app.post("/uploads", uploads.single("logo"), uploads.single("media"), uploads.single("fotoPerfil"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Nenhum arquivo enviado" });
  res.status(200).json({ message: "Arquivo enviado com sucesso", file: req.file });
});

app.get("/dashboard", (req, res) => {
  const token = req.cookies.authToken || req.query.token;
  if (!token) return res.status(401).json({ message: "Token não encontrado." });
  try {
    jwt.verify(token, SECRET_KEY);
    res.send("<h1>Bem-vindo ao Dashboard</h1><p>Seu e-mail foi confirmado!</p>");
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
});

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

app.listen(port, (erro) => {
  if (erro) {
    console.log("Falha ao iniciar o servidor");
  } else {
    console.log(`Servidor iniciado com sucesso na porta ${port}`);
  }
});
