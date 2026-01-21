import { Request, Response } from 'express';
import Role from './role.model';

// @desc    Get all roles
// @route   GET /api/roles
// @access  Public
export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find({ isActive: true }).sort({ order: 1 });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Public
export const getRole = async (req: Request, res: Response) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching role' });
    }
};

// @desc    Create role
// @route   POST /api/roles
// @access  Private/Admin
export const createRole = async (req: Request, res: Response) => {
    try {
        const { title, subtitle, description, icon, order } = req.body;
        
        const role = await Role.create({
            title,
            subtitle,
            description,
            icon,
            order: order || (await Role.countDocuments())
        });
        
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error creating role' });
    }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
export const updateRole = async (req: Request, res: Response) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role' });
    }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
export const deleteRole = async (req: Request, res: Response) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        
        res.json({ message: 'Role deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role' });
    }
};
