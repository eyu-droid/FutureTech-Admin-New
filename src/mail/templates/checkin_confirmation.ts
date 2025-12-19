const CheckInConfirmationTemplate = (name: string) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Check-In Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 0 0 5px 5px;
                }
                .success-icon {
                    font-size: 48px;
                    color: #4CAF50;
                    text-align: center;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Check-In Successful!</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <div class="success-icon">✓</div>
                <p>You have checked in successfully. Enjoy your stay!</p>
                <p>We're thrilled to have you at Future Tech Addis Expo in Addis Ababa Convention Center. 
                Get ready for an amazing experience filled with innovation, networking, and insights.</p>
                <p>If you have any questions or need assistance during the event, please don't hesitate to reach out to our staff.</p>
                <br>
                <p>Thank you,</p>
                <p>The Future Tech Addis Team</p>
            </div>
        </body>
        </html>
    `;
};

export default CheckInConfirmationTemplate;
