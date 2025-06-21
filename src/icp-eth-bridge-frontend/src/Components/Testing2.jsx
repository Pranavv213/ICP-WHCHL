import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';


const SimpleEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit], // Add basic features: bold, italic, headings, etc.
    content: '<p>Start writing...</p>',
  });
  const [text,setText]=useState('')

  // Use useEffect to focus the editor and place the cursor at the left margin when the component mounts
  useEffect(() => {
    if (editor) {
      // Delay focus so that the editor is fully initialized
      setTimeout(() => {
        editor.commands.focus(); // Focus the editor to ensure the cursor appears
        editor.chain().focus().run(); // Force the cursor to the start
      }, 100);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div >
      {/* Toolbar with buttons */}
      <div>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>Heading</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</button>
      </div>

      {/* The editable content area with increased height */}
      <div
        style={{
          height: '50vh',
          overflowY: 'auto',
          border: '1px solid #ccc', // Optional: Add a border to the editor
          backgroundColor:'white',width:'20em'
        }}
      >
        <EditorContent
          editor={editor}
          style={{
            padding: '10px', // Optional: Add padding for better layout
          }}
        />
      </div>
<br></br>
<button onClick={()=>{
    setText(editor.getHTML())
}}>Extract Text</button>
      {/* Inline CSS to remove focus outline */}
      <style>
        {`
          .ProseMirror:focus {
            outline: none !important;  /* Remove focus outline */
            box-shadow: none !important; /* Remove focus shadow */
          }
        `}
      </style>
      <br></br>

      <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
           color:'white'
          }}
          dangerouslySetInnerHTML={{ __html: text }} // Render HTML content with formatting
        />
     
    </div>
  );
};

export default SimpleEditor;
