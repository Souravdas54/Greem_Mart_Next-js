import nodemailer from 'nodemailer';
import otpModel from '../models/otp.model';
import { UserInterface } from '../interface/User.Interface';

interface TransporterConfig {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
}

interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string
    }
} as TransporterConfig);

const sendOtpEmail = async (email: string, user: UserInterface): Promise<boolean> => {
    try {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove any existing OTP for this user
        await otpModel.deleteMany({ userId: user._id });

        // Save OTP in database with expiry
        await new otpModel({
            userId: user._id,
            otp: otp
        }).save();

        const emailOptions: EmailOptions = {
            from: `"Green Mart" <${process.env.EMAIL_USER as string}>`,
            to: email,
            subject: "🔐 Your Green Mart Verification Code",
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Green Mart Verification</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            padding: 20px;
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(72, 187, 120, 0.15);
            border: 2px solid #e2f5ea;
        }
        
        /* Header */
        .email-header {
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            padding: 50px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.15;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="white" stroke-width="2"/><circle cx="50" cy="50" r="20"/></svg>');
            background-size: 120px;
        }
        
        .logo-section {
            position: relative;
            z-index: 2;
            margin-bottom: 25px;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            padding: 18px 32px;
            border-radius: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .logo-icon {
            font-size: 32px;
            color: white;
        }
        
        .logo-text {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: white;
            letter-spacing: -0.5px;
        }
        
        .security-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 10px 24px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 15px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .header-title {
            font-family: 'Poppins', sans-serif;
            font-size: 36px;
            font-weight: 700;
            color: white;
            margin: 20px 0 10px;
            position: relative;
            z-index: 2;
        }
        
        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            position: relative;
            z-index: 2;
        }
        
        /* Content */
        .email-content {
            padding: 50px 40px;
        }
        
        .greeting-section {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .greeting-title {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }
        
        .greeting-text {
            color: #718096;
            font-size: 16px;
            line-height: 1.8;
            max-width: 500px;
            margin: 0 auto;
        }
        
        /* OTP Section */
        .otp-section {
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            border: 2px solid #c6f6d5;
            border-radius: 20px;
            padding: 50px 30px;
            text-align: center;
            margin: 40px 0;
            position: relative;
            overflow: hidden;
        }
        
        .otp-section::before {
            content: '🔐';
            position: absolute;
            font-size: 100px;
            opacity: 0.1;
            right: 20px;
            top: 20px;
        }
        
        .otp-label {
            display: inline-block;
            background: #38a169;
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 30px;
            box-shadow: 0 8px 20px rgba(56, 161, 105, 0.3);
        }
        
        .otp-code {
            font-family: 'Courier New', monospace;
            font-size: 72px;
            font-weight: 800;
            color: #2d3748;
            letter-spacing: 20px;
            margin: 20px 0;
            background: white;
            padding: 30px;
            border-radius: 16px;
            border: 3px dashed #c6f6d5;
            display: inline-block;
            position: relative;
            overflow: hidden;
        }
        
        .otp-timer {
            background: white;
            padding: 15px 30px;
            border-radius: 50px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 30px;
            border: 2px solid #38a169;
        }
        
        .timer-icon {
            font-size: 20px;
            color: #38a169;
        }
        
        .timer-text {
            color: #2d3748;
            font-weight: 700;
            font-size: 16px;
        }
        
        /* Instructions */
        .instructions-section {
            background: white;
            border-radius: 16px;
            padding: 40px;
            margin: 40px 0;
            border: 2px solid #e2f5ea;
        }
        
        .instruction-item {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 25px;
            padding-bottom: 25px;
            border-bottom: 1px dashed #e2f5ea;
        }
        
        .instruction-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .instruction-icon {
            width: 50px;
            height: 50px;
            background: #f0fff4;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 24px;
            color: #38a169;
            border: 2px solid #c6f6d5;
        }
        
        .instruction-content h3 {
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .instruction-content p {
            color: #718096;
            font-size: 15px;
            line-height: 1.7;
        }
        
        /* Security Alert */
        .security-alert {
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border: 2px solid #fc8181;
            border-radius: 16px;
            padding: 35px;
            margin-top: 40px;
            position: relative;
            overflow: hidden;
        }
        
        .security-alert::before {
            content: '⚠️';
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            right: 20px;
            bottom: 20px;
        }
        
        .alert-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .alert-icon {
            width: 50px;
            height: 50px;
            background: #f56565;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
        }
        
        .alert-title {
            font-family: 'Poppins', sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: #c53030;
        }
        
        .alert-text {
            color: #742a2a;
            font-size: 15px;
            line-height: 1.7;
        }
        
        /* Footer */
        .email-footer {
            background: #1a202c;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .footer-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.05;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2338a169"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="%2338a169" stroke-width="2"/><circle cx="50" cy="50" r="20"/></svg>');
            background-size: 150px;
        }
        
        .footer-logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 25px;
            position: relative;
            z-index: 2;
        }
        
        .footer-logo-icon {
            font-size: 24px;
            color: #38a169;
        }
        
        .footer-logo-text {
            font-family: 'Poppins', sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: white;
        }
        
        .footer-tagline {
            color: #a0aec0;
            font-size: 16px;
            margin-bottom: 30px;
            position: relative;
            z-index: 2;
        }
        
        .contact-info {
            background: rgba(56, 161, 105, 0.1);
            border: 1px solid rgba(56, 161, 105, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            position: relative;
            z-index: 2;
        }
        
        .contact-link {
            color: #38a169;
            text-decoration: none;
            font-weight: 600;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 30px 0;
            position: relative;
            z-index: 2;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: #718096;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
        }
        
        .footer-link:hover {
            color: #38a169;
        }
        
        .copyright {
            color: #718096;
            font-size: 13px;
            margin-top: 30px;
            position: relative;
            z-index: 2;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: 15px;
            }
            
            .email-container {
                border-radius: 20px;
            }
            
            .email-header {
                padding: 40px 25px;
            }
            
            .email-content {
                padding: 40px 25px;
            }
            
            .header-title {
                font-size: 28px;
            }
            
            .otp-code {
                font-size: 48px;
                letter-spacing: 12px;
                padding: 20px;
            }
            
            .instructions-section {
                padding: 30px;
            }
            
            .instruction-item {
                flex-direction: column;
                gap: 15px;
            }
            
            .email-footer {
                padding: 40px 25px;
            }
        }
        
        @media (max-width: 480px) {
            .email-header {
                padding: 30px 20px;
            }
            
            .email-content {
                padding: 30px 20px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .logo {
                padding: 15px 25px;
            }
            
            .logo-text {
                font-size: 22px;
            }
            
            .otp-code {
                font-size: 36px;
                letter-spacing: 8px;
                padding: 15px;
            }
            
            .otp-section {
                padding: 30px 20px;
            }
            
            .instructions-section {
                padding: 25px;
            }
            
            .security-alert {
                padding: 25px;
            }
            
            .email-footer {
                padding: 30px 20px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="header-pattern"></div>
            <div class="logo-section">
                <div class="logo">
                    <span class="logo-icon">🌿</span>
                    <span class="logo-text">Green Mart</span>
                </div>
                <div class="security-badge">🔒 Secure Verification</div>
            </div>
            <h1 class="header-title">Verify Your Account</h1>
            <p class="header-subtitle">Secure access to your Green Mart experience</p>
        </div>
        
        <!-- Content -->
        <div class="email-content">
            <!-- Greeting -->
            <div class="greeting-section">
                <h2 class="greeting-title">Hello ${user.name || 'Green Mart Shopper'}! 👋</h2>
                <p class="greeting-text">
                    To ensure the security of your Green Mart account and complete your request, 
                    please use the One-Time Password (OTP) below. This code helps us verify your identity 
                    and protect your personal information.
                </p>
            </div>
            
            <!-- OTP Display -->
            <div class="otp-section">
                <div class="otp-label">VERIFICATION CODE</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-timer">
                    <span class="timer-icon">⏱️</span>
                    <span class="timer-text">Valid for 1 minute only</span>
                </div>
            </div>
            
            <!-- Instructions -->
            <div class="instructions-section">
                <div class="instruction-item">
                    <div class="instruction-icon">1️⃣</div>
                    <div class="instruction-content">
                        <h3>Enter the Code</h3>
                        <p>Copy or type the 6-digit code above into the verification field on the Green Mart website or app.</p>
                    </div>
                </div>
                
                <div class="instruction-item">
                    <div class="instruction-icon">2️⃣</div>
                    <div class="instruction-content">
                        <h3>Complete Your Action</h3>
                        <p>Once verified, you can proceed with your account login, purchase, or security settings update.</p>
                    </div>
                </div>
                
                <div class="instruction-item">
                    <div class="instruction-icon">3️⃣</div>
                    <div class="instruction-content">
                        <h3>Automatic Expiry</h3>
                        <p>This code will expire automatically after 1 minute for your security. Request a new code if needed.</p>
                    </div>
                </div>
            </div>
            
            <!-- Security Alert -->
            <div class="security-alert">
                <div class="alert-header">
                    <div class="alert-icon">⚠️</div>
                    <h3 class="alert-title">Security Alert</h3>
                </div>
                <p class="alert-text">
                    <strong>Never share this verification code with anyone.</strong> Green Mart support will never ask for your OTP. 
                    This code is for your use only. If you didn't request this verification, please secure your account immediately 
                    by changing your password and contacting our support team.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-pattern"></div>
            <div class="footer-logo">
                <span class="footer-logo-icon">🌿</span>
                <span class="footer-logo-text">Green Mart</span>
            </div>
            <p class="footer-tagline">Fresh, Organic & Sustainable Shopping</p>
            
            <div class="contact-info">
                <p style="color: #a0aec0; margin: 0; font-size: 14px;">
                    Need help? Contact our Green Support Team:
                    <br>
                    <a href="mailto:support@greenmart.com" class="contact-link">support@greenmart.com</a>
                </p>
            </div>
            
            <div class="footer-links">
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Terms of Service</a>
                <a href="#" class="footer-link">Security Center</a>
                <a href="#" class="footer-link">Help Center</a>
            </div>
            
            <div class="copyright">
                <p>&copy; ${new Date().getFullYear()} Green Mart. All rights reserved.</p>
                <p>This is an automated security message. Please do not reply to this email.</p>
                <p style="margin-top: 15px; color: #4a5568; font-size: 12px;">
                    🌍 Your security is our priority. Green Mart uses industry-standard encryption to protect your information.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`
        };

        await transporter.sendMail(emailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return true;

    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
}

export { sendOtpEmail };