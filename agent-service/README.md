# Agent Service

This service is responsible for handling multiple agent AI operations at build time.

## Tech Stack
- **Python 3**
- **FastAPI**
- **LangGraph**

## Getting Started

### Prerequisites
- Python 3.8+ 

### Installation
1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application
To start the FastAPI server in development mode:
```bash
uvicorn main:app --reload
```

## Documentation
Once the server is running, the interactive API documentation can be accessed at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
