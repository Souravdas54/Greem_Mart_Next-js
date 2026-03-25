import { Router } from 'express';
import { oAuthController } from '../controllers/OAuth.Controller';
import passport from 'passport';
import { protect, authorizeRoles } from '../middleware/Middleware';

const OAuthrouter = Router();

// // Google OAuth routes
OAuthrouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

OAuthrouter.get('/me', oAuthController.getMe.bind(oAuthController));

OAuthrouter.get('/google/callback', passport.authenticate('google',
    {
        failureRedirect: `${process.env.FRONTEND_URL}/auth/oauth-callback?error=oauth_failed`,
        session: false
    }),
    oAuthController.googleCallback.bind(oAuthController));


// Logout
OAuthrouter.post('/oauth/logout', protect, authorizeRoles('user'), oAuthController.logout.bind(oAuthController));

export { OAuthrouter };