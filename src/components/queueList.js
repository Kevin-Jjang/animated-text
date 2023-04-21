import { useEffect, useState } from "react";
import { Box, Grid, List, ListItem, ListItemText } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReorderIcon from '@mui/icons-material/Reorder';
import DeleteIcon from '@mui/icons-material/Delete';

export default function QueueList({ typewriterData }) {
  // const initialData = {
  //   typewriterData: [
  //     {
  //       'q0': {
  //         content: 'here is an example',
  //         type: 'char',
  //         rate: 40,
  //         delay: 1000,
  //         id: 'q0'
  //       },
  //     }],
  //   columns: {
  //     'col-1': {
  //       id: 'col-1',
  //       title: 'Typewriter Animation Pane',
  //       idIds: ['q0', 'q1', 'q2', 'q3']
  //     }
  //   },
  //   columnOrder: ['col-1'],
  // };

  let a = {
    content: 'here is an example',
    type: 'char',
    rate: 40,
    delay: 1000,
    id: 'q-0'
  }
  let b = {
    content: '1',
    type: 'char',
    rate: 40,
    delay: 1000,
    id: 'q-1'
  }
  let c = {
    content: '2',
    type: 'char',
    rate: 40,
    delay: 1000,
    id: 'q-2'
  }
  let d = {
    content: '3',
    type: 'char',
    rate: 40,
    delay: 1000,
    id: 'q-3'
  }

  let initialData = [a, b, c, d]
  const [initData, setInitData] = useState(initialData);

  function handleDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const newItems = Array.from(initData);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setInitData(newItems);
  }
  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
      <StrictModeDroppable droppableId="droppable">
        {provided => (
          <List
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              overflowY: 'scroll'
            }}
          >
            {initData.map((item, index) => (
              (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {provided => {
                    return (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        secondaryAction={
                          <DeleteIcon></DeleteIcon>
                        }
                      >
                        <div
                          {...provided.dragHandleProps}>
                          <ReorderIcon/>
                        </div>

                        <ListItemText
                          primary={item.content}
                          sx={{
                            flexGrow: 6
                          }}>
                        </ListItemText>
                        <ListItemText
                          primary={"(" + item.type + ") Rate: " + item.rate + "ms"}
                          secondary={"Delay: " + item.delay + "ms"}
                          sx={{
                            textAlign: 'end'
                          }}>
                        </ListItemText>
                      </ListItem>
                    );
                  }}
                </Draggable>
              )))}
            {provided.placeholder}
          </List>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

// https://medium.com/@wbern/getting-react-18s-strict-mode-to-work-with-react-beautiful-dnd-47bc909348e4
// Credits to https://github.com/GiovanniACamacho and https://github.com/Meligy for the TypeScript version
// Original post: https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};