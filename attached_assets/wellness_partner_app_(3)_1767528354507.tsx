import React, { useState, useRef } from 'react';
import { User, Menu, Settings, Camera, FileText, AlertCircle, Activity, Eye, Clipboard } from 'lucide-react';

export default function WellnessPartnerDashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [patientImage, setPatientImage] = useState(null);
  const [guardianImage, setGuardianImage] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);
  const patientFileInputRef = useRef(null);
  const guardianFileInputRef = useRef(null);

  const handleSectionClick = (section) => {
    setClickedButton(section);
    setTimeout(() => setClickedButton(null), 200);
    setActiveSection(section);
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'patient') {
          setPatientImage(e.target.result);
        } else {
          setGuardianImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (type) => {
    if (type === 'patient') {
      patientFileInputRef.current.click();
    } else {
      guardianFileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #F8FBFD 0%, #E8F4F8 100%)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ 
        background: 'linear-gradient(90deg, #0F2854 0%, #1C4D8D 100%)',
        boxShadow: '0 2px 20px rgba(15, 40, 84, 0.15)'
      }}>
        <div className="px-12 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #4988C4 0%, #1C4D8D 100%)'
              }}>
                <User className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">Wellness Partner</h1>
                <p className="text-xs text-white/80 font-medium">Patient Care Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
                <Menu className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
                <Settings className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <User className="w-5 h-5 text-white" strokeWidth={2} />
                <span className="text-sm font-semibold text-white">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-12 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Patient & Guardian Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Patient Info Card */}
            <div className="rounded-3xl p-6 shadow-xl relative overflow-hidden" style={{ 
              backgroundColor: 'white',
              border: '2px solid #E8F4F8'
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#4988C4' }}></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#E8F4F8' }}>
                    <p className="text-xs font-bold" style={{ color: '#1C4D8D' }}>PATIENT INFORMATION</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>Full Name</p>
                      <p className="text-2xl font-bold mb-1" style={{ color: '#0F2854' }}>Anil Kumar</p>
                      <p className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Male, 67 years</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>Primary Diagnosis</p>
                      <div className="inline-block px-4 py-1.5 rounded-xl mt-1" style={{ backgroundColor: '#FEF5E7', border: '2px solid #F39C12' }}>
                        <p className="text-sm font-bold" style={{ color: '#D68910' }}>Dementia</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 ml-6">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl transition-transform group-hover:scale-105" style={{ 
                      background: patientImage ? 'transparent' : 'linear-gradient(135deg, #4988C4 0%, #1C4D8D 100%)',
                      border: '3px solid white'
                    }}>
                      {patientImage ? (
                        <img src={patientImage} alt="Patient" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-14 h-14 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => triggerFileInput('patient')}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      style={{ backgroundColor: '#4988C4', border: '2px solid white' }}
                    >
                      <Camera className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </button>
                    <input 
                      ref={patientFileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'patient')}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Info Card */}
            <div className="rounded-3xl p-6 shadow-xl relative overflow-hidden" style={{ 
              backgroundColor: 'white',
              border: '2px solid #D5F4E6'
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#27AE60' }}></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#D5F4E6' }}>
                    <p className="text-xs font-bold" style={{ color: '#1E8449' }}>PRIMARY CAREGIVER</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>Full Name</p>
                      <p className="text-2xl font-bold" style={{ color: '#0F2854' }}>Sneha Kumar</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>Relationship</p>
                      <p className="text-lg font-bold" style={{ color: '#27AE60' }}>Daughter</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>Contact Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#27AE60' }}></div>
                        <p className="text-sm font-semibold" style={{ color: '#27AE60' }}>Active</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 ml-6">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl transition-transform group-hover:scale-105" style={{ 
                      background: guardianImage ? 'transparent' : 'linear-gradient(135deg, #27AE60 0%, #1E8449 100%)',
                      border: '3px solid white'
                    }}>
                      {guardianImage ? (
                        <img src={guardianImage} alt="Guardian" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-14 h-14 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => triggerFileInput('guardian')}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      style={{ backgroundColor: '#27AE60', border: '2px solid white' }}
                    >
                      <Camera className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </button>
                    <input 
                      ref={guardianFileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'guardian')}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Care Management Section Title */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0F2854' }}>Care Management Dashboard</h2>
            <p className="text-xs" style={{ color: '#5D6D7E' }}>Access patient care tools and monitoring systems</p>
          </div>

          {/* Main Action Buttons - 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button 
              onClick={() => handleSectionClick('emergency')}
              className="rounded-3xl p-6 shadow-xl cursor-pointer relative overflow-hidden group"
              style={{ 
                backgroundColor: activeSection === 'emergency' ? '#FADBD8' : 'white',
                border: activeSection === 'emergency' ? '3px solid #C0392B' : '2px solid #E74C3C',
                transform: clickedButton === 'emergency' ? 'scale(1.03)' : (activeSection === 'emergency' ? 'scale(1.01)' : 'scale(1)'),
                transition: 'all 0.2s ease'
              }}
            >
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 transition-all group-hover:scale-110" style={{ backgroundColor: '#E74C3C' }}></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ backgroundColor: activeSection === 'emergency' ? '#E74C3C' : '#FADBD8' }}>
                  <AlertCircle className="w-6 h-6" style={{ color: activeSection === 'emergency' ? 'white' : '#E74C3C' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>Emergency Protocol</h3>
                <p className="text-xs" style={{ color: '#5D6D7E' }}>Critical care and emergency contacts</p>
              </div>
            </button>

            <button 
              onClick={() => handleSectionClick('routine')}
              className="rounded-3xl p-6 shadow-xl cursor-pointer relative overflow-hidden group"
              style={{ 
                backgroundColor: activeSection === 'routine' ? '#E8F4F8' : 'white',
                border: activeSection === 'routine' ? '3px solid #1C4D8D' : '2px solid #4988C4',
                transform: clickedButton === 'routine' ? 'scale(1.03)' : (activeSection === 'routine' ? 'scale(1.01)' : 'scale(1)'),
                transition: 'all 0.2s ease'
              }}
            >
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 transition-all group-hover:scale-110" style={{ backgroundColor: '#4988C4' }}></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ backgroundColor: activeSection === 'routine' ? '#4988C4' : '#E8F4F8' }}>
                  <FileText className="w-6 h-6" style={{ color: activeSection === 'routine' ? 'white' : '#4988C4' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>Daily Routine</h3>
                <p className="text-xs" style={{ color: '#5D6D7E' }}>Schedule and daily care activities</p>
              </div>
            </button>

            <button 
              onClick={() => handleSectionClick('tracking')}
              className="rounded-3xl p-6 shadow-xl cursor-pointer relative overflow-hidden group"
              style={{ 
                backgroundColor: activeSection === 'tracking' ? '#E8F4F8' : 'white',
                border: activeSection === 'tracking' ? '3px solid #1C4D8D' : '2px solid #4988C4',
                transform: clickedButton === 'tracking' ? 'scale(1.03)' : (activeSection === 'tracking' ? 'scale(1.01)' : 'scale(1)'),
                transition: 'all 0.2s ease'
              }}
            >
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 transition-all group-hover:scale-110" style={{ backgroundColor: '#4988C4' }}></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ backgroundColor: activeSection === 'tracking' ? '#4988C4' : '#E8F4F8' }}>
                  <Activity className="w-6 h-6" style={{ color: activeSection === 'tracking' ? 'white' : '#4988C4' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>Health Tracking</h3>
                <p className="text-xs" style={{ color: '#5D6D7E' }}>Vital signs and health metrics monitoring</p>
              </div>
            </button>

            <button 
              onClick={() => handleSectionClick('observation')}
              className="rounded-3xl p-6 shadow-xl cursor-pointer relative overflow-hidden group"
              style={{ 
                backgroundColor: activeSection === 'observation' ? '#E8F4F8' : 'white',
                border: activeSection === 'observation' ? '3px solid #1C4D8D' : '2px solid #4988C4',
                transform: clickedButton === 'observation' ? 'scale(1.03)' : (activeSection === 'observation' ? 'scale(1.01)' : 'scale(1)'),
                transition: 'all 0.2s ease'
              }}
            >
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 transition-all group-hover:scale-110" style={{ backgroundColor: '#4988C4' }}></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ backgroundColor: activeSection === 'observation' ? '#4988C4' : '#E8F4F8' }}>
                  <Eye className="w-6 h-6" style={{ color: activeSection === 'observation' ? 'white' : '#4988C4' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>Observation & Behaviour</h3>
                <p className="text-xs" style={{ color: '#5D6D7E' }}>Behavioral patterns and observations</p>
              </div>
            </button>
          </div>

          {/* GRS Button */}
          <button 
            onClick={() => handleSectionClick('grs')}
            className="w-full rounded-3xl p-6 shadow-xl cursor-pointer relative overflow-hidden group"
            style={{ 
              backgroundColor: activeSection === 'grs' ? '#E8DAEF' : 'white',
              border: activeSection === 'grs' ? '3px solid #6C3483' : '2px solid #9B59B6',
              transform: clickedButton === 'grs' ? 'scale(1.03)' : (activeSection === 'grs' ? 'scale(1.01)' : 'scale(1)'),
              transition: 'all 0.2s ease'
            }}
          >
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full opacity-10 transition-all group-hover:scale-110" style={{ backgroundColor: '#9B59B6' }}></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: activeSection === 'grs' ? '#9B59B6' : '#E8DAEF' }}>
                  <Clipboard className="w-7 h-7" style={{ color: activeSection === 'grs' ? 'white' : '#9B59B6' }} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-2xl mb-0.5" style={{ color: '#0F2854' }}>GRS Assessment</h3>
                  <p className="text-sm font-medium" style={{ color: '#5D6D7E' }}>Guided Recognitive Screening Protocol</p>
                </div>
              </div>
              <div className="px-5 py-2.5 rounded-xl" style={{ backgroundColor: activeSection === 'grs' ? '#9B59B6' : '#E8DAEF' }}>
                <p className="text-sm font-bold" style={{ color: activeSection === 'grs' ? 'white' : '#6C3483' }}>QUESTION SETUP →</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}