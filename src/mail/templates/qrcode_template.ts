
const qrCodeTemplate = (name: string, qrCodeImage: string, printUrl: string) => {

    const imgSrc = typeof qrCodeImage === 'string' ? qrCodeImage : '';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
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
                .qr-container {
                    margin: 16px 0;
                }
                img.qr {
                    max-width: 320px;
                    width: 100%;
                    height: auto;
                    border: 1px solid #e0e0e0;
                    padding: 8px;
                    background: white;
                }
            </style>
        </head>
        <body>
            <h2>Hello ${name},</h2>
            <p>Here is your QR code for the event. Please present this at the entrance (print it or show it on your phone).</p>
            <div class="qr-container">
                <img class="qr" src="${imgSrc}" alt="QR Code" />
            </div>
            <br>
            <a href="${printUrl}" target="_blank" class="print-button">Print</a>
            <p>Thank you,</p>
            <p>The Future Tech Team</p>
        </body>
        </html>
    `;
};

export default qrCodeTemplate;
