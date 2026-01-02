# Press Shop Backend

FastAPI-based backend for the Mahindra Press Shop Defect Detection System.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The server will start at `http://localhost:8000`

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/docs` | GET | Swagger UI documentation |

## Development

The server runs with auto-reload enabled for development.
