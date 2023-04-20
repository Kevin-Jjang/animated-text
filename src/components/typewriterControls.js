import { useState } from "react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField, Toolbar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { animateEntireEditor, deleteAllAnimations } from "./typewriter";

export default function TypewriterControls({ editorText, editorSpanText, selectedText, selectedDelta, setTypewriterOps, typewriterOps, setTypewriterData }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  function handleClose() { setOpenAdd(false); setOpenDel(false) }

  function openAddDialog() {
    // if (selectedText === null || selectedText.length === 0) {
    //   return null;
    // }
    setOpenAdd(true);
  }

  function openDelDialog() {
    setOpenDel(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    setTypewriterOps({
      content: selectedDelta,
      type: formJson['type'],
      rate: formJson['rate'],
      delay: formJson['delay']
    });
    setOpenAdd(false);
  }

  function handleDelAll() {
    deleteAllAnimations({ setTypewriterData,  setTypewriterOps });
    setOpenDel(false);
  }

  function handlePlay(e) {
    console.log(typewriterOps);
    if (typewriterOps['content'].length === 0) {
      alert('please add an animation');
      return;
    }
    animateEntireEditor({ typewriterOps });
  }


  return (
    <>
      <Toolbar
        sx={{
          bgcolor: "#eee",
          justifyContent: "center"
        }}>
        <IconButton
          onClick={openAddDialog}>
          <AddIcon></AddIcon>
        </IconButton>
        <IconButton
          onClick={openDelDialog}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
        <IconButton
          onClick={handlePlay}>
          <PlayArrowIcon></PlayArrowIcon>
        </IconButton>
      </Toolbar>

      <Dialog
        open={openAdd}
        onClose={handleClose}>
        <form id='add-typewriter' onSubmit={handleSubmit}>
          <DialogTitle>Add Typewriting Animation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Current selection: {selectedText}
            </DialogContentText>
            <Box>
              <FormControl>
                <FormLabel id="typewrite-format">Typing Format</FormLabel>
                <RadioGroup
                  row
                  name="type"
                  defaultValue={"char"}>
                  <FormControlLabel value="char" control={<Radio />} label="Char-by-Char" />
                  <FormControlLabel value="word" control={<Radio />} label="Word-by-Word" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box
              sx={{ width: '20ch' }}>
              <TextField
                required
                id="typingSpeed"
                margin="dense"
                label="Set typing speed"
                type="number"
                name="rate"
                defaultValue={40}
                variant="standard"
                InputProps={{
                  endAdornment: <InputAdornment position="end">ms</InputAdornment>
                }}
              />
            </Box>
            <Box
              sx={{ width: '20ch' }}>
              <TextField
                required
                id="afterDelay"
                margin="dense"
                label="Delay After This Animation"
                type="number"
                name="delay"
                defaultValue={0}
                variant="standard"
                InputProps={{
                  endAdornment: <InputAdornment position="end">ms</InputAdornment>
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDel}
        onClose={handleClose}>
        <DialogTitle>
          Remove all animations?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove all typewriter animations you created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelAll}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}