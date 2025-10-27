# My AI Chatbot

Aplikasi chatbot sederhana yang terintegrasi dengan [Ollama Cloud](https://ollama.com/) sebagai backend AI, dibangun menggunakan Next.js, React, dan shadcn/ui.  
Cocok untuk eksperimen, belajar, atau membuat asisten AI pribadi dengan kemudahan cloud.

## Fitur

- Chat interaktif dengan AI (streaming response)
- Tampilan modern dengan shadcn/ui & Tailwind CSS
- Mendukung format markdown (tabel, heading, dsb) pada balasan AI

## Prasyarat

- Node.js v18+
- [pnpm](https://pnpm.io/) (atau bisa diganti dengan npm/yarn)
- Akun Ollama Cloud & API Key aktif
- Model AI yang tersedia di Ollama Cloud (misal: `gpt-oss:120b-cloud`)

## Konfigurasi Environment

1. **Buat file `.env` di root project:**
   ```
   OLLAMA_API_KEY=isi_dengan_api_key_ollama_cloud_anda
   ```

2. **Jangan commit file `.env` ke repository publik!**

## Cara Menjalankan

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/ibnu001/my-ai-chatbot.git
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

3. **Pastikan file `.env` sudah terisi OLLAMA_API_KEY.**

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
menjadi model yang kamu inginkan (pastikan model tersedia di Ollama Cloud).

## Catatan

- Semua request AI akan diarahkan ke Ollama Cloud, bukan server lokal.
- Pastikan API key Ollama Cloud kamu aktif dan memiliki kuota.
- Untuk penggunaan di production, pastikan keamanan API dan rate limit sudah diatur.

---

Selamat mencoba! 🚀