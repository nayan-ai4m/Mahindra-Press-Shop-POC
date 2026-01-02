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
        defect.images.forEach(imageUrl => {
          images.push({
            url: imageUrl,
            defectType: defect.type
          });
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
        />
      </div>
    </ThemeProvider>
  );
}

export default App;


