import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Configuração da conexão PostgreSQL
const conexao = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // IMPORTANTE na Render
});


conexao
  .connect()
  .then(() => {
    console.log("✅ Conexão com o PostgreSQL realizada com sucesso");
  })
  .catch((erro) => {
    console.error("❌ Erro ao conectar com o PostgreSQL:", erro.message);
  });

export default conexao;
