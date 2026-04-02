const express = require("express");
const router = express.Router();
const { saveSession, getSessionsByUser, getSessionById } = require("../controllers/sessionController");
router.post("/sessions", saveSession);
router.get("/sessions/:userId", getSessionsByUser);
router.get("/session/:id", getSessionById);
module.exports = router;
