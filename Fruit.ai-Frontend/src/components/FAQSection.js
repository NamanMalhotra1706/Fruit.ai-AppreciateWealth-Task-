import React, { useState, useEffect } from "react";
import FAQCard from "./FAQCard";
import "../componentCss/FAQSection.css";

const FAQSection = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); // For adding new FAQ
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    image: "",
    question: "",
    answer: "",
  });

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(
          "https://fruit-ai-appreciatewealth-task.onrender.com/faqs"
        );
        const data = await response.json();
        setFaqItems(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, [newItem]);

  // Handle delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `https://fruit-ai-appreciatewealth-task.onrender.com/faqs/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted FAQ from the state
        setFaqItems(faqItems.filter((item) => item._id !== deleteId));
        setShowDialog(false);
      } else {
        console.error("Error deleting FAQ:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDialog(false);
  };

  // Handle edit
  const handleEditClick = (item) => {
    setEditItem(item);
    setShowEditForm(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditItem({ ...editItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://fruit-ai-appreciatewealth-task.onrender.com/faqs/${editItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: editItem.question,
            answer: editItem.answer,
            image: editItem.image,
            image_name: editItem.image_name,
          }),
        }
      );

      if (response.ok) {
        const updatedFaq = await response.json();
        setFaqItems(
          faqItems.map((item) =>
            item._id === editItem._id ? updatedFaq : item
          )
        );
        setShowEditForm(false);
      } else {
        console.error("Failed to update FAQ");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  // Handle new FAQ creation
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();

    // Optimistically add the new FAQ to the state
    const optimisticFaq = {
      _id: Date.now().toString(), // Temporary ID, replace with real ID after successful creation
      ...newItem,
    };
    setFaqItems((prevFaqItems) => [...prevFaqItems, optimisticFaq]);

    try {
      const response = await fetch(
        "https://fruit-ai-appreciatewealth-task.onrender.com/faqs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: newItem.question,
            answer: newItem.answer,
            image: newItem.image,
            image_name: newItem.image_name,
          }),
        }
      );

      if (response.ok) {
        const newFaq = await response.json();
        setFaqItems((prevFaqItems) =>
          prevFaqItems.map((item) =>
            item._id === optimisticFaq._id ? newFaq : item
          )
        );
        setShowAddForm(false);
        setNewItem({ image: "", question: "", answer: "" });
      } else {
        console.error("Failed to create FAQ");
        setFaqItems((prevFaqItems) =>
          prevFaqItems.filter((item) => item._id !== optimisticFaq._id)
        );
      }
    } catch (error) {
      console.error("Error creating FAQ:", error);
      setFaqItems((prevFaqItems) =>
        prevFaqItems.filter((item) => item._id !== optimisticFaq._id)
      );
    }
  };

  return (
    <div className="faq-section">
      <h2 className="faq-section-title">FAQ Section</h2>

      {/* Button to show add form */}
      <button className="add-faq-btn" onClick={() => setShowAddForm(true)}>
        Add New FAQ
      </button>

      {/* Displaying the FAQ cards */}
      <div className="faq-list">
        {faqItems.map((faq) => (
          <FAQCard
            key={faq._id}
            id={faq._id} // Pass id to FAQCard
            image={faq.image || newItem.image}
            title={faq.question || newItem.question}
            description={faq.answer || newItem.answer}
            onDelete={handleDeleteClick} // Pass handleDeleteClick directly
            onEdit={handleEditClick} // Pass handleEditClick directly
          />
        ))}
      </div>

      {/* Add new FAQ form */}
      {showAddForm && (
        <div className="edit-form">
          <h3>Add New FAQ Item</h3>
          <form onSubmit={handleNewSubmit}>
            <label>
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleNewImageChange}
              />
              {newItem.image && (
                <img
                  src={newItem.image}
                  alt="Preview"
                  className="edit-form-image-preview"
                />
              )}
            </label>
            <label>
              Question:
              <input
                type="text"
                name="question"
                value={newItem.question}
                onChange={handleNewChange}
                required
              />
            </label>
            <label>
              Answer:
              <textarea
                name="answer"
                value={newItem.answer}
                onChange={handleNewChange}
                required
              />
            </label>
            <button type="submit" className="confirm-btn">
              Add FAQ
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Confirm delete dialog */}
      {showDialog && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this item?</p>
          <button className="confirm-btn" onClick={handleConfirmDelete}>
            Yes, Delete
          </button>
          <button className="cancel-btn" onClick={handleCancelDelete}>
            Cancel
          </button>
        </div>
      )}

      {/* Edit FAQ form */}
      {showEditForm && (
        <div className="edit-form">
          <h3>Edit FAQ Item</h3>
          <form onSubmit={handleEditSubmit}>
            <label>
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {editItem.image && (
                <img
                  src={editItem.image}
                  alt="Preview"
                  className="edit-form-image-preview"
                />
              )}
            </label>
            <label>
              Question:
              <input
                type="text"
                name="question"
                value={editItem.question}
                onChange={handleEditChange}
                required
              />
            </label>
            <label>
              Answer:
              <textarea
                name="answer"
                value={editItem.answer}
                onChange={handleEditChange}
                required
              />
            </label>
            <button type="submit" className="confirm-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
