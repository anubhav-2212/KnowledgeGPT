# KnowledgeGPT 🧠💬

KnowledgeGPT is a full-stack RAG (Retrieval-Augmented Generation) application designed to ingest personal documents and websites, embed them, index them in a vector database, and provide a conversational interface powered by Google Gemini.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
*   **Vite + React** - For a fast, responsive, and modern user interface.
*   **Vanilla CSS** - Premium-looking custom styled interface.
*   **ES6 Modules** - Modern Javascript imports/exports (`type: "module"`).

### Backend (`server/`)
*   **Node.js & Express.js** - High-performance backend routing framework.
*   **ES6 Modules** - Configured with `"type": "module"` for clean ES6 javascript coding.
*   **Nodemon** - Hot-reloading development server utility.
*   **CORS** - Configured for cross-origin client integration.
*   **Dotenv** - Multi-environment configuration management.

---

## 📂 Project Structure

The project is split into two main root directories:

```text
KnowledgeGPT/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx         # Connection status & main layout
│   │   └── ...
│   └── package.json
│
└── server/                 # Express Backend
    ├── src/
    │   ├── app.js          # Express app configurations & middleware wiring
    │   ├── app/
    │   │   └── server.js   # Server listener entry point
    │   │
    │   ├── controllers/    # Route controllers
    │   │   ├── kb.controller.js
    │   │   ├── source.controller.js
    │   │   └── chat.controller.js
    │   │
    │   ├── services/       # Core business logic / external connectors
    │   │   ├── rag.service.js
    │   │   ├── embedding.service.js
    │   │   ├── retrieval.service.js
    │   │   ├── qdrant.service.js
    │   │   └── gemini.service.js
    │   │
    │   ├── loaders/        # Document & link scrapers / parsers
    │   │   ├── pdf.loader.js
    │   │   ├── website.loader.js
    │   │   └── text.loader.js
    │   │
    │   ├── models/         # Entity models
    │   │   ├── KnowledgeBase.js
    │   │   ├── Source.js
    │   │   └── Conversation.js
    │   │
    │   ├── routes/         # Router declarations
    │   │   └── index.js
    │   │
    │   └── utils/          # Utility logs & helpers
    │       └── logger.js
    │
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd KnowledgeGPT
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    cd client
    npm install
    ```

3.  **Install Backend Dependencies**:
    ```bash
    cd ../server
    npm install
    ```

### Running the Application

To run the full stack locally, open two terminal windows or processes:

#### Start Frontend Client (Runs on `http://localhost:5173/` by default)
```bash
cd client
npm run dev
```

#### Start Backend Server (Runs on `http://localhost:5000/` with Nodemon reload)
```bash
cd server
npm run dev
```

---

## ✨ Features Added So Far
*   **ES6 Modules First**: Consistent imports and modular structures globally across both frontend and backend.
*   **Express App Router**: Organized API endpoints separated cleanly into controllers and routes.
*   **Multi-source Loader Stubs**: Prepared parsing structure for processing PDFs, Web URLs, and Raw Text.
*   **Vector DB & LLM Skeletons**: Standard structure to integrate Gemini API and Qdrant DB.
*   **Dynamic Client Check**: Interactive connection banner displaying live communication status between React client and Express server.
*   **Git Integration**: Corrected OS tracking files (`.DS_Store` untracked and blocked globally).
