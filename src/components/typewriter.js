import { createElement, useState } from "react";
import TypewriterControls from "./typewriterControls";

export default function Typewriter({ editorText, editorSpanText, selectedText, selectedDelta }) {
  const [typewriterData, setTypewriterData] = useState(Array(1).fill(null));
  const [typewriterOps, setTypewriterOps] = useState(
    {
      content: editorText,
      type: 'char',
      rate: 40,
      delay: 1000
    });





  return (
    <>
      <TypewriterControls
        editorText={editorText}
        editorSpanText={editorSpanText}
        selectedText={selectedText}
        selectedDelta={selectedDelta}
        setTypewriterOps={setTypewriterOps}
        typewriterOps={typewriterOps}
      />

      <div>
        <p>Current Selection: {selectedText}</p>
      </div>

    </>
  );
}


export function animateEntireEditor({ typewriterOps }) {
  console.log(typewriterOps)
  const { content, rate, delay, type } = typewriterOps;
  writeTextDelta(content, rate, delay);
}

const attributeTypes = {
  'bold': 'strong',
  'italic': 'em',
  'underline': 'u',
  'strike': 's',
  'code': 'code',
  'blockquote': 'blockquote',
  'code-block': 'pre',
  'sub': 'sub',
  'sup': 'sup'
};



function writeTextDelta(delta, rate, delay) {
  return new Promise((resolve) => {
    const ops = delta['ops'];
    console.log(ops)
    const outBlock = document.getElementById('output-text');
    outBlock.innerHTML = '';

    let opIdx = 0, charIdx = 0, opsLen = ops.length;
    let wrapper = document.createElement('span');
    let textNodePointer = wrapper;
    outBlock.append(wrapper);
    let startTags = [], endTags = [];

    let writeStream = window.setInterval(() => {
      console.log(opIdx)
      if (opIdx < opsLen) {
        const attributes = ops[opIdx]['attributes'];
        const deltaChars = ops[opIdx]['insert'];

        const nextChar = deltaChars[charIdx++];
        // Create the tags
        // if (attributes !== undefined) {
        //   for (let key in attributes) {
        //     if (attributeTypes[key] === undefined) { continue; }
        //     startTags.push(`<${attributeTypes[key]}>`);
        //     endTags.push(`</${attributeTypes[key]}>`)
        //   }
        //   let temp = document.createElement('div');
        //   temp.innerHTML = startTags.join('') + endTags.join('');
        //   wrapper = temp.firstChild;
        //   console.log(wrapper);
        //   textNodePointer = getDeepestNode(wrapper);
        // }

        textNodePointer.textContent += nextChar;

        if (charIdx == deltaChars.length) {
          opIdx++;
          charIdx = 0;
        }
      } else {
        clearInterval(writeStream);
        setTimeout(() => { return resolve(delta); }, delay);
      }
    }, rate);
  });
}

function getDeepestNode(parent){
  if (parent.hasChildNodes) {
    return getDeepestNode(parent.firstChild);
  }
  return parent;
}