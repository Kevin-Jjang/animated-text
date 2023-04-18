import { useState } from 'react';
import './App.css';
import Editor from './components/editor';
import Layout from './components/layout';
import Preview from './components/preview';
import Typewriter from './components/typewriter';

function App() {
  const [ editorText, setEditorText ] = useState('');
  const [ editorSpanText, setEditorSpanText ] = useState(null);
  const [ selectedText, setSelectedText ] = useState(null);
  const [ selectedDelta, setSelectedDelta ] = useState(null);


  return (
    <Layout>
      <Editor 
        onEditorTextChange={setEditorText}
        currentSelection={setSelectedText}
        selectedDelta={setSelectedDelta}
        editorSpanText={setEditorSpanText}/>
      <Preview 
        editorText={editorText}
        editorSpanText={editorSpanText}
        />
      <Typewriter
        editorText={editorText}
        editorSpanText={editorSpanText}
        selectedText={selectedText}
        selectedDelta={selectedDelta}
        />
    </Layout>
  );
}

export default App;
