import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Drawer,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Typography,

  Grid,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
} from "@mui/material";
import { CopyAll, Add } from "@mui/icons-material";
import './cards.css';
import './headers.css';
const TemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState("");
    const [nama, setNama] = useState("");
    const [generatedText, setGeneratedText] = useState("");
    const [newTemplate, setNewTemplate] = useState("");  // State for new template input
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

 
  useEffect(() => {
    axios
      .get("https://fahriamura-copas.vercel.app/api/templates")
      .then((response) => setTemplates(response.data.data))
      .catch((err) => console.error("Error fetching templates:", err));
  }, []);

  // Handle opening drawer and populating selected template
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setGeneratedText(template.teks);  // Set the selected template's text initially
    setOpenDrawer(true);
  };

  useEffect(() => {
      const content = document.querySelector('header .content');
      const blur = document.querySelector('header .overlay');
      let wHeight = window.innerHeight;

      window.addEventListener('resize', function() {
        wHeight = window.innerHeight;
      });

      window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              function(callback) {
                window.setTimeout(callback, 1000 / 60);
              };
      })();

      function Scroller() {
        this.latestKnownScrollY = 0;
        this.ticking = false;
      }

      Scroller.prototype = {
        init: function() {
          window.addEventListener('scroll', this.onScroll.bind(this), false);
          blur.style.backgroundImage = document.querySelector('header:first-of-type').style.backgroundImage;
        },

        onScroll: function() {
          this.latestKnownScrollY = window.scrollY;
          this.requestTick();
        },

        requestTick: function() {
          if (!this.ticking) {
            window.requestAnimFrame(this.update.bind(this));
          }
          this.ticking = true;
        },

        update: function() {
          const currentScrollY = this.latestKnownScrollY;
          this.ticking = false;

          const slowScroll = currentScrollY / 2;
          const blurScroll = currentScrollY * 2;
          const opaScroll = 1.4 - currentScrollY / 400;

          content.style.transform = `translateY(${slowScroll}px)`;
          content.style.opacity = opaScroll;
          blur.style.opacity = blurScroll / wHeight;
        }
      };

      const scroller = new Scroller();
      scroller.init();
    }, []); 
  const handleGenerateText = () => {
    if (!name || !nama) {
      setError("Nama dan nama inputan tidak boleh kosong");
      return;
    }
  
    // Regex untuk mencocokkan 'nama' dengan spasi opsional setelahnya
    const regex = new RegExp(`(${nama})(\\s*)`, 'g');
  
    // Mulai dengan teks yang dihasilkan sebelumnya (jika ada) atau teks asli template
    const startingText = generatedText || selectedTemplate.teks;
  
    // Replace semua kemunculan dengan teks baru
    const updatedText = startingText.replace(regex, (match, p1, p2) => {
      return name + p2; // Replace 'nama' dengan 'name' sambil mempertahankan spasi
    });
  
    // Simpan hasil penggantian ke state
    setGeneratedText(updatedText);
    setError("");
  };
  
  
  
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setSuccessMessage("Template berhasil disalin ke clipboard!");
  };

  const handleCancelDrawer = () => {
    setOpenDrawer(false);
    setGeneratedText("");  // Clear generated text when closing drawer
    setName("");  // Clear the name field
    setNama("");  // Clear the nama field
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
    
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewTemplate("");  // Clear input when closing the dialog
  };

  const handleSubmitTemplate = () => {
    if (!newTemplate) {
      setError("Template tidak boleh kosong");
      return;
    }

    axios
      .post("https://fahriamura-copas.vercel.app/api/templates", { teks: newTemplate})
      .then(() => {
        setSuccessMessage("Template berhasil ditambahkan!");
        setOpenDialog(false);
        setNewTemplate("");  // Clear the new template input
      })
      .catch((err) => {
        console.error("Error submitting template:", err);
        setError("Gagal menambahkan template");
      });
  };
  return (
    <div style={{ padding: "30px", marginBottom : "10px", backgroundColor: "#ffff" }}>
      <header>
        <div className="content">
          <hgroup>
            <h1>TEMPLATE</h1>
            <i>MUMETMENTT</i>
          </hgroup>
        </div>
        <div className="overlay"></div>
      </header>

      <Grid container spacing={1} justifyContent="flex-start" className="retest">
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <div
              onClick={() => handleSelectTemplate(template)} 
              className="grid__item item w-56 text-white relative " 
            >
                <div
                    className="item__content items h-full w-full p-4 bg-black relative border-2 flex flex-col"
                    style={{ height: '200px' }} 
                >
                    <p
                      className="flex-grow mb-2 overflow-hidden text-ellipsis line-clamp-4"
                      style={{
                          height: '100px',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          }}
                    >
                        {template.teks}
                    </p>
                    <a href="#" >Lihat Selengkapnya</a>
              </div>
            </div>
        </Grid>
        ))}
      </Grid>
      
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={openDrawer}
        onClose={handleCancelDrawer}
        transitionDuration={300}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "50%", 
            backgroundColor: "#333", 
            color: "white", 
            borderRadius: isMobile ? "16px 16px 0 0" : "0", 
            padding: "20px",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >

          {generatedText && (
            <div
              style={{
                width: "100%",
                height: "250px", 
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "8px",
                padding: "10px",
                overflowX: "auto",
                marginBottom: "20px", 
              }}
            >
              <pre style={{ whiteSpace: "pre-wrap" }}>{generatedText}</pre>
            </div>
          )}

          <button
            onClick={handleCopyToClipboard}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff", 
              padding: "10px",
              borderRadius: "8px",
              width: "100%",
              justifyContent: "flex-start", 
              marginBottom: "20px", 
            }}
            className= "copy"
          >
            <IconButton
              color="primary"
              sx={{ marginRight: "10px" }}
            >
              <CopyAll />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              Salin Template
            </Typography>
          </button>

<TextField
  label="Masukkan Nama yang mau diganti"
  variant="outlined"
  fullWidth
  value={nama}
  onChange={(e) => setNama(e.target.value)}
  margin="normal"
  error={!!error}
  helperText={error}
  sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
/>

<TextField
  label="Masukkan Nama"
  variant="outlined"
  fullWidth
  value={name}
  onChange={(e) => setName(e.target.value)} 
  margin="normal"
  error={!!error}
  helperText={error}
  sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
/>

<Button
  variant="contained"
  color="primary"
  onClick={handleGenerateText}
  sx={{ width: "100%", marginBottom: "15px", marginTop: "10px" }}
>
  Generate
</Button>


      
          <Button
            variant="outlined"
            color="error" 
            onClick={handleCancelDrawer}
            sx={{ marginTop: "10px", width: "100%" }}
          >
            Cancel
          </Button>
        </div>
      </Drawer>

 
      <Fab
        color="primary"
        aria-label="add-template"
        onClick={handleOpenDialog}
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Add />
      </Fab>


      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Tambah Template Baru</DialogTitle>
        <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "50vh", 
              height: "400px", 
            }}
          >
            <TextField
            autoFocus
            margin="dense"
            label="Template"
            type="text"
            fullWidth
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            error={!!error}
            helperText={error}
            multiline
            rows={10}   
            sx={{
                height: "100%",
                minHeight: "200px",
            }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Batal
          </Button>
          <Button onClick={handleSubmitTemplate} color="primary">
            Kirimkan
          </Button>
        </DialogActions>
      </Dialog>

   
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TemplatesPage;
