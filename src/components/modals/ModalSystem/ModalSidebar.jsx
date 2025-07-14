const ModalSidebar = ({ 
  sections, 
  activeSection, 
  setActiveSection,
  modalTitle
}) => (
  <div className="h-full flex flex-col p-4">
    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      {modalTitle}
    </h2>
    
    <nav className="flex-1 overflow-y-auto space-y-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`w-full text-left rounded-lg transition-colors flex items-center py-2 gap-3 ${
            activeSection === section.id
              ? 'bg-green-100 text-green-700'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className="text-lg">{section.icon}</span>
          <span>{section.title}</span>
        </button>
      ))}
    </nav>
  </div>
);

export default ModalSidebar;