export default function defaultTemplate(body?:string, media?:string, customMessage?:string){
    const formattedBody = body ? body.replace(/\n/g, '<br>') : '';
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Future Tech Addis Invitation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
        }
    </style>
</head>

<body style="background-color: #1A2230; margin: 0; padding: 1rem; width: 100%;">
    <!-- Main outer table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color: #1f2937; table-layout: auto;">
        <tr>
            <td align="center" style="padding: 1rem;">
                <!-- Content wrapper table -->
                <table role="presentation"
                    style="background-color: #111827; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; max-width: 48rem; width: 100%; color: #d1d5db; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 0;">
                            <!-- Header Section -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background-color: #1A2230;">
                                <tr>
                                    <td style="padding: 2rem; width: 50%; vertical-align: middle;">
                                        <a href="https://futuretechaddis.com">
                                            <img src="https://futuretechaddis.com/wp-content/uploads/2025/04/white-remov-2.png"
                                                alt="Future Tech Addis Logo"
                                                style="height: 15rem; display: block; border: 0;">
                                        </a>
                                    </td>
                                    <td style="color: #fff; padding: 2rem; text-align: right; vertical-align: middle;">
                                        <h1
                                            style="font-size: 1.875rem; line-height: 1.25; font-weight: 700; margin: 0;">
                                            Future Tech Addis</h1>
                                        <p
                                            style="font-size: 1.125rem; margin-top: 0.5rem; font-weight: 500; margin-bottom: 0;">
                                            Ethiopia's Premier Innovation Forum</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0;">
                            <!-- Content Section -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 1.5rem;">
                                    ${formattedBody && `<p style="line-height: 1.625; margin-bottom: 1.5rem; margin-top: 0;">
                                            ${formattedBody}
                                        </p>`}
                                    ${customMessage || ''}

                                        ${media && `<img src="cid:${media}" alt="QR Code" width="180" style="display: block; margin: 0 auto; max-width: 100%; height: auto; border: 1px solid #d1d5db; padding: 5px; border-radius: 4px;" />`}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0;">
                            <!-- Footer Section -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background-color: #1f2937; color: #9ca3af; padding: 1.5rem; font-size: 0.875rem; text-align: center; border-top: 1px solid #374151;">
                                <tr>
                                    <td style="padding: 1.5rem; font-size: 0.875rem; text-align: center;">
                                        <p style="margin: 0;">Contact Us: <a href="mailto:contact@futuretechaddis.com"
                                                style="color: #0059b3; transition-property: color; transition-duration: 0.3s; text-decoration: none;">contact@futuretechaddis.com</a>
                                            | tel:+251 911 259 688</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 1rem;">
                                        <p style="margin-right: 1rem; margin-top: 0; margin-bottom: 0; display: inline-block; vertical-align: middle; color: #d1d5db;">Follow Us:</p>
                                        <a href="https://x.com/futuretechaddis" style="margin-left: 0.5rem; text-decoration: underline; color: #9ca3af;">
                                            X
                                        </a>
                                        <a href="https://www.linkedin.com/company/futuretechaddis/" style="margin-left: 0.5rem; text-decoration: underline; color: #9ca3af; ">
                                            LinkedIn
                                        </a>
                                        <a href="https://web.facebook.com/futuretechaddis/" style="margin-left: 0.5rem; text-decoration: underline; color: #9ca3af;">
                                            Facebook
                                        </a>
                                        <a href="http://www.youtube.com/@futuretechaddis" style="margin-left: 0.5rem; text-decoration: underline; color: #9ca3af;">
                                            YouTube
                                        </a>
                                        <a href="https://www.tiktok.com/@futuretechaddis?is_from_webapp=1&sender_device=pc" style="margin-left: 0.5rem; text-decoration: underline; color: #9ca3af;">
                                            TikTok
                                        </a>
                                        <a href="https://www.instagram.com/futuretechaddis?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" style="margin-left: 0.5rem; text-decoration: underline; color: #9ca3af;">
                                            Instagram
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 0.875rem; text-align: center;">
                                        <p style="margin: 0;">&copy; 2025 Future Tech Addis. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
    `
}
