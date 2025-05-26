let cart = [];
        let totalItems = 0;
        let totalQuantity = 0;
        let totalValue = 0;

        // Simulação de produtos
        const products = {
            '001': { name: 'Produto A', price: 10.50 },
            '002': { name: 'Produto B', price: 25.99 },
            '003': { name: 'Produto C', price: 5.75 }
        };

        // Event listeners
        document.getElementById('productSearch').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addProduct();
            }
        });

        document.getElementById('quantity').addEventListener('input', updatePrice);
        
        // Atalhos do teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F2') {
                e.preventDefault();
                defineClient();
            } else if (e.key === 'F3') {
                e.preventDefault();
                finalizeSale();
            } else if (e.key === 'F4') {
                e.preventDefault();
                supplyProducts();
            } else if (e.key === 'F5') {
                e.preventDefault();
                cancelItem();
            } else if (e.key === 'F6') {
                e.preventDefault();
                applyDiscount();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelOperation();
            }
        });

        function addProduct() {
            const code = document.getElementById('productSearch').value;
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
            if (products[code]) {
                const product = products[code];
                cart.push({
                    code: code,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    total: product.price * quantity
                });
                
                updateTotals();
                clearInputs();
                showNotification(`Produto ${product.name} adicionado!`);
            } else {
                showNotification('Produto não encontrado!', 'error');
            }
        }

        function updateTotals() {
            totalItems = cart.length;
            totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            totalValue = cart.reduce((sum, item) => sum + item.total, 0);
            
            document.getElementById('totalItems').textContent = totalItems;
            document.getElementById('totalQuantity').textContent = totalQuantity;
            document.querySelector('.total-value').textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;
        }

        function clearInputs() {
            document.getElementById('productSearch').value = '';
            document.getElementById('quantity').value = '0';
            document.getElementById('price').value = '0,00';
        }

        function updatePrice() {
            const code = document.getElementById('productSearch').value;
            const quantity = parseInt(document.getElementById('quantity').value) || 0;
            
            if (products[code]) {
                const total = products[code].price * quantity;
                document.getElementById('price').value = total.toFixed(2).replace('.', ',');
            }
        }

        function defineClient() {
            showNotification('Função Definir Cliente ativada!');
        }

        function applyDiscount() {
            showNotification('Função Desconto ativada!');
        }

        function cancelItem() {
            if (cart.length > 0) {
                cart.pop();
                updateTotals();
                showNotification('Último item cancelado!');
            } else {
                showNotification('Nenhum item para cancelar!', 'error');
            }
        }

        function finalizeSale() {
            if (cart.length > 0) {
                showNotification(`Venda finalizada! Total: R$ ${totalValue.toFixed(2).replace('.', ',')}`);
                cart = [];
                updateTotals();
                clearInputs();
            } else {
                showNotification('Nenhum item no carrinho!', 'error');
            }
        }

        function cancelOperation() {
            if (confirm('Deseja cancelar a operação atual?')) {
                cart = [];
                updateTotals();
                clearInputs();
                showNotification('Operação cancelada!');
            }
        }

        function supplyProducts() {
            showNotification('Função Abastecimento ativada!');
        }

        function openDrawer() {
            showNotification('Gaveta aberta!');
        }

        function processReturn() {
            showNotification('Função Devolução ativada!');
        }

        function closeCashier() {
            if (confirm('Deseja fechar o caixa?')) {
                showNotification('Caixa fechado!');
            }
        }

        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Foco inicial no campo de busca
        document.getElementById('productSearch').focus();