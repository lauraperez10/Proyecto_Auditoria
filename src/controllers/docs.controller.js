import Doc from "../models/Doc.js";
import * as fs from 'fs';
import fetch from 'node-fetch';

export const renderDocForm = (req, res) => res.render("docs/new-doc");

function writeAuditLog(logMessage){
  let ipAddress;
  fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    ipAddress = data.ip;
    const timestamp = new Date().toISOString();
    const message = `Date: ${timestamp} - ${logMessage} - IP adress: ${ipAddress}\n`;
    // Escribir el mensaje en el archivo de registro
    fs.appendFile('audit.log', message, (err) => {
      if (err) throw err;
      console.log('The operation could not be performed due to an error...');
    });
  })
  .catch(error => console.log('Failed to get IP address:', error));
}

export const createNewDoc = async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0)
    return res.render("docs/new-doc", {
      errors,
      title,
      description,
    });

  const newDoc = new Doc({ title, description });
  newDoc.user = req.user.id;
  await newDoc.save();

  req.flash("success_msg", "Document Added Successfully");
  // Registrar la operación en el archivo de auditoría
  writeAuditLog(`Action performed by the User: ${req.user.email} - Action taken: Document creation`);
  res.redirect("/docs");
};


export const renderDocs = async (req, res) => {
  const docs = await Doc.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("docs/all-docs", { docs });
};

export const renderEditForm = async (req, res) => {
  const doc = await Doc.findById(req.params.id).lean();
  if (doc.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/docs");
  }
  res.render("docs/edit-doc", { doc });
};

export const updateDoc = async (req, res) => {
  const { title, description } = req.body;
  await Doc.findByIdAndUpdate(req.params.id, { title, description });
  // Registrar la operación en el archivo de auditoría
  writeAuditLog(`Action performed by the User: ${req.user.email} - Action taken: Document update - updated document: ${title} - Id document: ${req.params.id}`);

  req.flash("success_msg", "Document Updated Successfully");
  res.redirect("/docs");
};

export const deleteDoc = async (req, res) => {
  await Doc.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Document Deleted Successfully");
  // Registrar la operación en el archivo de auditoría
  writeAuditLog(`Action performed by the User: ${req.user.email} - Action taken: Document deletion - Deleted document id: ${req.params.id}`);
  res.redirect("/docs");
};