import { Request, Response } from 'express';
import { oauthRepositories } from '../repositories/OAuth.repository';
import { TokenService } from '../service/Token.Service';
import { UserInterface } from '../interface/User.Interface';
import { HydratedDocument } from 'mongoose';
import { roleModel } from '../models/Role.Model';
// Cookie config helper
const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
};
export class OAuthController {
    async googleCallback(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as unknown as HydratedDocument<UserInterface>;
            if (!user) {
                res.redirect(
                    `${process.env.FRONTEND_URL}/auth/oauth-callback?error=oauth_failed`
                );
                return;
            }
            const roleDoc = await roleModel.findById(user.role);
            if (!roleDoc) {
                res.redirect(`${process.env.FRONTEND_URL}/auth/oauth-callback?error=role_not_found`);
                return;
            }
            const roleName: string = roleDoc.name; // e.g. 'user', 'nursery_admin', 'super_admin'
            const accessToken = TokenService.generateAccessToken(user, roleName);
            const refreshToken = TokenService.generateRefreshToken(user, roleName);
            // ✅ Persist refreshToken in DB
            await oauthRepositories.saveRefreshToken(
                user._id.toString(),
                refreshToken
            );
            // ✅ Set tokens in HTTP-only cookies based on role
            if (roleName === 'super_admin') {
                res.cookie('super_admiinAccessToken', accessToken, {
                    ...cookieOptions,
                    maxAge: 15 * 60 * 1000 // 15 minutes
                });
            } else if (roleName === 'nursery_admin') {
                res.cookie('nursery_adminAccessToken', accessToken, {
                    ...cookieOptions,
                    maxAge: 15 * 60 * 1000
                });
            } else {
                res.cookie('userAccessToken', accessToken, {
                    ...cookieOptions,
                    maxAge: 15 * 60 * 1000
                });
            }
            // ✅ Shared refresh token cookie for all roles
            res.cookie('refreshToken', refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            // ✅ Redirect to frontend callback
            res.redirect(`${process.env.FRONTEND_URL}/auth/oauth-callback`);

        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect(
                `${process.env.FRONTEND_URL}/auth/oauth-callback?error=server_error`
            );
        }
    }

    // ── GET /auth/me
    // Reads HTTP-only cookie → returns current user
    // Called by AuthContext on every page load (both OAuth + regular login)
    async getMe(req: Request, res: Response): Promise<void> {
        try {
            const token =
                req.cookies?.userAccessToken ||
                req.cookies?.nursery_adminAccessToken ||
                req.cookies?.super_admiinAccessToken;

            if (!token) {
                res.status(401).json({ success: false, message: 'Not authenticated' });
                return;
            }

            const decoded = TokenService.verifyAccessToken(token);

            if (!decoded?.userId) {
                res.status(401).json({ success: false, message: 'Invalid token' });
                return;
            }

            const user = await oauthRepositories.findByIdWithRole(decoded.userId);

            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }

            // ✅ role name comes from token — no populate needed
            // ✅ sensitive fields simply not sent — no .select() needed
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: decoded.role,
                    avatarUrl: user.avatarUrl || null,
                    isVerified: user.isVerified || false,
                }
            });

        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
        }
    }

    // GET /auth/current-user (protected)
    async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as unknown as HydratedDocument<UserInterface>;
            if (!user) {
                res.status(401).json({ success: false, message: 'Not authenticated' });
                return;
            }
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: (user.role as any)?.name || user.role,
                    avatarUrl: user.avatarUrl || null,
                    oauthProvider: user.oauthProvider || null,
                    location: user.location || null,
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    // POST /auth/logout
    async logout(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as unknown as HydratedDocument<UserInterface>;
            if (user?._id) {
                // ✅ Clear refreshToken from DB
                await oauthRepositories.clearRefreshToken(user._id.toString());
            }
            // ✅ Clear all auth cookies
            res.clearCookie('userAccessToken', cookieOptions);
            res.clearCookie('nursery_adminAccessToken', cookieOptions);
            res.clearCookie('super_admiinAccessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);
            // ✅ Destroy passport session
            req.logout((err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'Logout failed'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Logged out successfully'
                });
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during logout'
            });
        }
    }
}
export const oAuthController = new OAuthController();