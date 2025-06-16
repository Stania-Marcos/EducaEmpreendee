function openTab(tabName) {
  // Hide all tab contents
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
    tabContents[i].classList.add("hidden");
  }

  // Remove active class from all tab buttons
  const tabButtons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
    tabButtons[i].classList.add("inactive");
  }

  // Show the current tab and mark button as active
  document.getElementById(tabName).classList.remove("hidden");
  document.getElementById(tabName).classList.add("active");

  // Find the button that was clicked and mark it as active
  const clickedButton = Array.from(tabButtons).find((button) =>
    button.getAttribute("onclick").includes(tabName)
  );
  if (clickedButton) {
    clickedButton.classList.remove("inactive");
    clickedButton.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register form");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = registerForm.querySelector("input[placeholder='Seu nome']").value;
    const sobrenome = registerForm.querySelector("input[placeholder='Seu sobrenome']").value;
    const email = registerForm.querySelector("input[placeholder='seu@email.com']").value;
    const senha = registerForm.querySelector("input[placeholder='Crie uma senha']").value;
    const confirmar = registerForm.querySelector("input[placeholder='Confirme sua senha']").value;

    if (senha !== confirmar) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Código de verificação enviado ao seu e-mail!");

        // Oculta o formulário de cadastro
        registerForm.style.display = "none";

        // Cria dinamicamente o formulário de verificação
        const verificacaoDiv = document.createElement("div");
        verificacaoDiv.id = "verificacao";
        verificacaoDiv.innerHTML = `
          <p>Digite o código de 4 dígitos enviado para seu e-mail:</p>
          <input type="text" id="codigoInput" maxlength="4" autocomplete="off" placeholder="1234" style="border:1px solid black;" />
          <button id="verificarBtn" style="border:2px solid blue; padding:10px; border-radius: 5px;">Verificar</button>
        `;
        document.querySelector("#register").appendChild(verificacaoDiv);

        document.getElementById("verificarBtn").addEventListener("click", async () => {
          const codigo = document.getElementById("codigoInput").value;

          const resposta = await fetch("http://localhost:4000/api/verificar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, codigo }),
          });

          const resultado = await resposta.json();

            if (resposta.ok) {
            alert("Verificação concluída com sucesso!");
            window.location.href = "Main.html";
          } else {
            alert(resultado.mensagem || "Código incorreto.");
          }
        });

      } else {
        alert(data.mensagem || "Erro ao cadastrar.");
      }
    } catch (err) {
     // console.error("Erro de conexão:", err);
    }
  });
});

document.getElementById("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        // Login bem-sucedido — redirecionar
        window.location.href = resultado.redirect;
      } else {
        // Mostrar erro na tela
        document.getElementById("mensagemErro").textContent = resultado.mensagem;
      }
    } catch (erro) {
      console.error("Erro ao tentar fazer login:", erro);
      document.getElementById("mensagemErro").textContent = "Erro de conexão com o servidor.";
    }
  });

