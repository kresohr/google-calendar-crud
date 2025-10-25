import express from "express";
import { oauth2Client, SCOPES } from "../config/google";
import { google } from "googleapis";

const router = express.Router();

// Access type is set to 'offline' so we can support refresh token as requested
router.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(authUrl);
});

router.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    req.session.user = {
      id: userInfo.data.id!,
      email: userInfo.data.email!,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=auth_failed`
        );
      }
      res.redirect(process.env.CLIENT_URL!);
    });
  } catch (error) {
    console.error("OAuth error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
});

router.get("/api/user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    id: req.session.user.id,
    email: req.session.user.email,
  });
});

router.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true });
  });
});

export default router;
