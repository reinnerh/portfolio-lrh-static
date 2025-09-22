# Portfólio Leonardo Reinner - Versão Estática

Versão estática do portfólio para hospedagem no GitHub Pages.

## 🚀 Como Rodar Localmente

```bash
# Servidor simples Python
python3 -m http.server 8000

# Ou com Node.js
npx serve .

# Ou qualquer servidor HTTP
```

Acesse: **http://localhost:8000**

## 📁 Estrutura

- `index.html` - Página principal
- `hobbies.html` - Página de hobbies
- `data.json` - Dados dos projetos e informações
- `app.js` - JavaScript principal
- `static/` - CSS, JS, imagens (copiados da versão FastAPI)

## 🌐 Deploy no GitHub Pages

1. Faça push para um repositório GitHub
2. Vá em Settings > Pages
3. Selecione source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Salve e aguarde o deploy

## 🛠️ Tecnologias

- HTML5 + CSS3
- Vanilla JavaScript
- Tailwind CSS (via CDN)
- Lucide Icons
- JSON para dados

## ✨ Funcionalidades

- ✅ Responsivo
- ✅ Dark/Light mode
- ✅ Filtro de projetos
- ✅ Terminal demos animados
- ✅ Formulário de contato (via mailto)
- ✅ Navegação entre páginas

## 🔄 Diferenças da Versão FastAPI

**Removido:**
- Server-side rendering
- Backend Python/FastAPI
- Processamento de formulários no servidor

**Mantido:**
- Toda funcionalidade visual
- Interatividade JavaScript
- Performance e responsividade
- Dados dos projetos

**Novo:**
- Formulário abre cliente de email
- Carregamento via JSON
- Hospedagem gratuita no GitHub Pages
