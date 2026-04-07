import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { TokenService } from "../service/Token.Service";

interface JwtPayload {
    userId?: string;
    name?: string;
    email: string;
    profileImage?: string;
    role: string;
    type: 'access' | 'refresh';
    nurseryId?: string; // nurseryId for nursery_admin

}

declare global {
    namespace Express {
        // Override the User interface entirely
        interface User {
            userId?: string;
            name?: string;
            email: string;
            profileImage?: string;
            role: string;
            type: 'access' | 'refresh';
             nurseryId?: string;
        }
        interface Request {
            user?: User
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.cookies?.super_admiinAccessToken) { //super_admiinAccessToken
        token = req.cookies.super_admiinAccessToken;

    } else if (req.cookies?.nursery_adminAccessToken) { //nursery_adminAccessToken
        token = req.cookies.nursery_adminAccessToken;

    } else if (req.cookies?.userAccessToken) { //userAccessToken
        token = req.cookies.userAccessToken
    }

    const authHeader = req.headers.authorization;

    if (!token && authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = TokenService.verifyAccessToken(token)

        if (decoded.type !== 'access') {
            return res.status(401).json({
                success: false,
                message: "invalid token type"
            })
        }

        const userId = decoded.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token: user ID missing"
            });
        }

        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });

    }
}


export const refreshTokenProtect = (req: Request, res: Response, next: NextFunction) => {

    const token = req.body.refreshToken;

    //  const refreshToken = req.cookies?.refreshToken || req.headers['refresh-token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No refresh token provided"
        });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;

        if (decoded.type !== 'refresh') {
            return res.status(401).json({
                success: false,
                message: "Invalid token type"
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) return res.status(401).json({ message: "Not authenticated" });

        if (allowedRoles.includes(req.user.role)) {
            console.log('Access granted');
            return next();
        } else {
            console.log('Access denied');
            return res.status(403).json({ message: "Forbidden: You don't have access" });
        }
        next();
    };
};