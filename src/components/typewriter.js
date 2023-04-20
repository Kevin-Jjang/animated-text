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
        setTypewriterData={setTypewriterData}
      />

      <div>
        <p>Current Selection: {selectedText}</p>
      </div>

    </>
  );
}

export function deleteAllAnimations({ setTypewriterData, setTypewriterOps }) {
  setTypewriterData(null);
  setTypewriterOps(null);
}

export function animateEntireEditor({ typewriterOps }) {
  console.log(typewriterOps)
  const { content, rate, delay, type } = typewriterOps;

  const taggedOps = preprocessDeltaContent(content);

  if (type === 'char') {
    writeTextDelta(taggedOps, rate, delay);
  } else {
    console.log('word is not implemented');
    return;
  }
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

const newLine = {
  '\\n': '<br/>'
};


function preprocessDeltaContent(delta) {
  const ops = delta['ops'];
  ops.forEach(op => {
  // let text = op['insert'];
  // console.log(text);
  // console.log(ops, ops['insert']);
  op['insert'] = op['insert'].replace(/\n/g, '<br/>');
  // console.log(tArr);
  });

  return delta;
}


async function writeTextDelta(delta, rate, delay) {
  return new Promise(async (resolve) => {
    const ops = delta['ops'];
    console.log(ops)
    const outBlock = document.getElementById('output-text');
    outBlock.innerHTML = '';

    let opIdx = 0, charIdx = 0, opsLen = ops.length;
    let wrapper = document.createElement('span');
    let styledBlock, textNodePointer;
    let startTags = [], endTags = [];

    outBlock.appendChild(wrapper);
    while (opIdx < opsLen) {
      const attributes = ops[opIdx]['attributes'];
      const deltaChars = ops[opIdx]['insert'];

      if (attributes !== undefined && startTags.length === 0) {
        for (let key in attributes) {
          if (attributeTypes[key] === undefined) { continue; }
          startTags.push(`<${attributeTypes[key]}>`);
          endTags.push(`</${attributeTypes[key]}>`)
        }
        if (startTags.length === 0) {
          textNodePointer = wrapper;
        } else {
          styledBlock = document.createElement('div');
          styledBlock.innerHTML = startTags.join('') + endTags.join('');
          // console.log('temp', styledBlock, styledBlock.firstChild);
          wrapper.appendChild(styledBlock.firstChild);
          textNodePointer = getDeepestNode(wrapper);
          styledBlock = wrapper;
        }

      } else if (attributes === undefined) {
        textNodePointer = wrapper;
      }
      // console.log('pointer:', textNodePointer);


      const nextChar = deltaChars[charIdx++];
      console.log(nextChar);
      if (nextChar === '<') {
        textNodePointer.innerHTML += '<br/>';
        charIdx += 4
        console.log('insert <br/>', textNodePointer)
      } else {
        textNodePointer.innerHTML += nextChar;
      }
      // console.log(charIdx);

      // console.log('wrapafter', wrapper);
      // console.log('styled', styledBlock.firstChild);
      if (charIdx >= deltaChars.length) {
        console.log('end of op');
        opIdx++;
        charIdx = 0;
        startTags = endTags = [];
        styledBlock = textNodePointer = undefined;
        if (opIdx < opsLen) {
          wrapper = document.createElement('span');
          outBlock.appendChild(wrapper);
        }
      }
      await new Promise((resolveInner) => {
        console.log('inpromise');
        setTimeout(resolveInner, rate);
      })
    }
    console.log('END OF WHILE WRAPPER', wrapper);

    setTimeout(() => {
      return resolve(delta);
    }, delay);
  });
}

function getDeepestNode(node) {
  if (node.children !== null && node.firstChild.children.length === 0) {
    console.log('deepest:', node.firstChild);
    return node.firstChild;
  }
  return getDeepestNode(node.firstChild);
}


// let writeStream = window.setInterval(() => {
//   console.log(opIdx)
//   if (opIdx < opsLen) {
//     const attributes = ops[opIdx]['attributes'];
//     const deltaChars = ops[opIdx]['insert'];

//     const nextChar = deltaChars[charIdx++];
//     // Create the tags
//     if (attributes !== undefined && startTags.length === 0) {
//       for (let key in attributes) {
//         if (attributeTypes[key] === undefined) { continue; }
//         startTags.push(`<${attributeTypes[key]}>`);
//         endTags.push(`</${attributeTypes[key]}>`)
//       }
//       let temp = document.createElement('div');
//       temp.innerHTML = startTags.join('') + endTags.join('');
//       console.log('temp', temp, temp.firstChild);
//       wrapper.append(temp.firstChild);
//       textNodePointer = getDeepestNode(wrapper);
//       console.log('pointer:', textNodePointer);
//     } else {
//       textNodePointer = wrapper;
//     }

//     textNodePointer.textContent += nextChar;
//     console.log('after char', textNodePointer);
//     console.log('wrapafter', wrapper);

//     if (charIdx == deltaChars.length) {
//       opIdx++;
//       charIdx = 0;
//       startTags = endTags = [];
//     }
//   } else {
//     clearInterval(writeStream);
//     setTimeout(() => { return resolve(delta); }, delay);
//   }
// }, rate);