@echo off
echo Starting Restaurant Management AI Agent...

REM Check if .env file exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create a .env file with your OpenAI API key.
    echo You can copy .env.example and update it with your actual API key.
    echo.
    echo Example:
    echo OPENAI_API_KEY=your_openai_api_key_here
    pause
    exit /b 1
)

REM Start the backend server
start cmd /k "cd backend && python -m flask run"

REM Start the frontend development server
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting. Please wait a moment...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:3000
