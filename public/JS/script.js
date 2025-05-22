document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.body; // ✅ Mude de documentElement para body (já que data-theme está no <body>)

  // Carrega tema salvo ou padrão
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme); // Aplica o tema ao carregar
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  // Alternar tema ao clicar
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
  });
});

  // Função para atualizar ícone + texto
  /*function updateThemeUI(theme) {
    if (theme === "dark") {
      themeIcon.textContent = "☀️";
      themeText.textContent = "Modo Claro";
    } else {
      themeIcon.textContent = "🌙";
      themeText.textContent = "Modo Escuro";
    }
  }
});

/*function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'; 
  localStorage.setItem('theme', theme);
}//*
  
  /*document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  
  // Função para aplicar todas as mudanças de tema
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'; 
    localStorage.setItem('theme', theme);
    
    // Atualiza ícones dinamicamente
    document.querySelectorAll('.icon-location, .icon-search').forEach(icon => {
      icon.style.filter = theme === 'dark' ? 'invert(1)' : 'none';
    });
    
    // Atualiza o dropdown arrow
    const arrowColor = theme === 'dark' ? 'cccccc' : '333333';
    document.querySelectorAll('select').forEach(select => {
      select.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23${arrowColor}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;
    });
  }
  
  // Carrega tema salvo ou padrão
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  
  // Listener do botão
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
});*/