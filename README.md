# Reminisce AI

Reminisce AI is a healthcare platform designed for team ResQR to support dementia patients and their caregivers.

## Features
- **Caretaker Dashboard**: Memory uploads, Routine tracking, Medicine scheduling, and Emergency logs.
- **Patient Interface**: High-contrast, accessible UI featuring a "Memory Hub", SOS alerts, and a voice assistant placeholder.
- **AI Integration**: Azure Computer Vision for image analysis and Azure OpenAI for memory-sparking questions.

## Setup Instructions

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file based on `.env.example`.
4.  **Database Setup**:
    ```bash
    npm run db:push
    ```
5.  **Run the application**:
    ```bash
    npm run dev
    ```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `SESSION_SECRET`: Secret for session management.
- `AZURE_VISION_ENDPOINT`: Azure Computer Vision endpoint.
- `AZURE_VISION_KEY`: Azure Computer Vision API key.
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint.
- `AZURE_OPENAI_KEY`: Azure OpenAI API key.
- `AZURE_OPENAI_DEPLOYMENT`: Azure OpenAI deployment name (e.g., gpt-35-turbo).
