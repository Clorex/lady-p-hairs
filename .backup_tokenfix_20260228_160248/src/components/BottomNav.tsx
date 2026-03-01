import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Image, Heart, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Page } from '@/types';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'essence', label: 'Essence', icon: Heart },
  { id: 'book', label: 'Book', icon: Calendar },
];

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, cartCount } = useApp();
  
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
    >
      <div className="max-w-[430px] mx-auto">
        <div className="bg-white/95 backdrop-blur-lg border-t border-peony-100 shadow-soft-lg rounded-t-3xl px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex flex-col items-center py-2 px-3"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`relative p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-gradient-peony text-white'
                        : 'text-gray-400 hover:text-peony-400'
                    }`}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    
                    {/* Cart badge */}
                    {item.id === 'shop' && cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-peony-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </motion.div>
                  
                  <span
                    className={`text-[10px] mt-1 font-medium transition-colors ${
                      isActive ? 'text-peony-600' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-peony-500"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNav;
