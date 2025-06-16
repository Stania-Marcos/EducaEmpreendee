import express from "express";
/*import { cadastrarUsuario } from "../Controllers/cadastroElogin/UserControlers.mjs";
import { loginUsuario } from "../Controllers/cadastroElogin/Userlogin.mjs";
import { confirmarEmail } from "../Controllers/cadastroElogin/confirmarEmail.mjs";*/
import { Autenticar } from "../Midleware/auth.mjs";

const router = express.Router();

// **Cadastro e Login**
//router.post("/register", cadastrarUsuario);
//router.post("/login", loginUsuario);
//router.post("/email verification", confirmarEmail);

// **Autenticação**
router.use(Autenticar);

export default router;
