# 🚀 Social Media API - Backend Completo

Uma API robusta e escalável para redes sociais, construída com Fastify, Prisma e TypeScript. Oferece funcionalidades completas de autenticação, posts, comentários, sistema de seguidores e upload de imagens.

---

## 📑 Índice

- [✨ Funcionalidades Principais](#-funcionalidades-principais)
  - [🔐 Sistema de Autenticação](#-sistema-de-autenticação)
  - [👥 Gestão de Usuários](#-gestão-de-usuários)
  - [📝 Sistema de Posts, Comentários e Reposts](#-sistema-de-posts-comentários-e-reposts)
  - [🖼️ Sistema de Upload Inteligente](#-sistema-de-upload-inteligente)
- [🛠️ Tecnologias & Arquitetura](#️-tecnologias--arquitetura)
  - [Backend Framework](#backend-framework)
  - [Banco de Dados & ORM](#banco-de-dados--orm)
  - [Segurança](#segurança)
  - [Arquitetura](#arquitetura)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🚀 Instalação e Configuração](#-instalação-e-configuração)
- [🏗️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🔒 Segurança Implementada](#-segurança-implementada)

---

# ✨ Funcionalidades Principais

## 🔐 Sistema de Autenticação

- JWT com refresh tokens para segurança máxima
- Auditoria de login com registro de IP, navegador e status
- Rate limiting automático após múltiplas tentativas falhas
- Perfis públicos/privados com controle de visualização

## 👥 Gestão de Usuários

- CRUD completo de usuários com validações robustas
- Sistema de seguidores (follow/unfollow) bidirecional
- Upload de fotos de perfil com compressão automática
- Perfil personalizável com bio, data de nascimento e configurações de privacidade

## 📝 Sistema de Posts, Comentários e Reposts

- Posts com texto e imagens (suporte a múltiplos formatos)
- Comentários hierárquicos com sistema de respostas
- Curtidas em posts e comentários
- Reposts para compartilhar conteúdo
- Timeline personalizada baseada em seguidores

## 🖼️ Sistema de Upload Inteligente

- Upload de imagens com validação de tipo e tamanho
- Compressão automática (até 80% de economia de espaço)
- Servidor de arquivos estáticos integrado
- Limpeza automática de imagens não utilizadas

## 🛠️ Tecnologias & Arquitetura

### Backend Framework

- **Fastify** – Performance superior com baixa sobrecarga
- **TypeScript** – Tipagem estática para maior confiabilidade
- **Zod** – Validação de schemas em runtime

### Banco de Dados & ORM

- **PostgreSQL** – Banco relacional robusto e confiável
- **Prisma** – ORM type-safe com migrações automáticas
- Indexes otimizados para queries complexas

### Segurança

- JWT com tokens de acesso e refresh
- Bcrypt para hash de senhas
- CORS configurado para produção
- Helmet para headers de segurança

### Arquitetura

- Clean Architecture com separação de responsabilidades
- Repository Pattern para abstração do banco
- Use Cases isolados para regras de negócio
- Presenters para formatação de responses

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## 🚀 Instalação e Configuração

Clone o repositório:

```bash
git clone https://github.com/gabriel-camara-dev/Template-backend.git
cd Template-backend
```

Instale as dependências:

npm install

cp .env.example .env

Edite o .env com suas configurações:

DATABASE_URL="postgresql://user:password@localhost:5432/socialdb"
JWT_SECRET="seu-jwt-super-secreto"
FRONTEND_URL="http://localhost:3000"

Execute as migrações do banco:

npx prisma migrate dev

Inicie o servidor:

npm run dev

src/
├── http/ # Camada de transporte (HTTP)
│ ├── controllers/ # Controladores das rotas
│ ├── routes/ # Definição de rotas
│ ├── presenters/ # Formatação de responses
│ └── middlewares/ # Autenticação e validações
├── use-cases/ # Lógica de negócio
│ ├── factories/ # Injeção de dependências
│ └── errors/ # Erros customizados
├── repositories/ # Camada de acesso a dados
│ └── prisma/ # Implementações com Prisma
└── lib/ # Configurações e utilitários

## 🔒 Segurança Implementada

Validação de entrada com Zod

Hash de senhas com bcrypt

Tokens JWT com expiração

Rate limiting automático

CORS configurado

Auditoria de acesso

Upload seguro de arquivos
