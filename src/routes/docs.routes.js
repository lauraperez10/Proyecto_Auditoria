import { Router } from "express";
import {
  renderDocForm,
  createNewDoc,
  renderDocs,
  renderEditForm,
  updateDoc,
  deleteDoc,
} from "../controllers/docs.controller.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

// New document
router.get("/docs/add", isAuthenticated, renderDocForm);

router.post("/docs/new-doc", isAuthenticated, createNewDoc);

// Get All documents
router.get("/docs", isAuthenticated, renderDocs);

// Edit documents
router.get("/docs/edit/:id", isAuthenticated, renderEditForm);

router.put("/docs/edit-doc/:id", isAuthenticated, updateDoc);

// Delete documents
router.delete("/docs/delete/:id", isAuthenticated, deleteDoc);

export default router;
