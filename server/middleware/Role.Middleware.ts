import { Request, Response, NextFunction } from "express";
import { roleModel } from "../models/Role.Model";

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingRole = await roleModel.find();
        if (existingRole.length === 0) {
            const defaultRole = [
                { name: "super_admin" },
                { name: "nursery_admin" },
                { name: "user" }
            ]
            await roleModel.insertMany(defaultRole);
            console.log("Default Role created successfully");
        }
        next()
    } catch (error) {
        console.error("error creating default role :", error);
        next(error)

    }
}