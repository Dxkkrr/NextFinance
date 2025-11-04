// Inicializa Supabase
const supabaseUrl = 'https://stteovqzicerfmzqolxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dGVvdnF6aWNlcmZtenFvbHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNDY5MTYsImV4cCI6MjA3NzYyMjkxNn0.KbulVaPNTVjfhzJ0khDC6MeIA4bXVI6qavdXgmhEVi0';
const db = supabase.createClient(supabaseUrl, supabaseKey);

// Valida campos do formulário
function validarCampos(nome, email, senha) {
  if (!nome.trim()) return 'Preencha o campo Nome.';
  if (!email.trim()) return 'Preencha o campo Email.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido!';
  if (!senha || senha.length < 6) return 'A senha deve ter ao menos 6 caracteres!';
  return null;
}

// Cadastro do Cliente
async function cadastrar() {
  const nome = document.getElementById('Nome').value.trim();
  const email = document.getElementById('Email').value.trim();
  const senha = document.getElementById('Senha').value;
  const msg = document.getElementById('mensagem');

  msg.textContent = '';
  msg.style.color = 'red';

  const erroValid = validarCampos(nome, email, senha);
  if (erroValid) {
    msg.textContent = erroValid;
    return;
  }

  try {
    const { data: existente, error: erroBusca } = await db
      .from('clientes')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (erroBusca) throw erroBusca;
    if (existente.length > 0) {
      msg.textContent = 'Cadastro já existente com este Email';
      return;
    }

    const { error } = await db
      .from('clientes')
      .insert([{ nome, email, senha }]);

    if (error) throw error;

    msg.style.color = 'green';
    msg.textContent = 'Cadastro feito com sucesso! Redirecionando...';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);

  } catch (err) {
    msg.textContent = 'Erro: ' + err.message;
  }
}

// Event listener no botão de cadastro
document.getElementById('btnCadastrar')?.addEventListener('click', cadastrar);


// Login do Cliente
async function login() {
  const email = document.getElementById('EmailLogin').value.trim();
  const senha = document.getElementById('SenhaLogin').value;
  const msg = document.getElementById('mensagemLogin');

  msg.textContent = '';
  msg.style.color = 'red';

  if (!email) {
    msg.textContent = 'Preencha o campo Email.';
    return;
  }

  if (!senha) {
    msg.textContent = 'Preencha o campo Senha.';
    return;
  }

  try {
    const { data: cliente, error } = await db
      .from('clientes')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!cliente) {
      msg.textContent = 'Cadastro não encontrado. Faça seu cadastro primeiro.';
      return;
    }

    if (cliente.senha !== senha) {
      msg.textContent = 'Senha incorreta.';
      return;
    }

    msg.style.color = 'green';
    msg.textContent = 'Login efetuado com sucesso! Redirecionando...';

    setTimeout(() => {
      window.location.href = 'initpage.html';
    }, 1500);

  } catch (err) {
    msg.textContent = 'Erro: ' + err.message;
  }
}

// Event listener no botão de login
document.getElementById('btnLogin')?.addEventListener('click', login);
