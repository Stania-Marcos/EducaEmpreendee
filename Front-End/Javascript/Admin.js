// Seletores dos elementos do formulário
const postForm = document.getElementById('post-form');
const imageInput = document.getElementById('post-image');
const imageUploadArea = document.getElementById('image-upload-area');
const imagePreview = document.getElementById('image-preview');

// Esconde a pré-visualização inicialmente
imagePreview.style.display = 'none';

// Ao clicar na área de upload, abre o seletor de arquivos
imageUploadArea.addEventListener('click', () => {
  imageInput.click();
});

// Quando o usuário seleciona uma imagem, mostra a pré-visualização
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = '#';
    imagePreview.style.display = 'none';
  }
});

// Envio do formulário para o backend
postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(postForm);

  try {
    const response = await fetch('http://localhost:3000/criar-post', { 
      method: 'POST',
      body: formData
    });
    // Cria ou reutiliza o modal de feedback
    let feedbackModal = document.getElementById('feedback-modal');
    if (!feedbackModal) {
      feedbackModal = document.createElement('div');
      feedbackModal.id = 'feedback-modal';
      feedbackModal.style.position = 'fixed';
      feedbackModal.style.top = '0';
      feedbackModal.style.left = '0';
      feedbackModal.style.width = '100vw';
      feedbackModal.style.height = '100vh';
      feedbackModal.style.background = 'rgba(0,0,0,0.4)';
      feedbackModal.style.display = 'none';
      feedbackModal.style.justifyContent = 'center';
      feedbackModal.style.alignItems = 'center';
      feedbackModal.style.zIndex = '1001';

      const feedbackDialog = document.createElement('div');
      feedbackDialog.id = 'feedback-dialog';
      feedbackDialog.style.background = '#fff';
      feedbackDialog.style.padding = '24px 32px';
      feedbackDialog.style.borderRadius = '8px';
      feedbackDialog.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
      feedbackDialog.style.textAlign = 'center';

      feedbackModal.appendChild(feedbackDialog);
      document.body.appendChild(feedbackModal);
    }
    const feedbackDialog = feedbackModal.querySelector('#feedback-dialog');
    if (response.ok) {
      feedbackDialog.innerHTML = `
      <p style="margin-bottom: 20px;">Post enviado com sucesso!</p>
      <button id="feedback-ok-btn" style="padding: 6px 18px;">OK</button>
      `;
      postForm.reset();
      imagePreview.src = '#';
      imagePreview.style.display = 'none';
    } else {
      feedbackDialog.innerHTML = `
      <p style="margin-bottom: 20px;">Erro ao enviar o post.</p>
      <button id="feedback-ok-btn" style="padding: 6px 18px;">OK</button>
      `;
    }
    feedbackModal.style.display = 'flex';
    feedbackDialog.querySelector('#feedback-ok-btn').onclick = () => {
      feedbackModal.style.display = 'none';
    };
    
  } catch (error) {
    alert('Erro de conexão com o servidor.');
  }
});


// Seleciona o botão de cancelar
const cancelButton = document.getElementById('cancel-button');

// Cria o modal de confirmação
const modal = document.createElement('div');
modal.id = 'confirm-cancel-modal';
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100vw';
modal.style.height = '100vh';
modal.style.background = 'rgba(0,0,0,0.4)';
modal.style.display = 'none';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.zIndex = '1000';

const dialog = document.createElement('div');
dialog.style.background = '#fff';
dialog.style.padding = '24px 32px';
dialog.style.borderRadius = '8px';
dialog.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
dialog.style.textAlign = 'center';
dialog.innerHTML = `
  <p style="margin-bottom: 20px;">Deseja realmente cancelar?</p>
  <button id="modal-confirm-yes" style="margin-right: 12px; padding: 6px 18px;">Sim</button>
  <button id="modal-confirm-no" style="padding: 6px 18px;">Não</button>
`;

modal.appendChild(dialog);
document.body.appendChild(modal);

