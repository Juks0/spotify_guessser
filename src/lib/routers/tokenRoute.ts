import { Router, Request, Response } from 'express';
import { refreshAccessToken, getUserById } from '../database/services.ts';

const router = Router();

// Route to refresh access token using stored refresh token
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if user exists
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Refresh the access token
        const tokenData = await refreshAccessToken(userId);
        
        if (!tokenData) {
            return res.status(401).json({ 
                error: 'Failed to refresh token. User may need to re-authenticate.' 
            });
        }

        // Set new access token as httpOnly cookie
        res.cookie('access_token', tokenData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            expires_in: 3600 // 1 hour
        });

    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({
            error: 'Failed to refresh token',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Route to get user's token status
router.get('/status/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            hasRefreshToken: !!user.refresh_token,
            lastLogin: user.last_login
        });

    } catch (error) {
        console.error('Error checking token status:', error);
        res.status(500).json({
            error: 'Failed to check token status',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
