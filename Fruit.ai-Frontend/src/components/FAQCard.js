import React from 'react';
import PropTypes from 'prop-types';
import '../componentCss/FAQCard.css';

const FAQCard = ({ id, image, title, description, onDelete, onEdit, altText }) => {
  return (
    <div className="faq-card">
      <div className="faq-image">
        <img src={image || 'default-image.jpg'} alt={altText || title || 'FAQ Image'} />
      </div>
      <div className="faq-content">
        <h3>{title || 'No Title'}</h3>
        <p>{description || 'No Description'}</p>
      </div>
      <div className="faq-actions">
        <button onClick={() => onEdit(id)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
};


FAQCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  altText: PropTypes.string
};

FAQCard.defaultProps = {
  altText: 'FAQ Image'
};

export default FAQCard;

