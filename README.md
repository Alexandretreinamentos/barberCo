# Barber &amp; Co — A Arte do Corte Perfeito 🪒✨

[![Lisboa Premium Barberia](https://img.shields.io/badge/Lisboa-Premium-080808?style=for-the-badge&amp;labelColor=c9a84c&amp;color=080808)](https://barberandco.pt)
[![Desde 2016](https://img.shields.io/badge/Desde-2016-c9a84c?style=for-the-badge&amp;labelColor=080808)](https://barberandco.pt)

![Hero Preview](https://via.placeholder.com/1200x600/080808/c9a84c?text=Barber+%26+Co+-+Arte+do+Corte+Perfeito)

> **Barbearia premium em Lisboa desde 2016.** Experiência exclusiva com barbeiros especialistas, agendamento online em 1 minuto, produtos premium e satisfação garantida. O teu estilo, a nossa missão.

## 🚀 Funcionalidades

| Seção | Destaques |
|-------|-----------|
| **Hero Slideshow** | 5 slides automáticos + navegação (setas/dots) |
| **Estatísticas** | Contadores animados: 500+ clientes, 4 barbeiros, 8 anos, 4.9★ |
| **Serviços** | 6 cards com preços: €12-€45 (corte, barba, degradê, premium) |
| **Vantagens** | Sem espera, barbeiros certificados, produtos premium, garantia |
| **Equipa** | 4 barbeiros com fotos, especialidades, ratings ★★★★★ |
| **Avaliações** | 3 testimonials reais de clientes fiéis |
| **Agendamento** | Formulário completo: nome, telemóvel, serviço, barbeiro, data (Flatpickr pt-PT), horários dinâmicos (9h-18h), validação + submit Worker |
| **Modal Sucesso** | Confirmação detalhada com resumo |

## 🛠️ Stack Tecnológica

```
HTML5 • CSS3 • Vanilla JavaScript
├── Flatpickr (calendário PT)
├── Google Fonts (Playfair Display + Barlow)
├── Cloudflare Workers (backend simulado)
├── IntersectionObserver (animações)
└── Responsive (Mobile-First)
```

- **Design**: Tema escuro (#080808 + dourado #c9a84c), transições suaves, hover effects
- **Performance**: CSS puro (sem frameworks), JS otimizado (passive listeners)
- **Acessível**: ARIA labels, keyboard nav, semântica HTML
- **Responsive**: Desktop/Tablet/Mobile (768px, 560px, 480px breakpoints)

## 📱 Preview Local

```bash
# Windows (atual dir)
start index.html
```

Ou abra `index.html` no browser. Teste:
- Scroll suave + nav sticky
- Slideshow hero (5s auto)
- Contadores stats
- Formulário booking (data/horários + validação)
- Modal confirmação

## 🔧 Setup & Desenvolvimento

```bash
# Clone (futuro)
git clone https://github.com/seuusername/site-barbeiro.git
cd Site_Barbeiro

# Editar arquivos
index.html          # Estrutura + conteúdo
assets/css/global.css   # Estilos + animações
assets/js/script.js     # Interatividade + form

# Deploy grátis
npx netlify deploy --prod --dir=.
# ou Vercel / GitHub Pages
```

**Dependências externas** (CDN):
```
Flatpickr CSS/JS (data picker)
Google Fonts
```

## 📂 Estrutura do Projeto

```
Site_Barbeiro/
├── index.html           # Landing page completa
├── favicon.ico          # Ícone
└── assets/
    ├── css/
    │   └── global.css   # CSS variables + responsive
    └── js/
        └── script.js    # Carrossel + form + animações
```

## 🎯 Roadmap

- [x] Landing page frontend completa
- [ ] Backend PHP (integração com Worker/DB)
- [ ] Autenticação barbeiros (dashboard)
- [ ] Pagamentos Stripe/MBWay
- [ ] Admin panel (gerir horários/equipa)
- [ ] SEO + PWA
- [ ] API WhatsApp confirmações

## 🤝 Contribuições

1. Fork o projeto
2. Crie branch `feat/nova-funcionalidade`
3. Commit com mensagens claras
4. Pull Request para `main`

**Issues bem-vindas!** 🪛

## 📞 Contacto

```
Barber & Co
Rua da Carioca, 142
1100-000 Lisboa
+351 21 234 5678
geral@barberandco.pt

Instagram • Facebook • TikTok
```

---

**© 2026 Barber&amp;Co. Feito com ♥ em Lisboa**  
[Licença MIT](LICENSE) | [Descarregar v1.0](https://github.com/seuusername/site-barbeiro/archive/refs/heads/main.zip)
