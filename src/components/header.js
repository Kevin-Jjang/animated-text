import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, Toolbar } from "@mui/material";

export default function Header() {
    return (
        <header>
            <h1>Typewrite.it</h1>
            <Toolbar
                sx={{
                    display: 'inline',
                }}>
                <IconButton>
                    <DownloadIcon></DownloadIcon>
                </IconButton>
            </Toolbar>
        </header>
    );
}