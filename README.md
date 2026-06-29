# I love u — page romantique néon (Next.js)

Une page web romantique, animée et très visuelle :

- Fond sombre avec dégradé violet / rose / bleu nuit (aurore animée)
- Pluie de petits cœurs flottants + particules scintillantes (effets néon / glow)
- Grand cœur central lumineux en SVG (halo + étincelles en orbite), cliquable
- Apparition progressive du message, révélation finale lettre par lettre
- **Mode surprise** : écran noir → appuie pour découvrir
- **Compteur de jours** ensemble (configurable)
- **Effets desktop** : lueur néon, traînée, répulsion des cœurs/particules, explosion au clic avec onde de choc
- **Effets mobile** : tap = explosion, appui long = rafale, parallaxe gyroscope
- 100 % responsive, respecte `prefers-reduced-motion`

Tout est en **CSS pur** pour les animations (aucune lib d'animation). Polices via Google Fonts dans `app/globals.css`.

## Prérequis

- Node.js 20 ou plus
- pnpm (ou npm / yarn / bun)

## Lancement

```bash
pnpm install
pnpm dev
```

Puis ouvre http://localhost:3000

```bash
pnpm build
pnpm start
```

## Structure

```
app/
├── lib/
│   ├── config.ts        # Personnalisation centralisée (message, date, surprise…)
│   ├── rand.ts          # Générateur pseudo-aléatoire déterministe (SSR)
│   ├── pointerLoop.ts   # Boucle RAF partagée + parallaxe + gyro
│   └── burst.ts         # Explosions de cœurs + onde de choc
├── components/
│   ├── SurpriseGate.tsx     # Écran noir de révélation
│   ├── FloatingHearts.tsx   # Cœurs flottants + répulsion
│   ├── FloatingParticles.tsx# Particules + répulsion
│   ├── CursorFX.tsx         # Curseur desktop (lueur, traînée, clic)
│   ├── MobileFX.tsx         # Tap / appui long mobile
│   ├── CentralHeart.tsx     # Cœur central interactif
│   └── HeroContent.tsx      # Texte, compteur, finale
├── globals.css
├── layout.tsx
└── page.tsx
```

## Personnalisation (`app/lib/config.ts`)

| Clé | Description |
|-----|-------------|
| `eyebrow` | Sous-titre au-dessus du message |
| `message` | Message principal |
| `finale` | Texte révélé lettre par lettre |
| `relationshipStartDate` | Date ISO pour le compteur de jours |
| `surpriseMode` | `true` = écran noir au chargement |
| `burstCooldownMs` | Délai minimum entre explosions (ms) |
| `url` | URL publique (défaut : `https://gabrielle.goldenbeans.com`) |
| `openGraph` | Titre et description pour le partage |

## Ajuster l'intensité

- **Densité cœurs** : `HEART_COUNT` dans `FloatingHearts.tsx`
- **Densité particules** : `PARTICLE_COUNT` dans `FloatingParticles.tsx`
- **Répulsion** : constantes en tête de `FloatingHearts.tsx` / `FloatingParticles.tsx`
- **Curseur** : `.cursor-glow`, distance traînée (`22 * 22` dans `CursorFX.tsx`), parallaxe (`* 8px`, `* -12px`, `* 18px` dans `globals.css`)
- **Couleurs** : variables `:root` dans `globals.css`

## Déploiement sur Vercel

Site configuré pour **`https://gabrielle.goldenbeans.com`**.

### 1. Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Prépare le déploiement Vercel"
git branch -M main
git remote add origin https://github.com/TON_USER/TON_REPO.git
git push -u origin main
```

### 2. Importer sur Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe le dépôt GitHub
3. Vercel détecte Next.js automatiquement (`vercel.json` force `pnpm`)
4. Clique **Deploy** (aucune variable d'environnement obligatoire)

### 3. Configurer le domaine `gabrielle.goldenbeans.com`

Dans le projet Vercel : **Settings → Domains → Add** → saisis `gabrielle.goldenbeans.com`.

Chez ton registrar DNS (là où `goldenbeans.com` est géré), ajoute :

| Type  | Nom        | Valeur              |
|-------|------------|---------------------|
| CNAME | `gabrielle` | `cname.vercel-dns.com` |

> Si `goldenbeans.com` est déjà sur Vercel, le sous-domaine peut se configurer en un clic depuis le dashboard.

La propagation DNS prend en général **5 à 30 minutes** (parfois jusqu'à 48 h).

### 4. (Optionnel) Variable d'environnement

Dans Vercel → **Settings → Environment Variables** :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://gabrielle.goldenbeans.com` |

Utile si tu changes de domaine sans modifier le code.

### 5. Déploiement en CLI (alternative)

```bash
pnpm add -g vercel
vercel login
vercel          # premier déploiement (preview)
vercel --prod   # production
```

Puis ajoute le domaine dans le dashboard Vercel comme à l'étape 3.

### Vérification

- `https://gabrielle.goldenbeans.com` — page principale
- `https://gabrielle.goldenbeans.com/sitemap.xml` — sitemap
- `https://gabrielle.goldenbeans.com/robots.txt` — robots
