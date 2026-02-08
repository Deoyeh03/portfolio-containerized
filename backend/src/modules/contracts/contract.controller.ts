import { Request, Response } from 'express';
import Contract from './contract.model';
import logger from '../../utils/logger';

export const createContract = async (req: Request, res: Response) => {
    try {
        const contractData = req.body;
        
        // Generate contract number if not provided
        if (!contractData.contractNumber) {
            const count = await Contract.countDocuments();
            contractData.contractNumber = `CON-${String(count + 1).padStart(5, '0')}`;
        }

        const contract = new Contract(contractData);
        await contract.save();

        res.status(201).json(contract);
    } catch (error) {
        logger.error('Create Contract Error', error);
        res.status(500).json({ message: 'Failed to create contract', error: String(error) });
    }
};

export const getAllContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await Contract.find().sort({ createdAt: -1 });
        res.json(contracts);
    } catch (error) {
        logger.error('Get Contracts Error', error);
        res.status(500).json({ message: 'Failed to fetch contracts', error: String(error) });
    }
};

export const getContractById = async (req: Request, res: Response) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.json(contract);
    } catch (error) {
        logger.error('Get Contract Error', error);
        res.status(500).json({ message: 'Failed to fetch contract', error: String(error) });
    }
};

export const updateContract = async (req: Request, res: Response) => {
    try {
        const contract = await Contract.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.json(contract);
    } catch (error) {
        logger.error('Update Contract Error', error);
        res.status(500).json({ message: 'Failed to update contract', error: String(error) });
    }
};

export const deleteContract = async (req: Request, res: Response) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        logger.error('Delete Contract Error', error);
        res.status(500).json({ message: 'Failed to delete contract', error: String(error) });
    }
};
