import { motion } from 'framer-motion';

const ModalContent = ({ section, hasSections }) => (
  <div className="h-full flex flex-col">
    {!section ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700">
            {hasSections ? "Select an item from the sidebar" : "No content available"}
          </h3>
          <p className="text-gray-500 mt-2">
            {hasSections ? "Choose a topic to view details" : "Check back later for updates"}
          </p>
        </div>
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 overflow-y-auto prose prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    )}
  </div>
);

export default ModalContent;