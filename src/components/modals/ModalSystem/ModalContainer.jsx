import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ModalSidebar from './ModalSidebar';
import ModalContent from './ModalContent';
import { FiX } from 'react-icons/fi';

const ModalContainer = ({ 
  isOpen, 
  onClose, 
  modal, 
  sections 
}) => {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (isOpen) setActiveSection(null);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-xl w-full md:w-3xl max-w-6xl max-h-screen overflow-y-auto flex overflow-hidden border border-gray-200 text-[clamp(0.8rem,1vw,1rem)]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 z-10"
              aria-label="Close modal"
            >
              <FiX className="h-5 w-5 text-gray-500" />
            </button>

            <div className="w-[40%] md:w-[30%] font-bold border-r border-gray-200 bg-gray-50 overflow-y-auto">
              <ModalSidebar 
                sections={sections}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                modalTitle={modal.title}
              />
            </div>

            <div className="w-[60%] md:w-[70%] overflow-y-auto">
              <ModalContent 
                section={sections.find(s => s.id === activeSection)}
                hasSections={sections.length > 0}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalContainer;
