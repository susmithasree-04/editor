# Vi-Notes

Vi-Notes is an authenticity verification platform designed to distinguish genuine human-written content from AI-generated or AI-assisted text. The system focuses on analyzing **writing behavior** alongside **statistical and linguistic characteristics** of the text to establish reliable authorship verification.

## Features

- **User Authentication** — Secure login and registration system
- **Writing Sessions** — Track and record writing sessions with real-time editing
- **Authorship Verification** — Analyze writing patterns to verify content authenticity
- **Rich Text Editor** — Full-featured editor for composing and editing documents

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- CSS3

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/susmithasree-04/vi-notes.git
   cd vi-notes
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory with your environment variables.

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the application**
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend (in a separate terminal)
   cd frontend
   npm run dev
   ```

## Project Structure

```
vi-notes/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layers
│   │   └── App.tsx      # Main app component
│   └── index.html
└── README.md
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
