import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import History from './components/History';
import ImageGallery from './components/ImageGallery';
import './App.css';

// Default scan data used as fallback
const defaultScanData = {
  variant: '',
  date: '',
  shift: '',
  scanTime: '',
  defects: [],
  gridDefects: [],
};

// Variant to panel image mapping
const variantPanelImages = {
  'Z101 BSO LH': '/images/Z101/BSO_LH.png',
  'M110 Fixed Glass Roof Front': '/images/Z101/BSO_LH.png',  // Using default for now
  'THAR FDO RH- W502': '/images/Z101/BSO_LH.png',  // Using default for now
  'M310 E9 LGO Lower': '/images/Z101/BSO_LH.png',  // Using default for now
  'PANEL FENDER LH -Z101': '/images/Z101/BSO_LH.png',  // Using default for now
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedDefectTypeFilter, setSelectedDefectTypeFilter] = useState(null);
  const [scanData, setScanData] = useState(defaultScanData);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch scan data from backend
  useEffect(() => {
    const fetchScanData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/scan-data');
        if (response.ok) {
          const data = await response.json();
          setScanData(data);
        }
      } catch (error) {
        console.error('Error fetching scan data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanData();
  }, []);

  // Fetch history data from backend
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/history');
        if (response.ok) {
          const data = await response.json();
          setHistoryRecords(data);
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistoryData();
  }, []);

  // View all images for a record (eye icon click)
  const handleViewImages = (record) => {
    setSelectedRecord(record);
    setSelectedDefectTypeFilter(null); // Show all defect types
    setGalleryOpen(true);
  };

  // View images for a specific defect type (badge click)
  const handleViewDefectImages = (record, defectType) => {
    setSelectedRecord(record);
    setSelectedDefectTypeFilter(defectType); // Filter by this defect type
    setGalleryOpen(true);
  };

  // Close gallery and reset filter
  const handleCloseGallery = () => {
    setGalleryOpen(false);
    setSelectedDefectTypeFilter(null);
  };

  // Flatten images from the selected record, optionally filtered by defect type
  const getGalleryImages = () => {
    if (!selectedRecord || !selectedRecord.defectTypes) return [];

    const images = [];
    selectedRecord.defectTypes.forEach(defect => {
      // If a filter is set, only include images of that defect type
      if (selectedDefectTypeFilter && defect.type !== selectedDefectTypeFilter) {
        return;
      }
      if (defect.images) {
        defect.images.forEach((image, index) => {
          // Support both old format (string URL) and new format (object with url and gridPosition)
          if (typeof image === 'string') {
            images.push({
              url: image,
              defectType: defect.type,
              gridPosition: defect.gridPositions ? defect.gridPositions[index] : null
            });
          } else {
            images.push({
              url: image.url,
              defectType: defect.type,
              gridPosition: image.gridPosition || null
            });
          }
        });
      }
    });
    return images;
  };

  // Generate title based on filter
  const getGalleryTitle = () => {
    if (!selectedRecord) return '';
    if (selectedDefectTypeFilter) {
      return `${selectedRecord.variant} - ${selectedDefectTypeFilter}`;
    }
    return selectedRecord.variant;
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Header currentView={currentView} onNavigate={setCurrentView} />
        {currentView === 'dashboard' ? (
          <Dashboard scanData={scanData} isLoading={isLoading} />
        ) : (
          <History
            records={historyRecords}
            onViewImages={handleViewImages}
            onViewDefectImages={handleViewDefectImages}
          />
        )}
        <ImageGallery
          isOpen={galleryOpen}
          onClose={handleCloseGallery}
          images={getGalleryImages()}
          title={getGalleryTitle()}
          panelImage={selectedRecord ? variantPanelImages[selectedRecord.variant] : null}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;


