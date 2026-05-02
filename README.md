# 📚 Immerse — Leitura Imersiva Gamificada

> Transforme PDFs comuns em uma experiência de leitura profunda, sonora e inteligente.

---

## ✨ Sobre o Projeto

**Immerse** é uma aplicação web desenvolvida para oferecer uma nova forma de consumir livros em PDF.

Ao invés de apenas abrir um arquivo e folhear páginas, o usuário entra em um ambiente pensado para:

- leitura sem distrações,
- ambientação sonora,
- progresso inteligente,
- gamificação,
- conforto visual,
- acompanhamento de evolução.

O objetivo do projeto é tornar o ato de ler **mais prazeroso, imersivo e recompensador**.

---

## 🚀 Principais Funcionalidades

### 📥 Importação de Livros PDF
O usuário pode importar seus próprios livros em PDF para dentro da plataforma.

Cada livro armazenado contém:

- capa
- arquivo PDF
- título
- autor
- categoria
- progresso de leitura
- favorito
- data da última leitura

Todos os dados são persistidos localmente usando IndexedDB.

---

### 📚 Biblioteca Inteligente
A página principal da aplicação exibe todos os livros em formato de estante digital.

Recursos:

- filtro por categorias
- filtro por favoritos
- busca por título/autor
- paginação anterior/próximo
- exclusão de livros
- marcação de favoritos
- barra de progresso visual
- selo de livro concluído

---

### 📖 Reader Imersivo
Modo de leitura full screen com:

- renderização PDF usando react-pdf
- zoom in / zoom out
- navegação por botões
- navegação por teclado
- swipe mobile
- auto page turn inteligente
- salvamento automático de progresso
- retomada de leitura do ponto salvo

O reader foi pensado para minimizar atrito e fadiga durante longas sessões.

---

### 🎵 Sons Ambientes
Sistema de ambientação sonora para aumentar foco e imersão.

Sons disponíveis:

- chuva
- mar
- vento
- lareira
- cafeteria lo-fi
- noite/grilos

Inclui:

- player global
- loop automático
- mini player flutuante
- controle de volume
- sleep timer

---

### 🏆 Sistema de Conquistas (Gamificação)
A leitura gera recompensas visuais para incentivar consistência.

Conquistas atuais:

- Primeiro Livro Importado
- Primeiro Favorito
- Colecionador (5 livros)
- Mestre da Biblioteca (10 livros)
- Primeiro Livro Finalizado
- Bookworm (5 livros lidos)
- Mestre da Leitura (10 livros lidos)

As conquistas são armazenadas localmente e desbloqueadas automaticamente.

---

### ⚙️ Ajustes Personalizados
O usuário pode configurar:

- volume global
- fonte de leitura
- tamanho de texto
- intensidade da aura
- sleep timer

Todas as configurações são persistidas via localStorage.

---

## 🧠 Diferenciais do Immerse

O projeto não é apenas um leitor PDF.

Ele combina conceitos de:

- UX de conforto cognitivo
- hábito de leitura
- foco profundo
- reward system
- experiência sensorial

para construir um produto mais próximo de um micro SaaS de leitura do que de um simples visualizador de documentos.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js
- Vite
- TailwindCSS
- Lucide React

### Leitura PDF
- react-pdf
- pdfjs-dist

### Persistência Local
- Dexie.js
- IndexedDB
- localStorage

### Feedback Visual
- Toast Notifications customizadas

---

## 🗂️ Estrutura do Projeto

```bash
src/
│
├── core/
│   ├── notification.jsx
│   └── deleteBookModal.jsx
│
├── pages/
│   ├── library.jsx
│   ├── reader.jsx
│   ├── import.jsx
│   ├── sons.jsx
│   ├── settings.jsx
│   └── achievements.jsx
│
├── services/
│   └── achievementService.jsx
│
├── hooks/
│   └── useLibraryEngine.jsx
│
├── data/
│   ├── data_books.jsx
│   └── data_themes.jsx
│
├── data_base/
│   └── db.jsx
│
└── App.jsx