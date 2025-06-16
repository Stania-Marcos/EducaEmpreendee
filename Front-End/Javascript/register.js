const form = document.querySelector("#register form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = form.querySelector('input[placeholder="Seu nome"]').value;
  const sobrenome = form.querySelector(
    'input[placeholder="Seu sobrenome"]'
  ).value;
  const email = form.querySelector('input[placeholder="seu@email.com"]').value;
  const senha = form.querySelector('input[placeholder="Crie uma senha"]').value;
  const confirmar = form.querySelector(
    'input[placeholder="Confirme sua senha"]'
  ).value;

  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/Api/Usuarios/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, email, senha }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Usuário registrado com sucesso!");
      form.reset();
    } else {
      alert(data.mensagem || "Erro ao registrar");
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor");
    console.error(error);
  }
});