// Função para abrir o modal
function openModal() {
  modal.style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
  modal.style.display = 'none';
}

// Evento do botão cancelar
function isFormDirty() {
  // Verifica campos de texto, textarea e selects
  const inputs = postForm.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select');
  for (const input of inputs) {
    // Para input file, verifica se algum arquivo foi selecionado
    if (input.type === 'file') {
      if (input.files && input.files.length > 0) return true;
    } else if (input.value.trim() !== '') {
      return true;
    }
  }
  return false;
}

// Evento do botão cancelar
cancelButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (isFormDirty()) {
    openModal();
  }
  // Se não houver dados inseridos, não faz nada
});
// Evento dos botões do modal
modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal-confirm-yes') {
    postForm.reset();
    imagePreview.src = '#';
    imagePreview.style.display = 'none';
    closeModal();
  } else if (e.target.id === 'modal-confirm-no') {
    closeModal();
  }
});
function openTab(tabId) {
  // Esconde todas as abas
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
    tab.style.display = 'none';
  });
  // Remove/Adiciona classes nos botões
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('inactive');
  });
  // Mostra a aba selecionada
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add('active');
    selectedTab.style.display = 'block';
  }
  // Ativa o botão correspondente
  const tabButtons = document.querySelectorAll('.tab-button');
  if (tabId === 'add-post') {
    tabButtons[0].classList.add('active');
    tabButtons[0].classList.remove('inactive');
  } else if (tabId === 'manage-posts') {
    tabButtons[1].classList.add('active');
    tabButtons[1].classList.remove('inactive');
  }
}

// Inicializa: mostra apenas a aba de adicionar post
document.addEventListener('DOMContentLoaded', () => {
  openTab('add-post');
});

