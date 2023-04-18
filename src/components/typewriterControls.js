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
import { animateEntireEditor } from "./typewriter";

export default function TypewriterControls({ editorText, editorSpanText, selectedText, selectedDelta, setTypewriterOps, typewriterOps }) {
  const [openAdd, setOpenAdd] = useState(false);

  
  function handleClose() { setOpenAdd(false); }

  function openAddModal() {
    // if (selectedText === null || selectedText.length === 0) {
    //   return null;
    // }
    setOpenAdd(true);
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

  return (
    <>
      <Toolbar
        sx={{
          bgcolor: "#eee"
        }}>
        <IconButton
          onClick={() => { openAddModal() }}>
          <AddIcon></AddIcon>
        </IconButton>
        <IconButton>
          <DeleteIcon></DeleteIcon>
        </IconButton>
        <IconButton
          onClick={() => { animateEntireEditor({ typewriterOps }) }}>
          <PlayArrowIcon></PlayArrowIcon>
        </IconButton>
      </Toolbar>

      <Dialog open={openAdd} onClose={handleClose}>
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
    </>
  );
}