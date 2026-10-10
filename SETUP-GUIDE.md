# Nexora — How to run it on your computer

**Founder:** Kwenyi Basil Safeh  
**Location:** Douala, Cameroon  
**WhatsApp:** +237 679 592 027

---

## What you need first (one-time)

1. **Node.js** (version 18 or newer)
   - Go to: https://nodejs.org
   - Download the **LTS** version
   - Install it (click Next / Install)
   - Restart your computer if asked

2. To check it worked, open **Terminal** (Mac/Linux) or **Command Prompt / PowerShell** (Windows) and type:

```
node -v
npm -v
```

You should see version numbers (e.g. v20.x.x and 10.x.x).

---

## Step-by-step

### Step 1 — Open the Nexora folder

In Terminal / Command Prompt:

```
cd path/to/nexora
```

Example (Windows):
```
cd Desktop\nexora
```

Example (Mac):
```
cd ~/Desktop/nexora
```

### Step 2 — Install the project

```
npm install
```

Wait 1–3 minutes. Do not close the window until it finishes.

### Step 3 — Start Nexora

```
npm run dev
```

You should see something like:

```
▲ Next.js
- Local: http://localhost:3000
```

### Step 4 — Open in your browser

Go to:

**http://localhost:3000**

---

## Main pages

| Page | Address |
|------|---------|
| Home | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| Business Doctor | http://localhost:3000/business-doctor |
| Stock Tracker | http://localhost:3000/dashboard/stock |
| Customer Recovery | http://localhost:3000/dashboard/customers |
| Launchpad | http://localhost:3000/dashboard/launchpad |
| Expert Help | http://localhost:3000/dashboard/experts |

---

## How to stop

In the terminal window, press:

**Ctrl + C**

---

## Common problems

### "node is not recognized" / "npm is not recognized"
→ Node.js is not installed, or you need to restart the terminal / computer after installing it.

### "npm install" fails
→ Make sure you have internet.
→ Try again:
```
npm install --legacy-peer-deps
```

### Port 3000 already in use
→ Start on another port:
```
npx next dev -p 3001
```
Then open http://localhost:3001

### Page is blank or error
→ Look at the terminal for red error messages and send them to your developer / support.

---

## Later: put it online (public link)

When you are ready for a real website link (e.g. nexora.vercel.app):

1. Create a free account on https://vercel.com
2. Install Vercel CLI or connect your GitHub
3. Deploy the `nexora` folder

Or message WhatsApp **+237 679 592 027** for help deploying.

---

Built for real businesses in Cameroon and beyond.
