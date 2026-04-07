import { Router } from 'express';
import { oAuthController } from '../controllers/OAuth.Controller';
import passport from 'passport';
import { protect, authorizeRoles } from '../middleware/Middleware';

const OAuthrouter = Router();

// // Google OAuth routes

// ── Redirect to Google consent screen ─────────────────────────────────
OAuthrouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ── Current user ──────────────────────────────────────────────────────────────
// GET /auth/me — reads HTTP-only cookie, returns user
// Called by AuthContext on every page load
OAuthrouter.get('/me', oAuthController.getMe.bind(oAuthController));

// ── Google redirects back here ───────────────────────────────────────
OAuthrouter.get('/google/callback', passport.authenticate('google',
    {
        failureRedirect: `${process.env.FRONTEND_URL}/auth/oauth-callback?error=oauth_failed`,
        session: false
    }),
    oAuthController.googleCallback.bind(oAuthController));

// GET /auth/current-user — protected, uses req.user from middleware
OAuthrouter.get('/current-user', protect, oAuthController.getCurrentUser.bind(oAuthController)
);

// Logout
OAuthrouter.post('/oauth/logout', protect, authorizeRoles('user'), oAuthController.logout.bind(oAuthController));

export { OAuthrouter };