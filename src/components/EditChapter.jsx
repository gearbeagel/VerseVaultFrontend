import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCsrfTokenFromCookie } from "../misc/Api";
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

function EditChapter() {
  const { id, workId } = useParams(); 
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [initialTitle, setInitialTitle] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const navigate = useNavigate();
  const isEditMode = Boolean(id); 

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
    if (isEditMode) {
      const fetchChapter = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/works/chapters/${id}/`);
          setTitle(response.data.title);
          setInitialTitle(response.data.title); 
          setEditorContent(response.data.content);
          setInitialContent(response.data.content); 
          if (editor) {
            editor.commands.setContent(response.data.content);
          }
        } catch (error) {
          console.error("Error fetching chapter data:", error);
          toast.error("Failed to fetch chapter. Please try again later.");
        }
      };

      fetchChapter();
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [id, editor, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = getCsrfTokenFromCookie("csrftoken");
  
    if (wordCount < 10) {
      toast.error(<div>We know brevity is great, but try writing about <strong>10 words</strong>?</div>, {
        html: true 
      });
      return; 
    }
    
    const requestData = { 
      title, 
      content: editorContent, 
      work_id: workId
    };
  
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8000/works/chapters/${id}/`, requestData, {
          headers: { "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
          withCredentials: true,
        });
        toast.success("Chapter updated successfully!");
      } else {
        await axios.post("http://localhost:8000/works/chapters/", requestData, {
          headers: { "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
          withCredentials: true,
        });
        toast.success("Chapter created successfully!");
        navigate(`/story/${workId}`);
      }
    } catch (error) {
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.work?.[0] || "Failed to submit chapter. Please try again.";
      toast.error(errorMessage);
    }
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  const hasChanges = () => {
    return title !== initialTitle || editorContent !== initialContent;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-12">
          <div className="card shadow-lg rounded" style={{ maxWidth: '1500px', margin: 'auto 0' }}>
            <h2 className="card-title p-3">
              {isEditMode ? "Edit Chapter" : "Create Chapter"}
            </h2>
            <form onSubmit={handleSubmit}>
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
              <div className="card-footer text-center">
                <button type="submit" className="btn btn-sw mt-3 w-75" disabled={!hasChanges()}>
                  {(isEditMode ? "Save Changes" : "Create Chapter")}
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
