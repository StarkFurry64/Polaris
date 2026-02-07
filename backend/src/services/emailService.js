import nodemailer from 'nodemailer';

// Create transporter - using Gmail SMTP (can be configured via env vars)
const createTransporter = () => {
    // For development, use a test account or configure SMTP
    // In production, configure these via environment variables
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || process.env.JIRA_EMAIL,
            pass: process.env.SMTP_APP_PASSWORD || process.env.SMTP_PASS
        }
    });
};

/**
 * Send task assignment notification email
 */
export const sendAssignmentNotification = async ({
    recipientEmail,
    recipientName,
    issueKey,
    issueSummary,
    assignerName = 'Polaris Dashboard',
    priority = 'Medium'
}) => {
    const transporter = createTransporter();

    const priorityColors = {
        'high': '#ef4444',
        'highest': '#ef4444',
        'medium': '#f59e0b',
        'low': '#10b981',
        'lowest': '#10b981'
    };

    const priorityColor = priorityColors[priority?.toLowerCase()] || '#f59e0b';

    const mailOptions = {
        from: `"Polaris Dashboard" <${process.env.SMTP_USER || process.env.JIRA_EMAIL}>`,
        to: recipientEmail,
        subject: `🎯 Task Assigned: ${issueKey} - ${issueSummary}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Task Assignment</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">
                            Hi <strong>${recipientName}</strong>,
                        </p>
                        
                        <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">
                            You have been assigned a new task by <strong>${assignerName}</strong>.
                        </p>
                        
                        <!-- Task Card -->
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                            <div style="margin-bottom: 12px;">
                                <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 4px; font-family: monospace; font-weight: 600; font-size: 14px;">
                                    ${issueKey}
                                </span>
                                <span style="background-color: ${priorityColor}20; color: ${priorityColor}; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px; text-transform: uppercase;">
                                    ${priority} Priority
                                </span>
                            </div>
                            <h2 style="color: #1e293b; font-size: 18px; margin: 0;">
                                ${issueSummary}
                            </h2>
                        </div>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.JIRA_BASE_URL}/browse/${issueKey}" 
                               style="display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                                View Task in Jira →
                            </a>
                        </div>
                        
                        <!-- Footer -->
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                                This notification was sent by Polaris Dashboard
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Hi ${recipientName},

You have been assigned a new task by ${assignerName}.

Task: ${issueKey}
Summary: ${issueSummary}
Priority: ${priority}

View in Jira: ${process.env.JIRA_BASE_URL}/browse/${issueKey}

---
This notification was sent by Polaris Dashboard
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Assignment notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send assignment notification:', error);
        throw error;
    }
};