// Função para buscar e exibir os posts na tabela de gerenciamento
async function fetchAndRenderPosts(filter = "") {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '<tr><td colspan="4" style="text-align:center;">Carregando...</td></tr>';
  try {
    const response = await fetch('http://localhost:3000/api/blog');
    if (!response.ok) throw new Error('Erro ao buscar posts');
    let posts = await response.json();

    // Filtra posts pelo título (busca)
    if (filter) {
      const filterLower = filter.toLowerCase();
      posts = posts.filter(post => post.titulo.toLowerCase().includes(filterLower));
    }

    if (!posts.length) {
      postsList.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum post encontrado.</td></tr>';
      return;
    }

    postsList.innerHTML = '';
    posts.forEach((post) => {
      // Formata a data para dd/mm/yyyy
      const dateObj = new Date(post.data_publicacao);
      const dataFormatada = dateObj.toLocaleDateString('pt-BR');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${post.titulo}</td>
        <td class="px-6 py-4 whitespace-nowrap">${post.categoria}</td>
        <td class="px-6 py-4 whitespace-nowrap">${dataFormatada}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="edit-post-btn text-blue-600 hover:underline mr-4" data-id="${post.id}" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="delete-post-btn text-red-600 hover:underline" data-id="${post.id}" title="Excluir"><i class="fas fa-trash"></i></button>
        </td>
      `;
      // Salva o post original no elemento para fácil acesso
      tr.dataset.id = post.id; // ou post.data_publicacao, se for o identificador
      tr.dataset.titulo = post.titulo;
      tr.dataset.categoria = post.categoria;
      tr.dataset.conteudo = post.conteudo;
      tr.dataset.imagem = post.imagem || '';
      tr.dataset.dataPublicacao = post.data_publicacao;

      postsList.appendChild(tr);
    });
  } catch (err) {
    postsList.innerHTML = '<tr><td colspan="4" style="text-align:center;color:red;">Erro ao carregar posts.</td></tr>';
  }
}

// Busca dinâmica pelo título
document.querySelector('#manage-posts input[type="text"]').addEventListener('input', function() {
  fetchAndRenderPosts(this.value);
});

// Inicializa ao abrir a aba de gerenciamento
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', function() {
    if (this.getAttribute('data-tab') === 'manage-posts') {
      fetchAndRenderPosts();
    }
  });
});

// Delegação de eventos para editar/excluir
document.getElementById('posts-list').addEventListener('click', async function(e) {
const editBtn = e.target.closest('.edit-post-btn');
const deleteBtn = e.target.closest('.delete-post-btn');
if (!editBtn && !deleteBtn) return;

// Busca o tr correspondente ao botão clicado
const tr = e.target.closest('tr');
if (!tr) return;
const post = {
  id: tr.dataset.id,
  titulo: tr.dataset.titulo,
  categoria: tr.dataset.categoria,
  conteudo: tr.dataset.conteudo,
  imagem: tr.dataset.imagem,
  data_publicacao: tr.dataset.dataPublicacao,
};

// Editar post
if (editBtn) {
  openTab('add-post');
  document.getElementById('post-title').value = post.titulo;
  document.getElementById('post-category').value = post.categoria;
  document.getElementById('post-content').value = post.conteudo;
  if (post.imagem) {
    imagePreview.src = post.imagem;
    imagePreview.style.display = 'block';
  } else {
    imagePreview.src = '#';
    imagePreview.style.display = 'none';
  }
  postForm.dataset.editing = post.data_publicacao;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Excluir post
if (deleteBtn) {
  if (!window.deleteModal) {
    window.deleteModal = document.createElement('div');
    window.deleteModal.style.position = 'fixed';
    window.deleteModal.style.top = '0';
    window.deleteModal.style.left = '0';
    window.deleteModal.style.width = '100vw';
    window.deleteModal.style.height = '100vh';
    window.deleteModal.style.background = 'rgba(0,0,0,0.4)';
    window.deleteModal.style.display = 'none';
    window.deleteModal.style.justifyContent = 'center';
    window.deleteModal.style.alignItems = 'center';
    window.deleteModal.style.zIndex = '1002';
    const dialog = document.createElement('div');
    dialog.style.background = '#fff';
    dialog.style.padding = '24px 32px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
    dialog.style.textAlign = 'center';
    dialog.innerHTML = `
      <p style="margin-bottom: 20px;">Tem certeza que deseja excluir este post?</p>
      <button id="delete-confirm-yes" style="margin-right: 12px; padding: 6px 18px;">Sim</button>
      <button id="delete-confirm-no" style="padding: 6px 18px;">Não</button>
    `;
    window.deleteModal.appendChild(dialog);
    document.body.appendChild(window.deleteModal);
  }
  window.deleteModal.style.display = 'flex';

  // Adiciona listeners de forma segura (remove anteriores)
  const yesBtn = window.deleteModal.querySelector('#delete-confirm-yes');
  const noBtn = window.deleteModal.querySelector('#delete-confirm-no');
  yesBtn.onclick = async () => {
    try {
      const resp = await fetch(`http://localhost:3000/api/blog/${encodeURIComponent(post.data_publicacao)}`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        fetchAndRenderPosts();
      } else {
        const errText = await resp.text();
        alert('Erro ao excluir post: ' + errText);
      }
    } catch (err) {
      alert('Erro de conexão ao excluir post: ' + err.message);
    }
    window.deleteModal.style.display = 'none';
  };
  noBtn.onclick = () => {
    window.deleteModal.style.display = 'none';
  };
}
});

// Ao enviar o formulário, verifica se está editando
postForm.addEventListener('submit', async (event) => {
  if (postForm.dataset.editing) {
    event.preventDefault();
    const formData = new FormData(postForm);
    try {
      const resp = await fetch(`http://localhost:3000/api/blog/${encodeURIComponent(postForm.dataset.editing)}`, {
        method: 'PUT',
        body: formData
      });
      if (resp.ok) {
        fetchAndRenderPosts();
        postForm.dataset.editing = '';
      } else {
        const errText = await resp.text();
        alert('Erro ao atualizar post: ' + errText);
      }
    } catch (err) {
      alert('Erro ao atualizar post: ' + err.message);
    }
    return;
  }
  // ...restante do código do submit...
});
