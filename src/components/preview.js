import React, { useState } from "react";

export default function Preview({ editorText, editorSpanText }) {
  const [ previewText, setPreviewText ] = useState('');

  return (
    <>
      {/* <div
        dangerouslySetInnerHTML={{ __html: editorText }}>
      </div>
      <div>
        {editorText}
      </div> */}
      <div id="output-text"></div>
    </>
  )
}
