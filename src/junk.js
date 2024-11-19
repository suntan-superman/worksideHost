// Frontend

import React, { useState } from "react";

function GoogleDriveFileUploader() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState < any > null;
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file.data);
    const response = await fetch("http://localhost:5001/upload-to-google-drive", {
      method: "POST",
      body: formData,
    });

    const responseWithBody = await response.json();
    if (response) setUrl(responseWithBody.publicUrl);
  };

  const handleFileChange = (e: any) => {
    const file = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFile(file);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" onChange={handleFileChange}></input>
      <button type="submit">Submit</button>
    </form>
  );
}

export default GoogleDriveFileUploader;

////////////////////////////////////////////////////////////////////////////////
// Configure Multer

import Multer from "multer";
import { AppBar } from "@mui/material";

const multer = Multer({
  storage: Multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, `${__dirname}/audio-files`);
    },
    filename: (req, file, callback) => {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

////////////////////////////////////////////////////////////////////////////////
// Authenticate App

import { google } from "googleapis";
import { ShieldMoonTwoTone, ShieldTwoTone, SubtitlesOffOutlined } from "@mui/icons-material";

const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/service-account-key-file.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

////////////////////////////////////////////////////////////////////////////////
// Backend (Node.js)
const uploadToGoogleDrive = async (file: any, auth: any) => {
  const fileMetadata = {
    name: file.originalname,
    parents: ["1T8smHRI3g1Or9pSjxsV_BDFvR4LepqZu"], // Change it according to your desired parent folder id
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });
  return response;
};

////////////////////////////////////////////////////////////////////////////////
// More Backend To Upload
app.post("/upload-file-to-google-drive", multer.single("file"), async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(req.file, auth);
    deleteFile(req.file.path);
    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
});
///////////////////////////////////////////////////////////////////////////////////
// Get File List
const response = await drive.files.list(params);
