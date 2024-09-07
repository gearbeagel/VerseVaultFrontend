import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCsrfTokenFromCookie } from "../misc/Api";
import { useLoading } from '../context/LoadingContext';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

function EditChapter() {
  const { id } = useParams(); // Get chapter ID from URL
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const { loading, setLoading } = useLoading(); // Access loading state
  const [wordCount, setWordCount] = useState(0); // State for word count

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      TextAlign.configure({ types: ['paragraph'] }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
      setWordCount(countWords(editor.getText()));
    },
  });

  useEffect(() => {
    // Fetch the chapter data based on ID
    const fetchChapter = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`http://localhost:8000/works/chapters/${id}/`);
        setTitle(response.data.title);
        if (editor) {
          editor.commands.setContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching chapter data:", error);
        toast.error("Failed to fetch chapter. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchChapter();

    return () => {
      if (editor) {
        editor.destroy(); // Cleanup editor on unmount
      }
    };
  }, [id, editor, setLoading]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const csrfToken = getCsrfTokenFromCookie("csrftoken");

    setLoading(true); // Set loading to true

    try {
      await axios.put(
        `http://localhost:8000/works/chapters/${id}/`,
        { title, content: editorContent },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );
      toast.success("Chapter updated successfully!");
    } catch (error) {
      console.error("Error details:", error.response?.data); // Log the error response for details
      const errorMessage = error.response?.data?.work?.[0] || "Failed to update chapter. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-12">
          <div className="card shadow-lg rounded" style={{ maxWidth: '1500px', margin: 'auto 0' }}>
            <h2 className="card-title p-3">Edit Chapter</h2>
            <form onSubmit={handleUpdate}>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label htmlFor="title">Chapter Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="content">Content</label>
                  <div className="editor-toolbar">
                    <button
                      type="button"
                      className="btn btn-sw mt-1 me-2"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                      <i className="bi bi-type-bold"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sw mt-1 me-2"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                      <i className="bi bi-type-italic"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sw mt-1 me-2"
                      onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    >
                      <i className="bi bi-text-left"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sw mt-1 me-2"
                      onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    >
                      <i className="bi bi-text-center"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sw mt-1 me-2"
                      onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    >
                      <i className="bi bi-text-right"></i>
                    </button>
                  </div>
                  <div className="editor-container">
                    <EditorContent editor={editor} />
                  </div>
                  <div className="badge bg-sw mt-2">
                    <span>Word count: {wordCount}</span>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-sw mt-3" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditChapter;
