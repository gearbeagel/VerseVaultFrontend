import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCsrfTokenFromCookie } from '../misc/Api'; // Ensure this is your CSRF token utility
import { toast } from 'react-toastify';

function BookmarkModal({ workId, showModal, handleClose, setBookmark }) {
  const [note, setNote] = useState('');
  const [bmType, setBmType] = useState('BM-S'); // Default to "BM-S"
  const [bindedChapter, setBindedChapter] = useState(''); // State for binded chapter
  const [chapters, setChapters] = useState([]);
  const [userId, setUserId] = useState(null);
  const csrfToken = getCsrfTokenFromCookie('csrftoken');

  const BOOKMARK_CHOICES = [
    { value: 'BM-S', label: 'Story bookmark' },
    { value: 'BM-C', label: 'Chapter bookmark' },
  ];

  // Fetch chapters for the selected work
  const fetchChapters = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/works_writing/chapters/?work=${workId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setChapters(response.data);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  // Fetch current user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/misc/current_user/', {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.id) {
        setUserId(response.data.id); // Set user ID
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserId(null);
    }
  };

  // Fetch chapters and user data when modal is shown
  useEffect(() => {
    if (showModal) {
      fetchChapters(); // Fetch chapters when modal is shown
      fetchUser(); // Fetch user data when modal is shown
    }
  }, [showModal]);

  const handleSaveBookmark = async () => {
    // Convert values to integers
    const parsedWorkId = parseInt(workId, 10); // Ensure workId is converted to an integer
    const parsedBindedChapterId = bmType === 'BM-C' ? parseInt(bindedChapter, 10) : null; // Convert if BM-C

    console.log("Saving bookmark with data:", {
      work: parsedWorkId,
      note,
      bm_type: bmType,
      binded_chapter: parsedBindedChapterId,
      user: userId,
    });

    try {
      const response = await axios.post(
        'http://localhost:8000/works_reading/bookmarks/',
        {
          work: parsedWorkId,
          note,
          bm_type: bmType,
          binded_chapter: parsedBindedChapterId,
          user: userId,
        },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      toast.success('Bookmark added successfully');
      setBookmark = true;
      handleClose();
    } catch (error) {
      toast.error('Failed to add bookmark');
      console.error(error);
    }
  };

  return (
    <>
      {showModal && <div className={`modal-overlay show`} onClick={handleClose} />}
      <div className={`modal align-items-center${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content custom-modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Bookmark</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="note">Note</label>
                <textarea
                  className="form-control"
                  id="note"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="bmType">Bookmark Type</label>
                <select
                  className="form-control"
                  id="bmType"
                  value={bmType}
                  onChange={(e) => setBmType(e.target.value)}
                >
                  {BOOKMARK_CHOICES.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </div>
              {bmType === "BM-C" && (
                <div className="form-group mt-3">
                  <label htmlFor="bindedChapter">Binded Chapter</label>
                  <select
                    className="form-control"
                    id="bindedChapter"
                    value={bindedChapter}
                    onChange={(e) => setBindedChapter(e.target.value)} // Set the binded chapter ID
                  >
                    <option value="">Select a chapter</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title} {/* Assuming each chapter has an id and title */}
                      </option>
                    ))}
                  </select>
                  <small className="form-text text-muted">
                    Select the chapter to bind to this bookmark.
                  </small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button type="button" className="btn btn-sw" onClick={handleSaveBookmark}>
                Save Bookmark
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookmarkModal;
