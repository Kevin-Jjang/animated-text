import React from "react";
import { useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import sanitizeHTML from "sanitize-html";
import 'react-quill/dist/quill.snow.css';

export default function Editor({ onEditorTextChange, currentSelection, selectedDelta, editorSpanText }) {
  const quillRef = useRef(null);

  function updateHTMLPreview() {
    const editor = quillRef.current.getEditor();
    const unprivilegedEditor = quillRef.current.makeUnprivilegedEditor(editor);
    const userHTML = unprivilegedEditor.getHTML();
    const sanitizedHTML = sanitizeHTML(userHTML, {
      allowedAttributes: false
    });
    // console.log(userHTML);
    // console.log(sanitizedHTML);
    onEditorTextChange(sanitizedHTML);

    const tempWrap = document.createElement('div');
    tempWrap.innerHTML = sanitizedHTML;
    
    const spannedText = wrapWithSpan(tempWrap.firstChild);
    console.log('editor spannedText', spannedText)
    editorSpanText(spannedText);
    const delta = unprivilegedEditor.getContents();
    selectedDelta(delta);
  }

  function updateSelection(range, editor) {
    if (range === null || range.length === 0) {
      // currentSelection(null); // Remove selection if focus is lost
      return;
    }

    const selectionText = editor.getText(range.index, range.length);
    currentSelection(selectionText);

    const delta = editor.getContents(range.index, range.length);
    console.log(delta);
    const spanQuill = new Quill(document.createElement('span'));
    spanQuill.setContents(delta);
    const pSelection = spanQuill.root.firstChild;
    console.log(pSelection)
    const spanText = wrapWithSpan(pSelection);
    selectedDelta(spanText.outerHTML);
  }

  function wrapWithSpan(pElement) {
    

    let spanSelection = document.createElement('span');
    while (pElement.firstChild) {
      spanSelection.appendChild(pElement.firstChild);
    }
    for (let i = pElement.attributes.length-1; i >= 0; i--) {
      spanSelection.attributes.setNamedItem(pElement.attributes[i].cloneNode());
    }
    return spanSelection.outerHTML;
  }

  const modules = {
    toolbar: [
      [{'font': []}],
      [{ 'header': [1, 2,3,4,5,6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': []}, {'background': []}],
      [{'align': []}],
      [{ 'direction': 'rtl' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      ['clean']
    ]
  }

  return (
    <ReactQuill
      ref={quillRef}
      modules={modules}
      onChange={updateHTMLPreview}
      style={{
        height: '80%'
      }} />
  );
}


// onChangeSelection={(range, s, editor) => { updateSelection(range, editor) }}
