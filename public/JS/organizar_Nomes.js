let ordemCrescente = true;

function ordenarFuncionariosPorNome() {
  const container = document.querySelector('.employee-table');
  const funcionarios = Array.from(container.querySelectorAll('.employee-row'));

  funcionarios.sort((a, b) => {
    const nomeA = a.querySelector('.employee-info strong').textContent.trim().toLowerCase();
    const nomeB = b.querySelector('.employee-info strong').textContent.trim().toLowerCase();
    return ordemCrescente ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
  });

  funcionarios.forEach(funcionario => container.appendChild(funcionario));
  ordemCrescente = !ordemCrescente;

  // Alterna classe visual do botão (seta para cima/baixo)
  botao.classList.toggle('ordem-desc', !ordemCrescente);
}

