console.log("Script Blog.js carregado");  // Teste de execução

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const categoria = form.querySelector("select").value.trim();
  const conteudo = form.querySelector("textarea").value.trim();

  try {
    const res = await fetch("http://localhost:3000/sugestao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, categoria, conteudo }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ " + data.mensagem);
      form.reset();
    } else {
      alert("⚠️ Erro: " + data.mensagem);
    }
  } catch (err) {
    console.error("❌ Erro de rede ou servidor:", err);
    alert("❌ Erro ao enviar sugestão. Tente novamente.");
  }
});
