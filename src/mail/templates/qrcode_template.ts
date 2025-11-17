const qrCodeTemplate = (name: string, qrCodeImage: string) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Event QR Code</title>
        </head>
        <body>
            <h2>Hello ${name},</h2>
            <p>Here is your QR code for the event. Please present this at the entrance.</p>
            <img src="cid:qrcode" alt="QR Code" />
            <p>Thank you,</p>
            <p>The Future Tech Team</p>
        </body>
        </html>
    `;
};

export default qrCodeTemplate;
