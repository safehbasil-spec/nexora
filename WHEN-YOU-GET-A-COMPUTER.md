# Nexora — Complete when you get a computer

**Owner:** Kwenyi Basil Safeh  
**Location:** Douala, Cameroon  
**WhatsApp:** +237 679 592 027  

Project folder: `nexora`  
Zip backup: `nexora-project.zip` (in the same parent folder)

---

## PART A — Run on the computer (10 minutes)

### 1. Install Node.js (one time)
- Open: https://nodejs.org
- Download **LTS**
- Install → finish → restart computer if asked

Check:
```bash
node -v
npm -v
```

### 2. Open the project
```bash
cd path/to/nexora
```
(Example Windows: `cd Desktop\nexora`)

### 3. Install and start
```bash
npm install
npm run dev
```

### 4. Open in browser
http://localhost:3000

Stop later with: **Ctrl + C**

---

## PART B — Put Nexora online (so it works on your phone)

Goal: get a public link like `https://nexora-xxx.vercel.app`

### 1. Create free accounts
- GitHub: https://github.com/signup  
- Vercel: https://vercel.com/signup (sign up with GitHub)

### 2. Put code on GitHub
On the computer, in the `nexora` folder:

```bash
git init
git add .
git commit -m "Nexora v1 - Kwenyi Basil Safeh"
```

Then on GitHub website:
- Click **New repository**
- Name: `nexora`
- Public
- Create (do **not** add README)

Back in terminal (replace YOUR_USERNAME):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexora.git
git push -u origin main
```

(Login/token when GitHub asks.)

### 3. Deploy on Vercel
1. Go to https://vercel.com
2. **Add New Project**
3. Import the `nexora` GitHub repo
4. Leave settings default → **Deploy**
5. Wait 1–2 minutes

### 4. Your public link
Vercel shows a URL, for example:
**https://nexora-xxxxx.vercel.app**

Open that on your **phone**. Bookmark it.

Optional: later connect a real domain (nexora.cm etc.) in Vercel → Settings → Domains.

---

## Main pages (after it is online)

| Page | Path |
|------|------|
| Home | `/` |
| Dashboard | `/dashboard` |
| Business Doctor | `/business-doctor` |
| Stock & Profit | `/dashboard/stock` |
| Customer Recovery | `/dashboard/customers` |
| Launchpad | `/dashboard/launchpad` |
| Expert Help | `/dashboard/experts` |

---

## What is already built

1. Business Doctor — assessment + 30-day plan  
2. Smart Stock & Profit Tracker — inventory, sales, gross profit (XAF)  
3. Customer Recovery — pipeline, follow-ups, WhatsApp drafts  
4. Instant Launchpad — website draft + HTML download  
5. Expert Help Marketplace — service requests → WhatsApp +237 679 592 027  
6. Smart Dashboard — recommendations across modules  
7. Mobile bottom navigation  

Prices in Expert Help are set to international standard (e.g. website from 150,000 XAF).

---

## If something fails

- `npm install` error → try: `npm install --legacy-peer-deps`
- Port 3000 busy → `npx next dev -p 3001`
- Git push asks for password → use a GitHub **Personal Access Token** (GitHub → Settings → Developer settings → Tokens)

---

## Contact

WhatsApp: **+237 679 592 027**  
Douala, Cameroon  

When the site is live, share the Vercel link with clients.
