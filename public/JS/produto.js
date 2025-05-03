document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
  
    if (!id) {
      document.getElementById("produto-container").innerText = "Produto não encontrado.";
      return;
    }
  
    // "Base de dados" em JS diretamente
    const produtos = [
      {
        id: "Kitkat",
        nome: "KitKat",
        imagem: "IMG/kitkat.png",
        descricao: "O KitKat combina chocolate de leite cremoso com camadas crocantes de wafer. Ideal para uma pausa deliciosa a qualquer hora do dia. Um clássico saboroso que conquista em cada mordida.",
        pontos: 35
      },
      {
        id: "Oleo",
        nome: "Óleo Dinoco",
        imagem: "IMG/oleo_dinoco.png",
        descricao: "O óleo de motor protege e lubrifica o motor do seu veículo, garantindo desempenho suave e durabilidade. Ideal para manter o seu carro em perfeitas condições em qualquer trajeto. Um essencial confiável que cuida do motor a cada quilômetro.",
        pontos: 140
      },
      {
        id: "Sprite",
        nome: "Sprite",
        imagem: "IMG/sprite.png",
        descricao: "A Sprite combina o sabor refrescante do limão com bolhas intensas que despertam os sentidos. Ideal para matar a sede com leveza e frescor a qualquer hora. Um clássico revigorante que agrada em cada gole.",
        pontos: 60
      },
      {
        id: "Batatas",
        nome: "Batatas Fritas",
        imagem: "IMG/doritos.png",
        descricao: "Doritos. Chips de milho crocantes com sabores intensos e marcantes. Ideal para compartilhar ou saborear sozinho a qualquer momento do dia. Um clássico ousado que surpreende a cada mordida.",
        pontos: 45
      },
      {
        id: "Pastilhas",
        nome: "Pastilhas Elásticas",
        imagem: "IMG/pastilhas.webp",
        descricao: "Trident oferece pastilhas refrescantes com sabores duradouros e marcantes. Ideal para manter o hálito fresco a qualquer hora do dia. Um clássico moderno que acompanha o seu ritmo com atitude.",
        pontos: 17
      },
      {
        id: "Chupas",
        nome: "Chupas",
        imagem: "IMG/chupas.png",
        descricao: "Os chupas combinam sabores frutados e intensos numa experiência doce e divertida. Ideais para aproveitar um momento de leveza a qualquer hora do dia. Um clássico colorido que encanta a cada lambida.",
        pontos: 15
      },
      {
        id: "Energéticos",
        nome: "Red Bull",
        imagem: "IMG/redbull.png",
        descricao: "Red Bull combina sabor único com energia instantânea para corpo e mente. Ideal para dar aquele impulso nos estudos, no trabalho ou no treino. Um clássico energético que te leva além.",
        pontos: 55
      },
      {
        id: "Agua",
        nome: "Água",
        imagem: "IMG/agua.png",
        descricao: "A Água é pura, leve e naturalmente equilibrada, perfeita para hidratar o corpo com qualidade. Ideal para o dia a dia ou momentos de bem-estar. Um clássico da natureza em cada gole.",
        pontos: 20
      },
      {
        id: "Kit",
        nome: "Kit",
        imagem: "IMG/kit.png",
        descricao: "O kit de segurança constituido por triângulo e colete garante mais proteção e visibilidade em situações de emergência. Ideal para estar sempre preparado na estrada. Um essencial obrigatório que cuida da sua segurança.",
        pontos: 150
      },
      {
        id: "Escovas",
        nome: "Escovas",
        imagem: "IMG/escovas.png",
        descricao: "As escovas de para-brisas garantem visibilidade clara em qualquer clima, com limpeza eficiente e silenciosa. Ideais para dirigir com segurança e conforto. Um item essencial que faz a diferença em cada viagem.",
        pontos: 90
      },
      {
        id: "Cerveja",
        nome: "Cerveja",
        imagem: "IMG/cerveja.png",
        descricao: "A cerveja traz sabor refrescante e maltado, perfeita para momentos de descontração e celebração. Ideal para acompanhar bons encontros com leveza. Um clássico gelado que combina com qualquer ocasião.",
        pontos: 50
      },
      {
        id: "MM",
        nome: "M&M",
        imagem: "IMG/M&M.png",
        descricao: "M&M’s combinam crocância e chocolate em cores vibrantes que divertem e encantam. Ideais para compartilhar ou saborear sozinho a qualquer momento. Um clássico irresistível em cada mordida.",
        pontos: 35
      },
      {
        id: "Gomas",
        nome: "Gomas",
        imagem: "IMG/gomas.png",
        descricao: "As gomas oferecem textura macia e sabores frutados que agradam todas as idades. Ideais para um momento doce e divertido a qualquer hora. Um clássico colorido que desperta sorrisos a cada mordida",
        pontos: 32
      },
      {
        id: "Bolachas",
        nome: "OREO",
        imagem: "IMG/oreo.png",
        descricao: "Oreo combina biscoitos crocantes com recheio cremoso num sabor único e irresistível. Ideal para saborear puro ou com leite. Um clássico que transforma qualquer momento em diversão.",
        pontos: 47
      },
      {
        id: "Café",
        nome: "Café",
        imagem: "IMG/cafe.png",
        descricao: "O café é uma bebida rica e aromática, perfeita para despertar os sentidos e energizar o dia. Ideal para começar a manhã ou fazer uma pausa revigorante. Um clássico que aquece o coração a cada gole",
        pontos: 15
      },
      {
        id: "Frutos",
        nome: "Frutos Secos",
        imagem: "IMG/amendoa.png",
        descricao: "Os frutos secos são snacks saudáveis e nutritivos, ricos em fibras e proteínas. Ideais para um lanche leve e saboroso a qualquer hora do dia. Um clássico saudável que nutre o corpo com sabor.",
        pontos: 23
      },
      {
        id: "Toalhitas",
        nome: "Toalhitas",
        imagem: "IMG/toalhitas.png",
        descricao: "As toalhitas são práticas e versáteis, perfeitas para limpar e refrescar a pele em qualquer lugar. Ideais para manter a higiene e o conforto a qualquer hora do dia. Um clássico que cuida da sua pele com carinho.",
        pontos: 26
      },
      {
        id: "Carregador",
        nome: "Carregador",
        imagem: "IMG/carregador.png",
        descricao: "O carregador portátil é compacto e eficiente, ideal para manter os seus dispositivos sempre carregados. Perfeito para viagens ou emergências. Um essencial moderno que garante energia a qualquer hora.",
        pontos: 78
      },
      {
        id: "Pilhas",
        nome: "Pilhas",
        imagem: "IMG/pilhas.png",
        descricao: "As pilhas são fontes de energia confiáveis e duradouras para diversos dispositivos. Ideais para manter os seus gadgets funcionais e sem interrupções. Um clássico prático que garante energia a cada uso.",
        pontos: 31
      },
      {
        id: "Isqueiros",
        nome: "Isqueiros",
        imagem: "IMG/isqueiros.png",
        descricao: "Os isqueiros são práticos e seguros, perfeitos para acender fogueiras ou velas em qualquer lugar. Ideais para acampar ou usar em casa. Um clássico que traz calor e luz a cada chama.",
        pontos: 80
      }
    ];
  
    const produto = produtos.find(p => p.id === id);
  
    if (!produto) {
      document.getElementById("produto-container").innerText = "Produto não encontrado.";
      return;
    }
  
    document.getElementById("produto-container").innerHTML = `
    <div class="container">
      <div class="product-image">
        <img src="${produto.imagem}" alt="${produto.nome}">
      </div>
      <div class="product-details">
        <h1>${produto.nome}</h1>
        <div class="points">${produto.pontos} Pts</div>
        <p>Descrição</p>
      <p>${produto.descricao}</p>
      <button class="resgatar-btn">Resgatar</button>
    </div>
  </div>
    `;
  
  });