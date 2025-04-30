# 🚀 SGPC - Sistema de Gestão de Posto de Combustível

Este projeto tem como objetivo desenvolver um sistema completo para gerir as operações de um posto de combustível, integrando uma interface web interativa, uma base de dados robusta e um interpretador de uma linguagem específica do sistema (LSS).

## 📌 Funcionalidades principais

- Gestão de utilizadores (admin, funcionário, cliente)
- Agendamento e execução de serviços automotivos
- Registo de indisponibilidades e férias
- Consultas e relatórios personalizados
- Execução de comandos via LSS (Linguagem Específica do Sistema)

## 🧠 Linguagem Específica do Sistema (LSS)

A LSS é uma mini-linguagem criada para facilitar a introdução de dados como:
- Agendamentos de serviços
- Declaração de variáveis e perfis
- Operações em lote
- Consultas condicionais
- Comunicação de férias e folgas

A linguagem é interpretada por um **parser construído com Python + PLY**, e permite otimizar tarefas repetitivas de forma simples e eficaz.

## 🛠️ Tecnologias Utilizadas

| Camada           | Tecnologia                     |
|------------------|---------------------------------|
| 💻 Frontend       | HTML, CSS, JavaScript          |
| 🔧 Backend        | Node.js (Express.js)           |
| 🐍 LSS Parser     | Python + PLY                   |
| 🗃️ Base de Dados  | MySQL (via XAMPP/phpMyAdmin)  |
| 🌐 API/Integração | `child_process` para conectar Node.js ↔ Python |

## 📂 Estrutura do Projeto

SGPC/
├── public/                 # Frontend - Interface web (HTML, CSS, JS)
│   ├── index.html          # Página inicial / login
│   ├── dashboard.html      # Painel principal após login
│   ├── styles/             # Ficheiros de estilos CSS
│   └── scripts/            # Scripts JS (interações, fetch API, etc.)
│
├── routes/                 # Rotas da API (Node.js)
│   ├── userRoutes.js       # Rotas relacionadas a utilizadores
│   └── serviceRoutes.js    # Rotas para agendamento, indisponibilidade, etc.
│
├── controllers/            # Controladores - lógica do backend
│   ├── userController.js   # Funções de autenticação, gestão de utilizadores
│   └── serviceController.js# Funções para serviços, férias, relatórios
│
├── lss/                    # LSS - Parser e interpretador (Python + PLY)
│   ├── lexer.py            # Analisador léxico (tokens)
│   ├── parser.py           # Analisador sintático (gramática)
│   └── interpreter.py      # Execução dos comandos LSS e ligação à BD
│
├── database/               # Base de dados - scripts SQL
│   ├── schema.sql          # Script para criação das tabelas
│   └── seed.sql            # Dados de exemplo (opcional)
│
├── server.js               # Servidor principal em Node.js
├── package.json            # Lista de dependências Node.js
├── .env                    # Variáveis de ambiente (ex: credenciais da BD)
└── README.md               # Documentação do projeto (este ficheiro)

