"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Phone, MessageSquare, Check, ChevronLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const hairTypes = [
  'Wig Installation',
  'Bundle Installation',
  'Frontal/Closure Install',
  'Wig Revamp',
  'Hair Coloring',
  'Hair Treatment',
  'Consultation',
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export const BookPage: React.FC = () => {
  const { setCurrentPage, addBooking } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    hairType: '',
    date: '',
    time: '',
    notes: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmit = () => {
    const booking = {
      id: `b${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      hairType: formData.hairType,
      preferredDate: `${formData.date} ${formData.time}`,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentPage('home');
    }, 3000);
  };
  
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.phone;
      case 2:
        return formData.hairType;
      case 3:
        return formData.date && formData.time;
      default:
        return true;
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 0801 234 5678"
                  className="w-full pl-12 pr-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                />
              </div>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <div className="grid grid-cols-1 gap-2">
              {hairTypes.map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, hairType: type })}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    formData.hairType === type
                      ? 'bg-gradient-peony text-white shadow-soft'
                      : 'bg-peony-50 text-gray-700 hover:bg-peony-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{type}</span>
                    {formData.hairType === type && (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, time })}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      formData.time === time
                        ? 'bg-gradient-peony text-white'
                        : 'bg-peony-50 text-gray-700 hover:bg-peony-100'
                    }`}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests or information..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300 resize-none"
                />
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-peony-50 rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-800">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{formData.hairType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{formData.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 min-h-screen bg-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-4 safe-area-top border-b border-peony-100">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 1 ? setStep(step - 1) : setCurrentPage('home')}
            className="p-2 -ml-2 hover:bg-peony-50 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          <h1 className="text-lg font-serif font-semibold text-gray-800">
            Book Installation
          </h1>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-peony-500' : 'bg-peony-100'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
      
      {/* Footer Buttons */}
      <div className="fixed bottom-[80px] left-0 right-0 px-4 z-30">
        <div className="max-w-[430px] mx-auto">
          <div className="bg-white rounded-2xl shadow-soft-lg p-4 border border-peony-100">
            <div className="flex gap-3">
              {step > 1 && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-peony-200 text-peony-600 font-semibold rounded-xl"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
                disabled={!isStepValid()}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all ${
                  isStepValid()
                    ? 'bg-gradient-peony text-white shadow-soft'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {step === 4 ? 'Confirm Booking' : 'Continue'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                We will contact you shortly to confirm your appointment.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookPage;

