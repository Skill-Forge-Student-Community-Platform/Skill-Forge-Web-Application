import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './ArticleModal.css';
import '../shared/ModalStyles.css';

const ArticleModal = ({ closeWindow }) => {
  return (
    <div className="modal-content" data-modal="article">
      <div className="modal-header">
        <h1>Write Article</h1>
        <button className="close-btn" onClick={closeWindow}><FaTimes /></button>
      </div>

      <div className="modal-content-scroll">
        <input type="text" placeholder="Article Title" />
        <textarea
          className="article-textarea"
          placeholder="Write your article content here..."
          rows={15}
        />
      </div>

      <div className="modal-footer">
        <button className="cancel-btn" onClick={closeWindow}>Cancel</button>
        <button className="primary-btn">Publish</button>
      </div>
    </div>
  );
};

export default ArticleModal;
