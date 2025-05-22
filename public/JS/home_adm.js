// Alternar classe ativa no menu
const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuLinks.forEach(el => el.classList.remove('active'));
    link.classList.add('active');
  });
});

// Mostrar "Ver tudo" e ocultar os cards
document.getElementById('verTudo').addEventListener('click', () => {
  document.getElementById('cards').style.display = 'none';
  document.getElementById('infoExpandida').style.display = 'block';
});

document.getElementById('voltar').addEventListener('click', () => {
  document.getElementById('infoExpandida').style.display = 'none';
  document.getElementById('cards').style.display = 'flex';
});

// Gráfico com Chart.js
const ctx = document.getElementById('graficoPizza').getContext('2d');
const grafico = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Reabastecimentos', 'Conveniência'],
    datasets: [{
      label: 'Vendas',
      data: [274, 534],
      backgroundColor: ['#3A9BD1', '#8AC6D0'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});
