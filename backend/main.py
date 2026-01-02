"""
Press Shop Defect Detection Backend
A FastAPI-based backend service for the Mahindra Press Shop application.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(
    title="Press Shop Defect Detection API",
    description="Backend API for the Mahindra-Henkel Press Shop Defect Detection System",
    version="0.1.0"
)

# Configure CORS for frontend communication
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to data directory
DATA_DIR = Path(__file__).parent / "data"


@app.get("/api/scan-data")
async def get_scan_data():
    """
    Get the current scan data including variant, defects, and grid positions.
    Returns data from grids.json file with computed defect counts.
    """
    try:
        grids_file = DATA_DIR / "grids.json"
        if not grids_file.exists():
            raise HTTPException(status_code=404, detail="Scan data not found")
        
        with open(grids_file, "r") as f:
            raw_data = json.load(f)
        
        # Transform grouped grid defects into flat format for frontend
        flat_grid_defects = []
        defect_counts = []
        
        for defect_group in raw_data.get("gridDefects", []):
            defect_type = defect_group["type"]
            defect_color = defect_group["color"]
            grids = defect_group.get("grids", [])
            
            # Add to defect counts
            defect_counts.append({
                "name": defect_type,
                "count": len(grids)
            })
            
            # Flatten grid positions
            for grid in grids:
                flat_grid_defects.append({
                    "row": grid[0],
                    "col": grid[1],
                    "type": defect_type,
                    "color": defect_color
                })
        
        # Build response with computed data
        response = {
            "variant": raw_data.get("variant", ""),
            "date": raw_data.get("date", ""),
            "shift": raw_data.get("shift", ""),
            "scanTime": raw_data.get("scanTime", ""),
            "defects": defect_counts,
            "gridDefects": flat_grid_defects
        }
        
        return response
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    Returns a simple status response.
    """
    return {
        "status": "healthy",
        "service": "press-shop-backend",
        "version": "0.1.0"
    }


@app.get("/api/history")
async def get_history_data():
    """
    Get history records with defect data and images.
    Returns data from history.json file.
    """
    try:
        history_file = DATA_DIR / "history.json"
        if not history_file.exists():
            raise HTTPException(status_code=404, detail="History data not found")
        
        with open(history_file, "r") as f:
            history_data = json.load(f)
        
        return history_data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Press Shop Defect Detection API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Enable auto-reload for development
    )
