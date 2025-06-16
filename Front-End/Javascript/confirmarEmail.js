// Simulação do envio do formulário de recuperação
document
  .getElementById("recovery-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Esconde a página de recuperação
    document.getElementById("recovery-page").classList.add("hidden");

    // Mostra a página de confirmação
    document.getElementById("confirmation-page").classList.remove("hidden");

    // Simula um atraso no envio do e-mail
    setTimeout(() => {
      // Aqui você poderia adicionar o código real para enviar o e-mail
      console.log(
        "E-mail de recuperação enviado para:",
        document.querySelector('#recovery-form input[type="email"]').value
      );
    }, 1000);
  });

// Se houver um parâmetro de token na URL, mostra diretamente a página de confirmação
if (window.location.search.includes("token")) {
  document.getElementById("recovery-page").classList.add("hidden");
  document.getElementById("confirmation-page").classList.remove("hidden");
}
