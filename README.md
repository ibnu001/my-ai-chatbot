# My AI Chatbot

Sebuah aplikasi chatbot sederhana yang mengintegrasikan [Ollama](https://ollama.com/) sebagai backend AI, dibangun dengan Next.js, React, dan shadcn/ui.  
Cocok untuk eksperimen, belajar, atau membuat asisten AI pribadi di lokal.

## Fitur

- Chat interaktif dengan AI (streaming response)
- Tampilan modern dengan shadcn/ui & Tailwind CSS
- Mendukung format markdown (tabel, heading, dsb) pada balasan AI

## Prasyarat

- Node.js v18+
- [pnpm](https://pnpm.io/) (atau bisa diganti dengan npm/yarn)
- [Ollama](https://ollama.com/) sudah terinstall & model AI sudah di-pull (misal: `ollama pull gpt-oss:120b-cloud`)
- (Opsional) Model AI lain yang kompatibel dengan Ollama

## Cara Menjalankan

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/username/my-ai-chatbot.git
   cd my-ai-chatbot
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # atau
   # npm install
   # atau
   # yarn install
   ```

3. **Pastikan Ollama sudah berjalan di background:**
   ```bash
   ollama serve
   ```

4. **Jalankan aplikasi:**
   ```bash
   pnpm dev
   # atau
   # npm run dev
   # atau
   # yarn dev
   ```

5. **Buka di browser:**  
   [http://localhost:3000/chat](http://localhost:3000/chat)

## Konfigurasi Model AI

Secara default, aplikasi ini menggunakan model `gpt-oss:120b-cloud`.  
Jika ingin mengganti model, edit file:

```
src/app/api/chat/route.ts
```
dan ubah bagian:
```ts
model: "gpt-oss:120b-cloud",
```
menjadi model yang kamu inginkan.

## Catatan

- Pastikan Ollama berjalan di mesin yang sama dengan aplikasi ini.
- Untuk penggunaan di production, pastikan keamanan API dan rate limit sudah diatur.

---

Selamat mencoba! 🚀