// import DownloadIcon from '@mui/icons-material/Download';
// import { IconButton, Toolbar } from "@mui/material";
// import JSZip from 'jszip';

export default function Header() {
  // function saveZip() {
  //   const zip = new JSZip();
  //   const jsZip = zip.folder("js")
  //   jsZip.file("typewriter.js")
    
  // }

  return (
    <header>
      <h1>Typewrite.it</h1>
      {/* <Toolbar
        sx={{
          display: 'inline',
        }}>
        <IconButton
          onClick={saveZip}>
          <DownloadIcon></DownloadIcon>
        </IconButton>
      </Toolbar> */}
    </header>
  );
}