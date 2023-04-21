import { useState } from "react";
import TypewriterControls from "./typewriterControls";
import QueueList from "./queueList";

export default function Typewriter({ editorText, editorSpanText, selectedText, selectedDelta }) {
  const [typewriterData, setTypewriterData] = useState(Array(1).fill({typewriterOps: null, queue: 0}));
  const [typewriterOps, setTypewriterOps] = useState(
    {
      content: selectedDelta,
      type: 'char',
      rate: 40,
      delay: 1000,
      queue: 0
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
      <QueueList>

      </QueueList>
    </>
  );
}

export function deleteAllAnimations({ setTypewriterData, setTypewriterOps }) {
  setTypewriterData(null);
  setTypewriterOps(null);
}

export function animateEntireEditor({ typewriterOps }) {
  console.log(typewriterOps)
  const { content, rate, delay, type, queue } = typewriterOps;

  const { taggedOps, tagBreakpoints } = preprocessDeltaContent(content);

  if (type === 'char') {
    writeTextDelta(taggedOps, rate, delay, queue, tagBreakpoints);
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

function preprocessDeltaContent(delta) {
  const ops = delta['ops'];
  let tagBreakpoints = [];
  ops.forEach(op => {
    const text = op['insert'];
    op['insert'] = op['insert'].replace('<script>', ''); // Remove main XSS script attack
    op['insert'] = op['insert'].replace(/\n/g, '<br/>');
    tagBreakpoints.push(findTagIdx('<br/>', text));
  });
  console.log('breakpoints', tagBreakpoints)
  const taggedOps = delta;
  return { taggedOps, tagBreakpoints };
}

function findTagIdx(tag, string) {
  let a = [], i = -1;
  while ((i = string.indexOf(tag, i + 1)) >= 0) {
    // console.log('found at i:', i);
    a.push({ tag: tag, i: i });
  }
  return a;
}

async function writeTextDelta(delta, rate, delay, queue, tagBreakpoints) {
  return new Promise(async (resolve) => {
    const ops = delta['ops'];
    const outBlock = document.getElementById('output-text');
    outBlock.innerHTML = '';

    let opIdx = 0, charIdx = 0, opsLen = ops.length;
    let wrapper = document.createElement('span');
    wrapper.id = queue;
    let styledBlock, textNodePointer;
    let startTags = [], endTags = [];

    tagBreakpoints.sort(function (a, b) {
      return a.i < b.i;
    });

    let tagB = [], idxB = [], b = 0;
    for (let i = 0; i < tagBreakpoints[0].length; i++) {
      tagB.push(tagBreakpoints[0][i]['tag']);
      idxB.push(tagBreakpoints[0][i]['i']);
    }

    console.log(tagB, idxB)
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


      // const nextChar = deltaChars[charIdx++];
      // console.log(nextChar);
      if (charIdx === idxB[b]) {
        textNodePointer.innerHTML += tagB[b];
        charIdx += tagB[b].length;
        b++;
      } else {
        textNodePointer.innerHTML += deltaChars[charIdx++];
      }
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
        // console.log('inpromise');
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