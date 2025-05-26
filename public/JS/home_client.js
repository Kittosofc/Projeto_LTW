document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.notifications-container');
  const expandBtn = document.querySelector('.notifications-minimized .expand-btn');
  const closeBtn = document.querySelector('.notifications-expanded .close-btn');
  
  if (expandBtn) {
    expandBtn.addEventListener('click', function() {
      container.classList.add('expanded');
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      container.classList.remove('expanded');
    });
  }

 // Novo código para alternar entre Geral/Serviços
  const geralLink = document.querySelector('.main-menu .has-submenu a.active');
  const servicosLink = document.querySelector('.main-menu li.has-submenu:nth-child(2) a'); // Segundo item do menu
  const mainContent = document.querySelector('.main');

  if (servicosLink) {
    servicosLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Atualiza estado ativo do menu
      geralLink.classList.remove('active');
      this.classList.add('active');
      
      // Esconde notificações e mostra conteúdo branco
      if (container) {
        container.style.display = 'none';
      }
      mainContent.style.backgroundColor = '#fff';
      mainContent.innerHTML = `
        <header class="header">
          <div class="location-wrapper">
            <img src="IMG/location-icon.png" alt="Localização" class="icon-location">
            <select>
              <option selected>Medianeira, PR</option>
              <option>São Paulo, SP</option>
              <option>Rio de Janeiro, RJ</option>
              <option>Outros...</option>
            </select>
          </div>
          <div class="search-bar">
            <input type="text" placeholder="Pesquisar...">
            <img src="IMG/search-icon.png" alt="Pesquisar" class="icon-search">
          </div>
        </header>
        <div class="services-content">
          <h3>Serviços</h3>
          <!-- Adicione aqui o conteúdo específico de serviços -->
        </div>
      `;
    });
  }

  if (geralLink) {
    geralLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Atualiza estado ativo do menu
      document.querySelectorAll('.main-menu li.has-submenu a').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
      
      // Mostra notificações e restaura conteúdo
      if (container) {
        container.style.display = 'block';
        container.classList.remove('expanded'); // Garante que comece recolhido
      }
      mainContent.style.backgroundColor = '';
      mainContent.innerHTML = `
        <header class="header">
          <div class="location-wrapper">
            <img src="IMG/location-icon.png" alt="Localização" class="icon-location">
            <select>
              <option selected>Medianeira, PR</option>
              <option>São Paulo, SP</option>
              <option>Rio de Janeiro, RJ</option>
              <option>Outros...</option>
            </select>
          </div>
          <div class="search-bar">
            <input type="text" placeholder="Pesquisar...">
            <img src="IMG/search-icon.png" alt="Pesquisar" class="icon-search">
          </div>
        </header>
      `;
    });
  }
});