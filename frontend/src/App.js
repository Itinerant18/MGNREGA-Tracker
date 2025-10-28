import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Comparison from './pages/Comparison';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  // For now, we'll use Andhra Pradesh since our backend has real data for it
  const [selectedState] = useState('Andhra Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    console.log('Selected district:', district);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  selectedState={selectedState}
                  selectedDistrict={selectedDistrict}
                  onDistrictSelect={handleDistrictSelect}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  selectedState={selectedState}
                  selectedDistrict={selectedDistrict}
                />
              } 
            />
            <Route 
              path="/comparison" 
              element={
                <Comparison 
                  selectedState={selectedState}
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
