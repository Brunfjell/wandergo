import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';

const ModalButton = ({ modal, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-center gap-4 w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
      aria-label={`Open ${modal.title} information`}
    >
      <div className="flex-1 text-left">
        <h3 className="text-[16px] md:text-[13px] font-medium text-gray-900 group-hover:text-green-600 transition-colors">
          {modal.title}
        </h3>
      </div>
      <FiChevronRight className="text-gray-400 group-hover:text-green-500 transition-colors" />
    </motion.button>
  );
};

export default ModalButton;