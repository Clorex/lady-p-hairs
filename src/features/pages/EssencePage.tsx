"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Crown, 
  Phone, 
  MapPin, 
  Instagram, 
  MessageCircle,
  CreditCard,
  Building2,
  User,
  Clock,
  Mail
} from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export const EssencePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative px-4 pt-6 pb-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-peony p-8 text-white shadow-soft-lg text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Crown className="w-10 h-10 text-yellow-200" />
            </motion.div>
            
            <h1 className="text-3xl font-serif font-bold mb-2">
              Lady P Hairs
            </h1>
            <p className="text-white/90 text-sm">
              Elevating Natural Beauty Since 2020
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Brand Story */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mb-8"
      >
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-peony-50">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-peony-500" />
            <h2 className="text-lg font-serif font-semibold text-gray-800">Our Story</h2>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Lady P Hairs was born from a simple belief: every woman deserves to feel 
              confident, beautiful, and empowered. What started as a passion project in 
              2020 has blossomed into a trusted destination for premium hair extensions 
              and transformative beauty experiences.
            </p>
            <p>
              We source only the finest 100% human hair, carefully selecting each bundle 
              and wig to ensure exceptional quality, longevity, and natural appearance. 
              Our commitment to authenticity means you can style, dye, and treat your 
              Lady P hair just like your own.
            </p>
            <p>
              But we are more than just hair. We are a community of queens supporting 
              queens, celebrating the diverse beauty of African women everywhere. From 
              our expert installation services to our personalized consultations, we are 
              here to help you discover your perfect look.
            </p>
          </div>
        </div>
      </motion.section>
      
      {/* Values */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mb-8"
      >
        <h2 className="text-lg font-serif font-semibold text-gray-800 mb-4">
          Our <span className="text-gradient-peony">Values</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Sparkles, title: 'Quality', desc: 'Premium grade hair' },
            { icon: Heart, title: 'Care', desc: 'Customer first always' },
            { icon: Crown, title: 'Excellence', desc: 'Expert craftsmanship' },
            { icon: MessageCircle, title: 'Community', desc: 'Queens support queens' },
          ].map((value, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-soft rounded-2xl p-4 border border-peony-100"
            >
              <value.icon className="w-6 h-6 text-peony-500 mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm">{value.title}</h3>
              <p className="text-xs text-gray-500">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Contact Info */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mb-8"
      >
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-peony-50">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-peony-500" />
            <h2 className="text-lg font-serif font-semibold text-gray-800">Contact Us</h2>
          </div>
          
          <div className="space-y-4">
            <a 
              href="tel:+2348012345678" 
              className="flex items-center gap-3 p-3 bg-peony-50 rounded-xl hover:bg-peony-100 transition-colors"
            >
              <div className="w-10 h-10 bg-peony-400 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone/WhatsApp</p>
                <p className="font-medium text-gray-800">+234 801 234 5678</p>
              </div>
            </a>
            
            <a 
              href="mailto:hello@ladyphairs.com" 
              className="flex items-center gap-3 p-3 bg-peony-50 rounded-xl hover:bg-peony-100 transition-colors"
            >
              <div className="w-10 h-10 bg-peony-400 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">hello@ladyphairs.com</p>
              </div>
            </a>
            
            <div className="flex items-center gap-3 p-3 bg-peony-50 rounded-xl">
              <div className="w-10 h-10 bg-peony-400 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Business Hours</p>
                <p className="font-medium text-gray-800">Mon - Sat: 9AM - 6PM</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Pickup Location */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mb-8"
      >
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-peony-50">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-peony-500" />
            <h2 className="text-lg font-serif font-semibold text-gray-800">Pickup Location</h2>
          </div>
          
          <div className="bg-peony-50 rounded-xl p-4">
            <p className="font-medium text-gray-800 mb-1">Lady P Hairs Studio</p>
            <p className="text-sm text-gray-600">
              123 Beauty Lane, Lekki Phase 1
              <br />
              Lagos, Nigeria
            </p>
            <p className="text-xs text-peony-600 mt-2">
              * Appointment required for pickup
            </p>
          </div>
        </div>
      </motion.section>
      
      {/* Bank Details */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4 mb-8"
      >
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-peony-50">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-peony-500" />
            <h2 className="text-lg font-serif font-semibold text-gray-800">Bank Details</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Bank</p>
                <p className="font-semibold text-gray-800">Opay</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-peony-50 rounded-xl">
              <div className="w-10 h-10 bg-peony-400 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Account Number</p>
                <p className="font-semibold text-gray-800">812 3456 7890</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-peony-50 rounded-xl">
              <div className="w-10 h-10 bg-peony-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="font-semibold text-gray-800">Lady P Hairs</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Please use your name as payment reference
          </p>
        </div>
      </motion.section>
      
      {/* Social Links */}
      <motion.section 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="px-4"
      >
        <h2 className="text-lg font-serif font-semibold text-gray-800 mb-4">
          Follow <span className="text-gradient-peony">Us</span>
        </h2>
        
        <div className="flex gap-3">
          <motion.a
            href="https://instagram.com/ladyphairs"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl p-4 text-white text-center"
          >
            <Instagram className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">@ladyphairs</p>
          </motion.a>
          
          <motion.a
            href="https://wa.me/2348012345678"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-green-500 rounded-2xl p-4 text-white text-center"
          >
            <MessageCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">WhatsApp</p>
          </motion.a>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default EssencePage;

