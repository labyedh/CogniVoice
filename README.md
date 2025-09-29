# 🚀 CogniVoice

<div align="center">

[![GitHub license](https://img.shields.io/github/license/labyedh/CogniVoice?style=for-the-badge)](LICENSE)

**An intelligent full-stack for Early alzheimer detection application leveraging AI for advanced speech processing and interactive experiences.**


</div>

## 📖 Overview

CogniVoice is a sophisticated full-stack web application designed for advanced voice analysis to support the **early detection of Alzheimer’s disease**. It integrates a modern web interface with a robust backend API and a dedicated AI model service, enabling functionalities like speech processing, natural language understanding, and real-time voice interactions. This project is structured as a monorepo, separating the frontend, backend, and AI model into distinct, yet interconnected, services.

## ✨ Features

-   **🎙️ AI-Powered Speech Processing:** Leverages a dedicated AI model for sophisticated voice-to-text, sentiment analysis, or other speech-related tasks.
-   **🗣️ Real-time Voice Interaction:** Facilitates interactive voice experiences through WebSockets for seamless communication.
-   **🔒 User Authentication & Authorization:** Secure user management with JWT-based authentication and password hashing (bcryptjs).
-   **💾 Persistent Data Storage:** Utilizes SQLite to store user data, voice sessions, and application-specific information.
-   **🎨 Responsive & Modern UI:** Built with React+ vite js and Tailwind CSS for a visually appealing and adaptive user experience across devices.
-   **⚡ Scalable Architecture:** Modular design with separate frontend, backend, and AI services for enhanced performance and maintainability.
-   **🧩 Component-Based UI:** Developed using React components with Radix UI for accessible and customizable UI primitives.


## 🖥️ Screenshots


![Screenshot of CogniVoice Dashboard](.github/assets/screenshot-dashboard.png)
_CogniVoice Dashboard: Providing an overview of user activity and voice sessions._

![Screenshot of Voice Interaction Interface](.github/assets/screenshot-voice-interaction.png)
_Voice Interaction: Demonstrating real-time speech processing and feedback._

## 🛠️ Tech Stack

### Frontend

| Technology | Description |
|------------|-------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | **Framework:** A JavaScript library for building user interfaces, providing component-based architecture and fast rendering. |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | **Language:** A typed superset of JavaScript that compiles to plain JavaScript. |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) | **Styling:** A utility-first CSS framework for rapidly building modern, responsive designs. |


### Backend

| Technology | Description |
|------------|-------------|
| ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=white) | **Language:** Python |
| ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white) | **Framework:** A lightweight and powerful Python web framework for building backend APIs |
| ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white) | **Database:** SQLite for persistent storage of user data, sessions, and logs |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white) ![Bcrypt](https://img.shields.io/badge/Bcrypt-000000?style=for-the-badge&logo=bcrypt&logoColor=white) | **Authentication:** JSON Web Tokens for secure authentication and bcrypt for password hashing |
                                                                                                                                                                       

### AI Model Service

| Technology | Description |
|------------|-------------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) | **Runtime & Framework:** High-performance Python web framework for building APIs. |
| ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white) ![Transformers](https://img.shields.io/badge/HuggingFace-FFC83F?style=for-the-badge&logo=huggingface&logoColor=black) | **ML Frameworks:** PyTorch for deep learning and Hugging Face Transformers for state-of-the-art NLP models. |
|  ![Librosa](https://img.shields.io/badge/Librosa-B5317E?style=for-the-badge&logo=python&logoColor=white) | **Voice Library:**  Librosa for audio and music analysis. |



## 🚀 Quick Start

CogniVoice is a monorepo containing three distinct services: `frontend`, `cognivoice-backend`, and `cognivoice-aimodel`. Each service has its own setup requirements.

### Prerequisites

Ensure you have the following installed on your system:

-   **Node.js**: `^18.x` or higher (for frontend and backend)
-   **npm**: `^9.x` or higher (usually comes with Node.js)
-   **Python**: `^3.9` or higher (for the AI model service)
-   **pip**: `^23.x` or higher (usually comes with Python)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/labyedh/CogniVoice.git
    cd CogniVoice
    ```

2.  **Setup the Frontend**
    Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
    Install dependencies:
    ```bash
    npm install # or yarn install or pnpm install
    ```
    Create and configure environment variables:
    ```bash
    # Open .env.local and set:
    VITE_REACT_APP_API_URL=http://127.0.0.1:5000
    ```
    Return to the root directory:
    ```bash
    cd ..
    ```

3.  **Setup the Backend**
    Navigate to the `cognivoice-backend` directory:
    ```bash
    cd cognivoice-backend
    ```
    Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    Create and configure environment variables:
      ```bash
      # Open .env and set:
      SECRET_KEY="1234"
      AI_SERVICE_URL=http://127.0.0.1:8000
      INTERNAL_API_SECRET="1234"
      ADMIN_EMAIL=admin@cognivoice.com
      ADMIN_PASSWORD=AdminPass123!
      ADMIN_FIRST_NAME=Admin
      ADMIN_LAST_NAME=User 
     ```
    Return to the root directory:
    ```bash
    cd ..
    ```

4.  **Setup the AI Model Service**
    Navigate to the `cognivoice-aimodel` directory:
    ```bash
    cd cognivoice-aimodel
    ```
    Create a Python virtual environment and activate it:
    ```bash
    python3 -m venv venv
    source venv/bin/activate # On Windows use `venv\Scripts\activate`
    ```
    Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
    Create and configure environment variables:
    ```bash
     .env_ai
    # Open .env_ai and set:
    INTERNAL_API_SECRET="1234"
    HF_AUTH_TOKEN=your_token
    FLASK_BACKEND_URL=http://127.0.0.1:5000
    ```
    Return to the root directory:
    ```bash
    cd ..
    ```

### Running the Application

You need to start all three services independently.


1.  **Start the AI Model Service**
    Open another new terminal, navigate to `cognivoice-aimodel`, activate its virtual environment, and start the FastAPI server:
    ```bash
    cd cognivoice-aimodel
    source venv/bin/activate # Or `venv\Scripts\activate` on Windows
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload
    # The AI model service will start on http://localhost:8000
    ```
2.  **Start the Backend Service**
    Open a new terminal, navigate to `cognivoice-backend`, and start the development server:
    ```bash
    cd cognivoice-backend
    python run.py
    # The backend will start on http://localhost:5000
    ```



3.  **Start the Frontend Application**
    Open a final new terminal, navigate to `frontend`, and start the Next.js development server:
    ```bash
    cd frontend
    npm run dev
    # The frontend will start on http://localhost:3000
    ```

5.  **Open your browser**
    Visit `http://localhost:3000` to access the application.

## 📁 Project Structure

```
CogniVoice/
├── .github/                 # GitHub specific files (e.g., workflows, assets)
│   └── assets/              # Images for README, logos
├── .gitignore               # Specifies intentionally untracked files to ignore
├── LICENSE                  # Project license
├── README.md                # This README file
├── cognivoice-aimodel/      # Python FastAPI service for AI model inference
│   ├── .env.example         # Example environment variables for the AI service
│   ├── app.py               # FastAPI application entry point
│   ├── data/                # Directory for model files or data
│   ├── Dockerfile           # Docker configuration for AI service
│   ├── model.py             # Core AI model loading and inference logic
│   └── requirements.txt     # Python dependencies
├── cognivoice-backend/      # Node.js Express API service
│   ├── .env.example         # Example environment variables for the backend
│   ├── dist/                # Compiled JavaScript output
│   ├── package.json         # Node.js dependencies and scripts
│   ├── src/                 # Backend source code
│   │   ├── controllers/     # Handlers for API requests
│   │   ├── middleware/      # Express middleware (e.g., authentication)
│   │   ├── models/          # Mongoose schemas for database interaction
│   │   ├── routes/          # API endpoint definitions
│   │   └── server.ts        # Main Express server entry point
│   ├── tsconfig.json        # TypeScript configuration for backend
│   └── yarn.lock            # Exact dependency versions (if yarn used)
└── frontend/                # Next.js React application
    ├── .env.example         # Example environment variables for the frontend
    ├── next.config.js       # Next.js configuration
    ├── package.json         # Node.js dependencies and scripts
    ├── public/              # Static assets (images, fonts, etc.)
    ├── src/                 # Frontend source code
    │   ├── app/             # Next.js App Router pages and layouts
    │   ├── components/      # Reusable UI components
    │   └── styles/          # Global styles (e.g., Tailwind CSS base)
    ├── tailwind.config.ts   # Tailwind CSS configuration
    ├── tsconfig.json        # TypeScript configuration for frontend
    └── yarn.lock            # Exact dependency versions (if yarn used)
```

## 🤝 Contributing

We welcome contributions to CogniVoice! Please refer to our [Contributing Guide](CONTRIBUTING.md) <!-- TODO: Create CONTRIBUTING.md --> for details on how to get started, report bugs, or propose new features.

### Development Setup for Contributors

Follow the "Quick Start" instructions above to set up all three services. Ensure your development environment is consistent with the project's requirements.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   **React** and  the broader Typescript ecosystem for providing powerful tools for web development.
-   **Flask** for a robust backend framework.
-   **Python**, **FastAPI**, **Pytorch**, and **Hugging Face Transformers** for enabling advanced AI capabilities.
-   The open-source community for countless libraries and tools that make this project possible.

## 📞 Support & Contact

-   📧 Email: [yassine.labyed@fsb.ucar.tn] 
-   🐛 Issues: [GitHub Issues](https://github.com/labyedh/CogniVoice/issues)
-   💬 Discussions: [GitHub Discussions](https://github.com/labyedh/CogniVoice/discussions)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [labyedh](https://github.com/labyedh)

</div>

