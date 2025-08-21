<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FullstackApp - OTP Verification</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .email-wrapper {
            padding: 2rem 1rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .email-container {
            max-width: 600px;
            width: 100%;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }

        /* Header */
        .header {
            padding: 2rem 2rem 1.5rem;
            text-align: center;
            background: linear-gradient(135deg, #15803d 0%, #22c55e 100%);
            color: white;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="%23ffffff" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="%23ffffff" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="%23ffffff" opacity="0.1"/></svg>');
            opacity: 0.3;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        .logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            margin-bottom: 1rem;
            backdrop-filter: blur(10px);
        }

        .logo::before {
            content: '🔐';
            font-size: 1.5rem;
        }

        .header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 1.875rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.025em;
        }

        .header p {
            margin: 0;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
        }

        /* Content */
        .content {
            padding: 2.5rem;
        }

        .greeting {
            margin: 0 0 2rem 0;
            font-size: 1rem;
            color: #1e293b;
            font-weight: 500;
        }

        .otp-section {
            text-align: center;
            margin: 2.5rem 0;
        }

        .otp-label {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1.5rem;
        }

        .otp-container {
            display: inline-block;
            text-align: center;
            margin: 2rem 0;
        }

        .otp-digit {
            display: inline-block;
            width: 50px;
            height: 60px;
            background: #ffffff;
            border: 2px solid #22c55e;
            color: #15803d;
            border-radius: 8px;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 4px;
            line-height: 60px;
            text-align: center;
            vertical-align: top;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        .otp-digit::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05));
            border-radius: 6px;
        }

        .validity-notice {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 1rem;
            margin: 2rem 0;
            text-align: center;
        }

        .validity-notice p {
            margin: 0;
            font-size: 0.875rem;
            color: #92400e;
            font-weight: 600;
        }

        .validity-notice .timer {
            font-size: 1rem;
            font-weight: 700;
            color: #b45309;
        }

        .security-notice {
            background: #f0fdf4;
            border: 1px solid #86efac;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
        }

        .security-notice p {
            margin: 0;
            font-size: 0.875rem;
            color: #166534;
            line-height: 1.6;
        }

        .security-notice .icon {
            display: inline-block;
            margin-right: 0.5rem;
            font-size: 1rem;
        }

        /* Footer */
        .footer {
            padding: 2rem 2.5rem;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }

        .footer-content {
            text-align: center;
        }

        .footer p {
            margin: 0 0 0.75rem 0;
            font-size: 0.75rem;
            color: #64748b;
            line-height: 1.5;
        }

        .footer p:last-child {
            margin-bottom: 0;
        }

        .contact-info {
            margin: 1.5rem 0 0 0;
        }

        .contact-link {
            color: #22c55e;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
        }

        .contact-link:hover {
            color: #15803d;
        }

        .divider {
            display: inline-block;
            margin: 0 0.5rem;
            color: #cbd5e1;
        }

        .app-info {
            margin: 1rem 0;
            padding: 1rem;
            background: #dcfce7;
            border-radius: 8px;
            border-left: 4px solid #22c55e;
        }

        .app-info p {
            margin: 0;
            font-size: 0.75rem;
            color: #15803d;
            font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
            .email-wrapper {
                padding: 1rem 0.5rem;
            }

            .email-container {
                border-radius: 8px;
            }

            .header {
                padding: 1.5rem 1.5rem 1rem;
            }

            .header h1 {
                font-size: 1.5rem;
            }

            .content {
                padding: 1.5rem;
            }

            @media (max-width: 640px) {
                .otp-digit {
                    width: 40px;
                    height: 50px;
                    font-size: 1.25rem;
                    margin: 0 2px;
                    line-height: 50px;
                }
            }

            .footer {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
{{--                <div class="logo"></div>--}}
                <h1>FullstackApp</h1>
                <p>OTP Verification</p>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Hello,</p>

            <div class="otp-section">
                <p class="otp-label">Your One-Time Password (OTP) is:</p>

                <div class="otp-container">
                    @php $otpDigits = str_split($otp); @endphp
                    @foreach($otpDigits as $digit)
                        <div class="otp-digit">{{ $digit }}</div>
                    @endforeach
                </div>
            </div>

            <div class="validity-notice">
                <p><span class="timer">Valid for 5 minutes</span></p>
            </div>

            <div class="security-notice">
                <p>If you didn't request this OTP, you can safely ignore this email. For your security, never share this code with anyone.</p>
            </div>

            <div class="app-info">
                <p>FullstackApp - Laravel and Vue Stack</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <p>Need assistance? Our support team is ready to help you.</p>

                <div class="contact-info">
                    <a href="mailto:support@fullstack.app" class="contact-link">support@fullstack.app</a>
                    <span class="divider">•</span>
                    <a href="tel:+639876543210" class="contact-link">+639876543210</a>
                </div>

                <p style="margin-top: 1.5rem;">
                    Thanks,<br><strong>Laravel and Vue Stack Dev Team</strong>
                </p>
            </div>
        </div>
    </div>
</div>
</body>
</html>
