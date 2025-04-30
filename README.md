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

SGPC/ │ ├── public/ # HTML, CSS, JS do frontend │ ├── index.html │ ├── login.html │ ├── dashboard.html │ ├── styles/ │ └── scripts/ │ ├── routes/ # Endpoints da API (Node.js) │ └── userRoutes.js │ ├── controllers/ # Lógica da aplicação │ └── userController.js │ ├── lss/ # Interpretador da LSS (Python + PLY) │ ├── lexer.py │ ├── parser.py │ └── interpreter.py │ ├── database/ # Scripts SQL e ligação à BD │ └── schema.sql │ ├── server.js # Servidor principal Node.js ├── package.json # Dependências do Node.js ├── .env # Variáveis de ambiente └── README.md # Este ficheiro
