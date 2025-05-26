// Função para alterar quantidade
    function changeQuantity(button, change) {
      const quantityDisplay = button.parentElement.querySelector('.quantity-display');
      const currentQuantity = parseInt(quantityDisplay.textContent);
      const newQuantity = Math.max(0, currentQuantity + change);
      quantityDisplay.textContent = newQuantity;
      
      // Adicionar animação visual
      quantityDisplay.style.transform = 'scale(1.1)';
      setTimeout(() => {
        quantityDisplay.style.transform = 'scale(1)';
      }, 150);
    }

     // Função para editar produto
    function editProduct(button) {
      const row = button.closest('.product-row');
      const productName = row.querySelector('.product-name').textContent;
      alert(`A editar produto: ${productName}`);
      // Aqui você pode redirecionar para a página de edição
      // window.location.href = 'editar_produto.html';
    }

    // Função para deletar produto
    function deleteProduct(button) {
      const row = button.closest('.product-row');
      const productName = row.querySelector('.product-name').textContent;
      
      if (confirm(`Tens MESMO a certeza de que desejas apagar: ${productName}?`)) {
        row.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
          row.remove();
        }, 300);
      }
    }

    // Funcionalidade do checkbox "Selecionar Todos"
    document.getElementById('select-all').addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.product-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });

    // Funcionalidade de pesquisa
    document.querySelector('.search-bar input').addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = document.querySelectorAll('.product-row');
      
      rows.forEach(row => {
        const productName = row.querySelector('.product-name').textContent.toLowerCase();
        const category = row.querySelector('.category').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || category.includes(searchTerm)) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });