import React, { useState, useRef } from 'react';
import { User, FileText, AlertCircle, Pill, Settings, Bell, LogOut, Upload, Camera } from 'lucide-react';

export default function WellnessPartnerWebsite() {
  const [activeSection, setActiveSection] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [clickedButton, setClickedButton] = useState(null);
  const fileInputRef = useRef(null);

  const handleSectionClick = (section) => {
    setClickedButton(section);
    setTimeout(() => setClickedButton(null), 200);
    setActiveSection(section);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, #E8F4F8 0%, #D4E9F0 100%)'
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ 
        background: 'linear-gradient(90deg, #0F2854 0%, #1C4D8D 100%)',
        boxShadow: '0 4px 12px rgba(15, 40, 84, 0.2)'
      }}>
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <User className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Wellness Partner ✓</h1>
            </div>
            <div className="flex items-center gap-5">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-white cursor-pointer" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-white cursor-pointer" strokeWidth={2} />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <User className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-white cursor-pointer" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Info Section - Compact */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-5 shadow-xl" style={{ 
              backgroundColor: 'white',
              border: '2px solid #4988C4',
              boxShadow: '0 8px 16px rgba(15, 40, 84, 0.12)'
            }}>
              <div className="flex flex-col items-center mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg" style={{ 
                    background: profileImage ? 'transparent' : 'linear-gradient(135deg, #4988C4 0%, #1C4D8D 100%)',
                    border: '3px solid white'
                  }}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    style={{ backgroundColor: '#4988C4', border: '2px solid white' }}
                  >
                    <Camera className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-center border-b-2 pb-3" style={{ borderColor: '#E8F4F8' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>
                    PATIENT NAME
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#1C4D8D' }}>
                    Anil Kumar
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-b-2 pb-3" style={{ borderColor: '#E8F4F8' }}>
                  <div className="text-center">
                    <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>
                      AGE
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#1C4D8D' }}>
                      67
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold mb-1" style={{ color: '#5D6D7E' }}>
                      GENDER
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#1C4D8D' }}>
                      Male
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold mb-2 text-center" style={{ color: '#5D6D7E' }}>
                    HEALTH CONCERN
                  </p>
                  <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: '#FEF5E7' }}>
                    <p className="text-base font-bold text-center" style={{ color: '#E67E22' }}>
                      Dementia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-5" style={{ color: '#0F2854' }}>
              Patient Care Dashboard
            </h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleSectionClick('reports')}
                className="w-full rounded-2xl p-5 shadow-lg flex items-center gap-5 cursor-pointer"
                style={{ 
                  backgroundColor: activeSection === 'reports' ? '#E8F4F8' : 'white',
                  border: activeSection === 'reports' ? '3px solid #1C4D8D' : '2px solid #4988C4',
                  transform: clickedButton === 'reports' ? 'scale(1.05)' : (activeSection === 'reports' ? 'scale(1.02)' : 'scale(1)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ 
                  backgroundColor: activeSection === 'reports' ? '#4988C4' : '#E8F4F8' 
                }}>
                  <FileText className="w-8 h-8" style={{ color: activeSection === 'reports' ? 'white' : '#1C4D8D' }} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>
                    View & Edit Reports
                  </h3>
                  <p className="text-sm" style={{ color: '#5D6D7E' }}>
                    Access medical reports, test results, and clinical documentation
                  </p>
                </div>
              </button>

              <button 
                onClick={() => handleSectionClick('emergency')}
                className="w-full rounded-2xl p-5 shadow-lg flex items-center gap-5 cursor-pointer"
                style={{ 
                  backgroundColor: activeSection === 'emergency' ? '#FADBD8' : 'white',
                  border: activeSection === 'emergency' ? '3px solid #C0392B' : '2px solid #E74C3C',
                  transform: clickedButton === 'emergency' ? 'scale(1.05)' : (activeSection === 'emergency' ? 'scale(1.02)' : 'scale(1)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ 
                  backgroundColor: activeSection === 'emergency' ? '#E74C3C' : '#FADBD8' 
                }}>
                  <AlertCircle className="w-8 h-8" style={{ color: activeSection === 'emergency' ? 'white' : '#E74C3C' }} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>
                    Edit Emergency Info
                  </h3>
                  <p className="text-sm" style={{ color: '#5D6D7E' }}>
                    Update emergency contacts, allergies, and critical medical information
                  </p>
                </div>
              </button>

              <button 
                onClick={() => handleSectionClick('medicine')}
                className="w-full rounded-2xl p-5 shadow-lg flex items-center gap-5 cursor-pointer"
                style={{ 
                  backgroundColor: activeSection === 'medicine' ? '#D5F4E6' : 'white',
                  border: activeSection === 'medicine' ? '3px solid #1E8449' : '2px solid #27AE60',
                  transform: clickedButton === 'medicine' ? 'scale(1.05)' : (activeSection === 'medicine' ? 'scale(1.02)' : 'scale(1)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ 
                  backgroundColor: activeSection === 'medicine' ? '#27AE60' : '#D5F4E6' 
                }}>
                  <Pill className="w-8 h-8" style={{ color: activeSection === 'medicine' ? 'white' : '#27AE60' }} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#0F2854' }}>
                    Medicine & Appointments
                  </h3>
                  <p className="text-sm" style={{ color: '#5D6D7E' }}>
                    Manage medications, dosage schedules, and upcoming appointments
                  </p>
                </div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <button 
                onClick={() => handleSectionClick('medications')}
                className="rounded-xl p-4 text-center shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[1.04] active:brightness-110" 
                style={{ 
                  backgroundColor: activeSection === 'medications' ? '#E8F4F8' : 'white', 
                  border: activeSection === 'medications' ? '3px solid #1C4D8D' : '2px solid #4988C4',
                  transform: activeSection === 'medications' ? 'scale(1.03)' : 'scale(1)'
                }}
              >
                <p className="text-3xl font-bold mb-1" style={{ color: '#1C4D8D' }}>12</p>
                <p className="text-xs font-semibold" style={{ color: '#0F2854' }}>Active Medications</p>
              </button>
              <button 
                onClick={() => handleSectionClick('visits')}
                className="rounded-xl p-4 text-center shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[1.04] active:brightness-110" 
                style={{ 
                  backgroundColor: activeSection === 'visits' ? '#D5F4E6' : 'white', 
                  border: activeSection === 'visits' ? '3px solid #1E8449' : '2px solid #27AE60',
                  transform: activeSection === 'visits' ? 'scale(1.03)' : 'scale(1)'
                }}
              >
                <p className="text-3xl font-bold mb-1" style={{ color: '#27AE60' }}>3</p>
                <p className="text-xs font-semibold" style={{ color: '#0F2854' }}>Upcoming Visits</p>
              </button>
              <button 
                onClick={() => handleSectionClick('recentReports')}
                className="rounded-xl p-4 text-center shadow-md cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[1.04] active:brightness-110" 
                style={{ 
                  backgroundColor: activeSection === 'recentReports' ? '#FEF5E7' : 'white', 
                  border: activeSection === 'recentReports' ? '3px solid #D68910' : '2px solid #E67E22',
                  transform: activeSection === 'recentReports' ? 'scale(1.03)' : 'scale(1)'
                }}
              >
                <p className="text-3xl font-bold mb-1" style={{ color: '#E67E22' }}>8</p>
                <p className="text-xs font-semibold" style={{ color: '#0F2854' }}>Recent Reports</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}