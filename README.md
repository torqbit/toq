<p align="center">
  <a href="https://github.com/torqbit/torqbit" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.torqbit.com/static/brand/logo.png" alt="Torqbit Logo" width="250"/>
  </a>
</p>

<p align="center">
  AI Assistant for Documentation — Open Source and Developer-First  
</p>

<p align="center">
  <a href="https://github.com/torqbit/torqbit/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/license/torqbit/torqbit?style=flat" alt="License"/>
  </a>
  <a href="https://github.com/torqbit/torqbit/graphs/contributors" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/contributors/torqbit/torqbit?style=flat" alt="Contributors"/>
  </a>
  <a href="https://github.com/torqbit/torqbit/issues" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/issues/torqbit/torqbit?style=flat" alt="Issues"/>
  </a>
</p>

<p align="center">
  <img src="screenshots/ai-assistant.png" alt="Torqbit" width="800" style="border-radius: 4px;"/>
</p>

---

## What is Torqbit?

Torqbit makes your **documentation AI-powered and conversational**. Developers can ask questions directly inside your docs, GitHub repos, wikis, or knowledge bases, and get instant, accurate answers without hunting through pages.

**Embed** Torqbit easily into any doc site — GitBook, ReadMe, Mintlify, Docusaurus, and more — and transform your documentation into an interactive AI assistant.

---

## 🚀 Features at a Glance

| Feature                           | Why It Matters                                               |
| --------------------------------- | ------------------------------------------------------------ |
| 🤖 **AI Assistant for Docs**      | Provides instant, conversational answers from your content   |
| 🔎 **Semantic Search**            | Understands context, not just keywords                       |
| 📚 **Multi-source Knowledge**     | Integrate GitHub, GitBook, Notion, Google Drive, Markdown    |
| 🔗 **Universal Embedding**        | Widget works seamlessly with any static or dynamic docs site |
| 🔄 **Auto-Sync Updates**          | Always stays current with your docs evolution                |
| 🛠 **Open Source & Extensible**   | Customize connectors and behaviors easily                    |
| 🔒 **Multi-tenant & Agent Ready** | Manage multiple projects or teams with a single deployment   |

---

## 🎬 Demo Preview



https://github.com/user-attachments/assets/e5fd1e8c-de48-42e2-a163-482054665c6a



_Chat directly inside your docs for real-time answers._

---

## 🏁 Quick Start using Docker

```bash
npx torqbit
```

- What it does:
  - Checks for Docker and Docker Compose.
  - Writes a `docker-compose.yml` to your current directory (asks before overwriting).
  - Starts the stack with `docker compose up -d --build`.

- Services exposed by default:
  - Web: http://localhost:8080
  - MySQL: localhost:3360
  - Qdrant: http://localhost:6333

---

## 🚀 Quick Start using Source Code

```bash
git clone https://github.com/torqbit/torqbit.git
cd torqbit
yarn install
yarn dev
```
