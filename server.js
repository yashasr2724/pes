require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files (public folder)
app.use(express.static(path.join(__dirname, "public")));

// ===== Nodemailer Transporter =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===== Preschool Admission Enquiry =====
app.post("/api/enquiry", async (req, res) => {
  const { childName, parentName, email, mobileNumber, program, consent } =
    req.body;

  if (!consent) {
    return res.status(400).json({ message: "Consent is required." });
  }

  const mailOptions = {
    from: `"PES Vidyakendra" <${process.env.EMAIL_USER}>`,
    to: process.env.PRESCHOOL_TO,
    subject: "New Admission Enquiry (Preschool)",
    html: `
      <h3>New Preschool Admission Enquiry</h3>
      <p><strong>Child Name:</strong> ${childName}</p>
      <p><strong>Parent Name:</strong> ${parentName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
      <p><strong>Class Seeking Admission For:</strong> ${program}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Preschool enquiry mail sent to ${mailOptions.to}`);
    res.json({ message: "Enquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending preschool email:", error);
    res.status(500).json({ message: "Failed to send preschool email." });
  }
});

// ===== PU College Admission Enquiry =====
app.post("/api/pu-enquiry", async (req, res) => {
  const { studentName, parentName, email, mobileNumber, stream, consent } =
    req.body;

  if (!consent) {
    return res.status(400).json({ message: "Consent is required." });
  }

  const mailOptions = {
    from: `"PES Vidyakendra" <${process.env.EMAIL_USER}>`,
    to: process.env.PUCOLLEGE_TO,
    subject: "New PU College Enquiry",
    html: `
      <h3>New PU College Admission Enquiry</h3>
      <p><strong>Student Name:</strong> ${studentName}</p>
      <p><strong>Parent Name:</strong> ${parentName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
      <p><strong>Stream Selected:</strong> ${stream}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ PU enquiry mail sent to ${mailOptions.to}`);
    res.json({ message: "PU College enquiry submitted successfully!" });
  } catch (error) {
    console.error("❌ Error sending PU enquiry email:", error);
    res.status(500).json({ message: "Failed to send PU enquiry email." });
  }
});

// ===== Default Route =====
// ✅ Use "/" route instead of "*" for Render compatibility
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
