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
  Card,
  CardContent,
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

  // Fetch templates on initial load
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/templates")
      .then((response) => setTemplates(response.data.data))
      .catch((err) => console.error("Error fetching templates:", err));
  }, []);

  // Handle opening drawer and populating selected template
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setGeneratedText(template.teks);  // Set the selected template's text initially
    setOpenDrawer(true);
  };

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
      .post("http://localhost:3000/api/templates", { teks: newTemplate})
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
    <div style={{ padding: "30px", backgroundColor: "#f5f5f5" }}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <header className="w-full flex justify-between items-center p-4 bg-black"></header>
        <main className="flex-grow flex items-center justify-center w-full bg-black">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-white">TEMPLATES MUMETMENNN</h1>
            <p className="text-lg text-gray-600">You may see a few new things ;)</p>
          </div>
        </main>
      </div>

      {/* Template Grid */}
      <Grid container spacing={1} justifyContent="flex-start">
  {templates.map((template) => (
    <Grid item xs={12} sm={6} md={4} key={template.id}>
      <Card
        onClick={() => handleSelectTemplate(template)}
        style={{
          width: "100%", // Agar card mengisi lebar grid container
          height: "150px", // Tinggi card tetap
          borderRadius: "16px",
          backgroundColor: "#B0B0B0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
          cursor: "pointer",
          '&:hover': {
            backgroundColor: "#A0A0A0",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          },
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography
            variant="body2"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 4, // Limit to 4 lines
            }}
          >
            {template.teks}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* Drawer for generating template */}
      <Drawer
        anchor={isMobile ? "bottom" : "right"} // For mobile, open from the bottom; for desktop, open from the right
        open={openDrawer}
        onClose={handleCancelDrawer}
        transitionDuration={300}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "50%", // Full screen on mobile, half screen on desktop
            backgroundColor: "#333", // Dark background color
            color: "white", // White text
            borderRadius: isMobile ? "16px 16px 0 0" : "0", // Rounded top corners on mobile
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
          {/* Static Box for Template Display */}
          {generatedText && (
            <div
              style={{
                width: "100%",
                height: "250px", // Adjusted height to fit 3x4 grid
                backgroundColor: "#fff",
                color: "#000", // Text color set to black
                borderRadius: "8px",
                padding: "10px",
                overflowX: "auto", // Enable horizontal scrolling for overflow
                marginBottom: "20px", // Space between box and form
              }}
            >
              <pre style={{ whiteSpace: "pre-wrap" }}>{generatedText}</pre>
            </div>
          )}

          {/* Row for "Salin Template" with white background */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff", // White background for clarity
              padding: "10px",
              borderRadius: "8px",
              width: "100%",
              justifyContent: "flex-start", // Align items to the left
              marginBottom: "20px", // Space between the row and form
            }}
          >
            <IconButton
              color="primary"
              onClick={handleCopyToClipboard}
              sx={{ marginRight: "10px" }}
            >
              <CopyAll />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              Salin Template
            </Typography>
          </div>

<TextField
  label="Masukkan Nama yang mau diganti"
  variant="outlined"
  fullWidth
  value={nama} // This should bind to the 'nama' state
  onChange={(e) => setNama(e.target.value)} // This should update 'nama'
  margin="normal"
  error={!!error}
  helperText={error}
  sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
/>

<TextField
  label="Masukkan Nama"
  variant="outlined"
  fullWidth
  value={name} // This should bind to the 'name' state
  onChange={(e) => setName(e.target.value)} // This should update 'name'
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


          {/* Red Cancel Button */}
          <Button
            variant="outlined"
            color="error"  // Red color for Cancel button
            onClick={handleCancelDrawer}
            sx={{ marginTop: "10px", width: "100%" }}
          >
            Cancel
          </Button>
        </div>
      </Drawer>

      {/* Floating Action Button to open Dialog */}
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

      {/* Dialog for adding new template */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>Tambah Template Baru</DialogTitle>
  <DialogContent
    sx={{
      display: "flex", // Flexbox for form layout
      flexDirection: "column",
      width: "400px", // Keep the dialog square with a fixed width
      height: "400px", // Make the dialog square (400px x 400px)
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
    multiline  // Enable multi-line text field
    rows={10}   // Default number of lines visible
    sx={{
        height: "100%", // Adjust height to fill the dialog
        minHeight: "200px", // Minimum height to ensure it's large enough
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

      {/* Success Snackbar */}
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
