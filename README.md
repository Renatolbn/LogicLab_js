# 🧪 LogicLab JS

Plataforma interativa de exercícios de lógica em JavaScript, desenvolvida para praticar e consolidar conceitos de programação diretamente no navegador.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-CSS3-E34F26?style=flat&logo=html5&logoColor=white)

---

## 📌 Sobre o projeto

O LogicLab JS é um projeto full stack que permite criar, listar e resolver exercícios de lógica com JavaScript. O usuário visualiza os exercícios em cards interativos, resolve no próprio navegador e recebe feedback imediato da execução do código.

Desenvolvido como projeto de portfólio durante a transição de carreira para desenvolvimento de software.

---

## ✨ Funcionalidades

- 📋 Listagem de exercícios em cards com animação de flip
- 🔍 Filtro de exercícios por categoria
- 💻 Execução de código JavaScript diretamente no navegador
- ➕ Cadastro de novos exercícios via API REST
- 📄 Documentação da API com Swagger (`/docs`)

---

## 🛠️ Tecnologias

**Backend**
- Node.js
- Express
- ES Modules
- JSON file persistence (migração para MongoDB planejada)
- Swagger (documentação da API)

**Frontend**
- HTML5
- CSS3 (Grid Layout, animações flip)
- JavaScript Vanilla
- `new Function()` para execução dinâmica de código

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/Renatolbn/LogicLab_js.git

# Entre na pasta
cd LogicLab_js

# Instale as dependências
npm install

# Inicie o servidor
node server.js
```

Acesse em: `http://localhost:3000`
Documentação da API: `http://localhost:3000/docs`

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/exercises` | Lista todos os exercícios |
| GET | `/exercises/:id` | Busca exercício por ID |
| POST | `/exercises` | Cria novo exercício |
| DELETE | `/exercises/:id` | Remove um exercício |

---

## 📁 Estrutura do projeto

```
LogicLab_js/
├── assets/         # Imagens e recursos estáticos
├── css/            # Estilos da aplicação
├── js/             # Lógica do frontend
├── exercicios.json # Banco de dados local (JSON)
├── index.html      # Interface principal
├── server.js       # Servidor Express + rotas da API
├── package.json
└── README.md
```

---

## 🔮 Próximos passos

- [ ] Migração da persistência para MongoDB
- [ ] Autenticação de usuários (JWT)
- [ ] Ranking de exercícios resolvidos
- [ ] Deploy na nuvem (Railway ou Render)

---

## 👨‍💻 Autor

**Renato Lins B. Neto**
Desenvolvedor Web | Recife - PE

[![GitHub](https://img.shields.io/badge/GitHub-Renatolbn-181717?style=flat&logo=github)](https://github.com/Renatolbn)
[![Email](https://img.shields.io/badge/Email-renatolbn@gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:renatolbn@gmail.com)
