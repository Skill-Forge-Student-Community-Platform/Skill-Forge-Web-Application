// import React, { useState } from 'react';
// import TopToolbar from './components/Controls/TopToolbar';  // Updated path
// import EditorPreview from './components/EditorPreview/EditorPreview';
// import EditorControls from './components/EditorControls/EditorControls';
// import useEditorStore from './store/editorStore';
// import './ProcessingStage.css';

// const ProcessingStage = ({ media, onComplete, onBack }) => {
//   const [activeTool, setActiveTool] = useState('crop');

//   const handleSave = () => {
//     onComplete(media);
//   };

//   return (
//     <div className="processing-stage">
//       <div className="Top-Toolbar">
//       <TopToolbar onClose={onBack} onSave={handleSave} />
//       </div>

//       <div className="editor-main">
//         <EditorPreview image={media[0]} />
//       </div>
//       <div className="Tools-controlBar">
//       <EditorControls
//           activeTool={activeTool}
//           onToolChange={setActiveTool}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProcessingStage;
