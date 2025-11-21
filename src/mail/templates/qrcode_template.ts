const qrCodeTemplate = (name: string, qrCodeImage: string, printUrl: string) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Event QR Code</title>
            <style>
                .print-button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <h2>Hello ${name},</h2>
            <p>Here is your QR code for the event. Please present this at the entrance.</p>
            <img src="${qrCodeImage}" alt="QR Code" />
            <br>
            <a href="${printUrl}" target="_blank" class="print-button">Print</a>
            <p>Thank you,</p>
            <p>The Future Tech Team</p>
        </body>
        </html>
    `;
};

export default qrCodeTemplate;
