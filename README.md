# Restaurant Management AI Agent

This project is an AI agent chatbot that helps customers interact with a restaurant by performing the following tasks:

1. Order Food – Allow the user to place a food order.
2. Book a Table – Let the user reserve a table.
3. Chat Naturally about anything related to the restaurant, food, and reservations.
4. View and Edit Orders – Users can view their order history and edit existing orders.
5. View and Edit Reservations – Users can view their reservations and modify booking details.

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React with Vite
- **AI**: OpenAI, LangChain, LangGraph
- **Database**: SQLite

## Project Structure

```
rs/
├── backend/
│   ├── app.py                 # Flask application
│   ├── config.py              # Configuration settings
│   ├── models.py              # Database models
│   ├── agent/
│   │   ├── agent.py           # LangGraph agent implementation
│   │   ├── tools.py           # Agent tools for ordering and booking
│   │   └── prompts.py         # Agent prompts
│   ├── routes/
│   │   └── api.py             # API routes
│   └── database/
│       └── db.py              # Database connection and operations
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx       # Chat component
│   │   │   ├── Header.jsx     # Header component
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   └── Orders.jsx     # Orders component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Home page with chat interface
│   │   │   ├── MenuPage.jsx   # Menu display page
│   │   │   ├── OrdersPage.jsx # Orders management page
│   │   │   ├── ReservationsPage.jsx # Reservations management page
│   │   │   └── AboutPage.jsx  # About page
│   │   ├── App.jsx            # Main application with routing
│   │   ├── main.jsx           # Entry point
│   │   └── styles/            # CSS styles
│   ├── package.json
│   └── vite.config.js
├── requirements.txt           # Python dependencies
├── run.bat                    # Batch script to start both servers
└── README.md                  # Project documentation
```

## Setup and Installation

### Using the run.bat Script (Recommended)

1. Navigate to the project root directory in File Explorer: `C:\Users\pc\OneDrive\Desktop\rs`
2. Double-click the `run.bat` file
3. This will start both the backend and frontend servers automatically
4. Open your browser and navigate to `http://localhost:3000`

### Manual Setup

#### Backend

1. Navigate to the project root directory:
   ```
   cd rs
   ```

2. Set up environment variables:
   - Copy the `.env.example` file to a new file named `.env`
   - Replace the placeholder values with your actual API keys
   ```
   cp .env.example .env
   # Edit the .env file with your API keys
   ```

3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```
   cd backend
   python -m flask run
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd rs/frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Features

- **Order Food**: Users can browse the menu and place food orders through the chatbot.
- **Book a Table**: Users can check table availability and make reservations.
- **Natural Conversation**: The AI agent can handle general inquiries about the restaurant, its food, and services.
- **View and Edit Orders**: Users can view their order history and edit details like items, quantities, and customer information.
- **View and Edit Reservations**: Users can view their reservations and modify details like date, time, and party size.
- **Navigation**: The application includes a navigation bar for easy access to different sections.
- **Responsive Design**: The UI is designed to work well on different screen sizes.
- **Visual Menu**: The menu is presented with food category organization and emoji indicators for different food types.

## API Endpoints

- `POST /api/chat`: Send a message to the AI agent
- `GET /api/menu`: Get the restaurant menu
- `GET /api/availability`: Get table availability
- `GET /api/orders`: Get all orders
- `PUT /api/orders/<id>`: Update an existing order
- `GET /api/reservations`: Get all reservations
- `PUT /api/reservations/<id>`: Update an existing reservation

## Database

The application uses SQLite for data storage with the following tables:
- `menu_items`: Stores the restaurant menu
- `orders`: Stores customer orders
- `table_availability`: Stores table availability information
- `reservations`: Stores customer reservations

## AI Agent Features

- **Context-Aware Responses**: The AI agent maintains conversation context to provide relevant responses.
- **Tool Integration**: Uses LangChain tools to interact with the database for orders and reservations.
- **Navigation Guidance**: After completing an order or reservation, the agent suggests checking the appropriate section in the navbar.
- **Enhanced Menu Presentation**: The menu is presented with visual organization and emoji indicators.

## Additional Notes

- The OpenAI API key is stored securely in the `.env` file and loaded using python-dotenv. Make sure to create your own `.env` file based on the `.env.example` template.
- The application uses a SQLite database for simplicity. For production, consider using a more robust database system.
- The frontend uses React Router for navigation between different pages.
- Toast notifications provide feedback for user actions like updating orders and reservations.
