import React, { useState, useRef } from 'react';
import { User, Phone, Mail, MapPin, Droplet, Briefcase, FileText, Camera, ArrowLeft } from 'lucide-react';

export default function CaregiverDetailsPage() {
  const [guardianImage, setGuardianImage] = useState(null);
  const [documentType, setDocumentType] = useState('aadhaar');
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGuardianImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">Primary Caregiver Details</h1>
                <p className="text-xs text-white/80 font-medium">Complete caregiver information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-12 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="rounded-3xl p-8 shadow-xl mb-6 relative overflow-hidden" style={{ 
            backgroundColor: 'white',
            border: '2px solid #D5F4E6'
          }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 opacity-10" style={{ backgroundColor: '#27AE60' }}></div>
            
            <div className="flex items-start gap-8 relative z-10">
              {/* Photo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl transition-transform group-hover:scale-105" style={{ 
                  background: guardianImage ? 'transparent' : 'linear-gradient(135deg, #27AE60 0%, #1E8449 100%)',
                  border: '3px solid white'
                }}>
                  {guardianImage ? (
                    <img src={guardianImage} alt="Guardian" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={triggerFileInput}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  style={{ backgroundColor: '#27AE60', border: '2px solid white' }}
                >
                  <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name and Relation */}
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#D5F4E6' }}>
                  <p className="text-xs font-bold" style={{ color: '#1E8449' }}>PRIMARY CAREGIVER</p>
                </div>
                <h2 className="text-4xl font-bold mb-2" style={{ color: '#0F2854' }}>Sneha Kumar</h2>
                <p className="text-xl font-semibold" style={{ color: '#27AE60' }}>Daughter</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-3xl p-8 shadow-xl mb-6" style={{ 
            backgroundColor: 'white',
            border: '2px solid #E8F4F8'
          }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#0F2854' }}>Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5" style={{ color: '#4988C4' }} strokeWidth={2} />
                  <label className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Phone Number</label>
                </div>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5" style={{ color: '#4988C4' }} strokeWidth={2} />
                  <label className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Email Address</label>
                </div>
                <input 
                  type="email" 
                  placeholder="sneha.kumar@example.com"
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                />
              </div>

              {/* Blood Group */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="w-5 h-5" style={{ color: '#E74C3C' }} strokeWidth={2} />
                  <label className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Blood Group</label>
                </div>
                <select 
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                >
                  <option>Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              {/* Occupation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5" style={{ color: '#4988C4' }} strokeWidth={2} />
                  <label className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Occupation</label>
                </div>
                <input 
                  type="text" 
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="rounded-3xl p-8 shadow-xl mb-6" style={{ 
            backgroundColor: 'white',
            border: '2px solid #E8F4F8'
          }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#0F2854' }}>Address Information</h3>
            
            <div className="space-y-6">
              {/* Permanent Address */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5" style={{ color: '#4988C4' }} strokeWidth={2} />
                  <label className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Permanent Address</label>
                </div>
                <textarea 
                  rows="3"
                  placeholder="Enter permanent address"
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none resize-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                ></textarea>
              </div>

              {/* Correspondence Address */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5" style={{ color: '#4988C4' }} strokeWidth={2} />
                  <label className="text-sm font-semibold" style={{ color: '#5D6D7E' }}>Correspondence Address</label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <input type="checkbox" id="sameAddress" className="w-4 h-4" />
                  <label htmlFor="sameAddress" className="text-sm font-medium" style={{ color: '#5D6D7E' }}>
                    Same as permanent address
                  </label>
                </div>
                <textarea 
                  rows="3"
                  placeholder="Enter correspondence address"
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none resize-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Legal Document */}
          <div className="rounded-3xl p-8 shadow-xl mb-6" style={{ 
            backgroundColor: 'white',
            border: '2px solid #E8F4F8'
          }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#0F2854' }}>Legal Document</h3>
            
            <div className="space-y-6">
              {/* Document Type Selection */}
              <div>
                <label className="text-sm font-semibold mb-3 block" style={{ color: '#5D6D7E' }}>Document Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setDocumentType('aadhaar')}
                    className="p-4 rounded-xl border-2 transition-all"
                    style={{
                      backgroundColor: documentType === 'aadhaar' ? '#E8F4F8' : 'white',
                      borderColor: documentType === 'aadhaar' ? '#4988C4' : '#E8F4F8'
                    }}
                  >
                    <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#4988C4' }} strokeWidth={2} />
                    <p className="font-bold text-sm" style={{ color: '#0F2854' }}>Aadhaar Card</p>
                  </button>

                  <button
                    onClick={() => setDocumentType('passport')}
                    className="p-4 rounded-xl border-2 transition-all"
                    style={{
                      backgroundColor: documentType === 'passport' ? '#E8F4F8' : 'white',
                      borderColor: documentType === 'passport' ? '#4988C4' : '#E8F4F8'
                    }}
                  >
                    <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#4988C4' }} strokeWidth={2} />
                    <p className="font-bold text-sm" style={{ color: '#0F2854' }}>Passport</p>
                  </button>

                  <button
                    onClick={() => setDocumentType('birth')}
                    className="p-4 rounded-xl border-2 transition-all"
                    style={{
                      backgroundColor: documentType === 'birth' ? '#E8F4F8' : 'white',
                      borderColor: documentType === 'birth' ? '#4988C4' : '#E8F4F8'
                    }}
                  >
                    <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#4988C4' }} strokeWidth={2} />
                    <p className="font-bold text-sm" style={{ color: '#0F2854' }}>Birth Certificate</p>
                  </button>
                </div>
              </div>

              {/* Document Number */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#5D6D7E' }}>
                  {documentType === 'aadhaar' ? 'Aadhaar Number' : 
                   documentType === 'passport' ? 'Passport Number' : 
                   'Birth Certificate Number'}
                </label>
                <input 
                  type="text" 
                  placeholder={documentType === 'aadhaar' ? 'XXXX XXXX XXXX' : 
                              documentType === 'passport' ? 'XXXXXXXXX' : 
                              'XXXX/XXXX/XXXX'}
                  className="w-full px-4 py-3 rounded-xl text-base font-medium border-2 focus:outline-none"
                  style={{ 
                    borderColor: '#E8F4F8',
                    color: '#0F2854'
                  }}
                />
              </div>

              {/* Upload Document */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#5D6D7E' }}>Upload Document</label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors hover:bg-gray-50" style={{ borderColor: '#E8F4F8' }}>
                  <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: '#4988C4' }} strokeWidth={2} />
                  <p className="text-base font-semibold mb-2" style={{ color: '#0F2854' }}>Drop document here or click to upload</p>
                  <p className="text-sm" style={{ color: '#5D6D7E' }}>PDF, JPG or PNG (Max 5MB)</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              className="flex-1 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90"
              style={{ 
                backgroundColor: 'white',
                border: '2px solid #E8F4F8',
                color: '#0F2854'
              }}
            >
              Cancel
            </button>
            <button 
              className="flex-1 py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
              style={{ 
                background: 'linear-gradient(90deg, #27AE60 0%, #1E8449 100%)'
              }}
            >
              Save Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}