import express from 'express';
import { sendAssignmentNotification } from '../services/emailService.js';

const router = express.Router();

/**
 * POST /api/notifications/assignment
 * Send email notification when a task is assigned
 */
router.post('/assignment', async (req, res) => {
    try {
        const {
            recipientEmail,
            recipientName,
            issueKey,
            issueSummary,
            assignerName,
            priority
        } = req.body;

        // Validate required fields
        if (!recipientEmail || !issueKey || !issueSummary) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: recipientEmail, issueKey, issueSummary'
            });
        }

        // Send notification
        const result = await sendAssignmentNotification({
            recipientEmail,
            recipientName: recipientName || recipientEmail.split('@')[0],
            issueKey,
            issueSummary,
            assignerName: assignerName || 'Polaris Dashboard',
            priority: priority || 'Medium'
        });

        res.json({
            success: true,
            message: 'Assignment notification sent successfully',
            messageId: result.messageId
        });

    } catch (error) {
        console.error('Failed to send assignment notification:', error);

        // Check for common email errors
        if (error.code === 'EAUTH') {
            return res.status(500).json({
                success: false,
                error: 'Email authentication failed. Please configure SMTP credentials.',
                details: 'Set SMTP_USER and SMTP_PASS (or SMTP_APP_PASSWORD for Gmail) in .env'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to send notification',
            details: error.message
        });
    }
});

export default router;
