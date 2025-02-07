import { CloudUpload, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
// import axios from "axios"; // For API request
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const FileUploader = () => {
  const { handleSubmit, setValue } = useForm();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Create preview
      setValue("file", selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile)); // Create preview
      setValue("file", droppedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setPreview(null);
  };

  const onSubmit = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Box>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={3}
          sx={{
            m: 2,
            width: "100%",
            padding: 3,
            textAlign: "center",
          }}
        >
          {/* Title */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Certificate
          </Typography>

          {/* Drag & Drop Area */}
          <Box
            sx={{
              border: "2px dashed #90caf9",
              borderRadius: 2,
              padding: 3,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#f8f9fa",
              "&:hover": { backgroundColor: "#e3f2fd" },
              position: "relative",
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            onClick={() =>
              !file && document.getElementById("fileInput").click()
            }
          >
            {!file ? (
              <>
                <CloudUpload sx={{ fontSize: 50, color: "#90caf9" }} />
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                  Select a Photo file to upload
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  or drag and drop it here
                </Typography>
              </>
            ) : (
              <Box sx={{ position: "relative" }}>
                <img
                  src={preview}
                  alt="Uploaded Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 5,
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)",cursor:"pointer" },
                  }}
                  onClick={handleDelete}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}

            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </Box>

          {/* Upload Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!file}
          >
            Upload
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default FileUploader;
