import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        this.verifyTransporter();
    }

    private async verifyTransporter(): Promise<void> {
        try {
            await this.transporter.verify();
            console.log('✅ Email transporter is ready');
        } catch (error) {
            console.error('Email transporter configuration error:', error);
        }
    }

    // Generic email method
    async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
        try {
            const mailOptions = {
                from: `"Green Mart" <${process.env.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully:', result.messageId);
            return { success: true };
        } catch (error: any) {
            console.error('Error sending email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Send welcome email after successful registration
    async sendWelcomeEmail(email: string, name: string): Promise<{ success: boolean; error?: string }> {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Green Mart</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            padding: 20px 0;
        }
        
        .email-wrapper {
            max-width: 100%;
            width: 100%;
            margin: 0 auto;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(72, 187, 120, 0.1);
            border: 1px solid #e2f5ea;
        }
        
        .email-header-one {
            padding: 40px 32px;
            text-align: center;
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            position: relative;
            overflow: hidden;
        }
        
        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="white" stroke-width="2"/><circle cx="50" cy="50" r="20"/></svg>');
            background-size: 200px;
        }
        
        .logo-container {
            position: relative;
            z-index: 2;
            margin-bottom: 25px;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: white;
            padding: 18px 30px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .logo-icon {
            font-size: 32px;
            color: #38a169;
        }
        
        .logo-text {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: #38a169;
            letter-spacing: -0.5px;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .welcome-badge {
            display: inline-block;
            background: white;
            color: #38a169;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .email-content {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #2d3748;
            text-align: center;
            font-family: 'Poppins', sans-serif;
        }
        
        .greeting-highlight {
            color: #38a169;
        }
        
        .intro-text {
            color: #4a5568;
            margin-bottom: 30px;
            font-size: 16px;
            text-align: center;
            line-height: 1.8;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .features-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 40px 0;
        }
        
        .feature-card {
            background: #f7fff9;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            border-color: #38a169;
            box-shadow: 0 10px 25px rgba(72, 187, 120, 0.15);
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #38a169, #48bb78);
        }
        
        .feature-icon {
            font-size: 40px;
            margin-bottom: 15px;
            display: block;
            height: 50px;
            color: #38a169;
        }
        
        .feature-title {
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 16px;
            font-family: 'Poppins', sans-serif;
        }
        
        .feature-desc {
            font-size: 14px;
            color: #718096;
            line-height: 1.6;
        }
        
        .cta-section {
            text-align: center;
            margin: 50px 0 40px;
            padding: 40px;
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            border-radius: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .cta-section::before {
            content: '🌿';
            position: absolute;
            font-size: 120px;
            opacity: 0.1;
            right: 20px;
            bottom: 20px;
        }
        
        .cta-title {
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 24px;
            font-family: 'Poppins', sans-serif;
            position: relative;
            z-index: 1;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            color: white;
            padding: 18px 45px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
            position: relative;
            z-index: 1;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(72, 187, 120, 0.4);
        }
        
        .stats-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 40px 0;
            text-align: center;
        }
        
        .stat-item {
            padding: 25px 15px;
            background: white;
            border: 2px solid #e2f5ea;
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .stat-item:hover {
            border-color: #38a169;
            background: #f7fff9;
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: 800;
            color: #38a169;
            margin-bottom: 8px;
            display: block;
            font-family: 'Poppins', sans-serif;
        }
        
        .stat-label {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .email-footer {
            padding: 40px;
            background: #1a202c;
            text-align: center;
            position: relative;
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
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 30px 0;
            position: relative;
            z-index: 2;
        }
        
        .social-icon {
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            font-size: 18px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .social-icon:hover {
            background: #38a169;
            transform: translateY(-3px);
        }
        
        .footer-text {
            font-size: 14px;
            color: #a0aec0;
            margin-bottom: 10px;
            line-height: 1.6;
            position: relative;
            z-index: 2;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin: 25px 0;
            position: relative;
            z-index: 2;
        }
        
        .footer-link {
            color: #38a169;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .footer-link:hover {
            color: white;
            text-decoration: underline;
        }
        
        .copyright {
            font-size: 12px;
            color: #718096;
            margin-top: 25px;
            position: relative;
            z-index: 2;
        }
        
        /* Responsive Design */
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            
            .email-container {
                border-radius: 15px;
            }
            
            .email-header-one {
                padding: 30px 20px;
            }
            
            .email-content {
                padding: 30px 20px;
            }
            
            .logo {
                padding: 15px 25px;
            }
            
            .logo-text {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 28px;
            }
            
            .features-section {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .stats-section {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .cta-section {
                padding: 30px 20px;
                margin: 30px 0;
            }
            
            .cta-button {
                padding: 15px 35px;
                font-size: 15px;
            }
            
            .footer-links {
                flex-direction: column;
                gap: 15px;
            }
            
            .social-links {
                gap: 10px;
            }
            
            .social-icon {
                width: 40px;
                height: 40px;
            }
        }
        
        @media (max-width: 480px) {
            .email-header-one {
                padding: 25px 15px;
            }
            
            .email-content {
                padding: 25px 15px;
            }
            
            .logo {
                padding: 12px 20px;
            }
            
            .logo-text {
                font-size: 20px;
            }
            
            .greeting {
                font-size: 24px;
            }
            
            .feature-card {
                padding: 20px;
            }
            
            .stat-number {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header with Logo -->
            <div class="email-header-one">
                <div class="header-pattern"></div>
                <div class="logo-container">
                    <div class="logo">
                        <span class="logo-icon">🌿</span>
                        <span class="logo-text">Green Mart</span>
                    </div>
                    <div class="welcome-badge">Fresh, Organic & Sustainable</div>
                </div>
                <div style="margin-top: 30px; position: relative; z-index: 2;">
        <div class="email-title" style="font-size: 32px; font-weight: 700; margin: 20px 0 10px; color: white; font-family: 'Poppins', sans-serif;">
            Welcome to Green Mart
        </div>
        <div class="email-subtitle" style="font-size: 18px; color: rgba(255, 255, 255, 0.9);">
            Your Sustainable Shopping Journey Begins
        </div>
    </div>
            </div>
            
            <!-- Main Content -->
            <div class="email-content">
                <h1 class="greeting">
                    Hello <span class="greeting-highlight">${name}</span>!
                </h1>
                
                <p class="intro-text">
                    Welcome to the Green Mart family! We're delighted to have you join our community 
                    of conscious shoppers who value fresh, organic, and sustainable products. 
                    Together, we're making the world greener, one purchase at a time.
                </p>
                
                <!-- Stats Section -->
                <div class="stats-section">
                    <div class="stat-item">
                        <span class="stat-number">5000+</span>
                        <span class="stat-label">Organic Products</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">200+</span>
                        <span class="stat-label">Local Farms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">50K+</span>
                        <span class="stat-label">Happy Customers</span>
                    </div>
                </div>
                
                <!-- Features Grid -->
                <div class="features-section">
                    <div class="feature-card">
                        <span class="feature-icon">🥬</span>
                        <div class="feature-title">Farm Fresh Produce</div>
                        <div class="feature-desc">Direct from local organic farms to your doorstep</div>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🚚</span>
                        <div class="feature-title">Carbon-Neutral Delivery</div>
                        <div class="feature-desc">Eco-friendly delivery with zero carbon footprint</div>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">♻️</span>
                        <div class="feature-title">Sustainable Packaging</div>
                        <div class="feature-desc">100% biodegradable and compostable materials</div>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">⭐</span>
                        <div class="feature-title">Green Rewards</div>
                        <div class="feature-desc">Earn points for every sustainable purchase</div>
                    </div>
                </div>
                
                <!-- Call to Action -->
                <div class="cta-section">
                    <div class="cta-title">Ready to start your green shopping journey?</div>
                    <a href="${process.env.FRONTEND_URL || 'https://greenmart.com'}/products" class="cta-button">
                        🛍️ Shop Fresh Now
                    </a>
                    <p style="margin-top: 20px; color: #4a5568; font-size: 14px;">
                        Use code: <strong>WELCOME15</strong> for 15% off your first order
                    </p>
                </div>
                
                <p style="text-align: center; color: #718096; font-style: italic; font-size: 14px; margin-top: 30px; padding: 20px; border-top: 2px dashed #e2f5ea;">
                    "The greatest threat to our planet is the belief that someone else will save it." 
                    <br>- Robert Swan
                </p>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <div class="footer-pattern"></div>
                
                <div class="social-links">
                    <a href="#" class="social-icon">🌐</a>
                    <a href="#" class="social-icon">📘</a>
                    <a href="#" class="social-icon">📷</a>
                    <a href="#" class="social-icon">🐦</a>
                    <a href="#" class="social-icon">🎬</a>
                </div>
                
                <div class="footer-links">
                    <a href="#" class="footer-link">Our Sustainability Pledge</a>
                    <a href="#" class="footer-link">Farm Partners</a>
                    <a href="#" class="footer-link">Delivery Areas</a>
                    <a href="#" class="footer-link">Contact Support</a>
                </div>
                
                <p class="footer-text">
                    🌱 Green Mart - Nourishing Lives, Preserving Nature
                </p>
                <p class="footer-text">
                    123 Green Street, Eco City | contact@greenmart.com
                </p>
                
                <div class="footer-links">
                    <a href="#" class="footer-link">Privacy Policy</a>
                    <a href="#" class="footer-link">Terms of Service</a>
                    <a href="#" class="footer-link">Cookie Policy</a>
                </div>
                
                <p class="copyright">
                    &copy; ${new Date().getFullYear()} Green Mart. All rights reserved.<br>
                    This email was sent to you as a registered member of Green Mart.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

        return this.sendEmail({
            to: email,
            subject: 'Welcome to Green Mart! 🌱 Your Sustainable Shopping Journey Begins',
            html
        });
    }

    // Send password reset email
    async sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<{ success: boolean; error?: string }> {
        const resetUrl = `${process.env.FRONTEND_URL || 'https://greenmart.com'}/reset-password?token=${resetToken}`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Green Mart</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Open Sans', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            padding: 20px 0;
        }
        
        .email-wrapper {
            max-width: 100%;
            width: 100%;
            margin: 0 auto;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(72, 187, 120, 0.1);
            border: 1px solid #e2f5ea;
        }
        
        .email-header {
            padding: 40px 32px;
            text-align: center;
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            position: relative;
            overflow: hidden;
        }
        
        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="white" stroke-width="2"/><circle cx="50" cy="50" r="20"/></svg>');
            background-size: 200px;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: white;
            padding: 18px 30px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 25px;
            position: relative;
            z-index: 2;
        }
        
        .logo-icon {
            font-size: 32px;
            color: #38a169;
        }
        
        .logo-text {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: #38a169;
            letter-spacing: -0.5px;
        }
        
        .security-icon {
            font-size: 64px;
            margin: 20px 0;
            position: relative;
            z-index: 2;
            color: white;
        }
        
        .email-title {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 10px;
            color: white;
            font-family: 'Poppins', sans-serif;
            position: relative;
            z-index: 2;
        }
        
        .email-subtitle {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
            z-index: 2;
        }
        
        .email-content {
            padding: 50px 40px;
            text-align: center;
        }
        
        .greeting {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2d3748;
            font-family: 'Poppins', sans-serif;
        }
        
        .message {
            color: #4a5568;
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.8;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .reset-section {
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            border-radius: 15px;
            padding: 40px;
            margin: 40px 0;
            position: relative;
            overflow: hidden;
        }
        
        .reset-section::before {
            content: '🔒';
            position: absolute;
            font-size: 100px;
            opacity: 0.1;
            right: 20px;
            bottom: 20px;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            color: white;
            padding: 18px 45px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
            position: relative;
            z-index: 1;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(72, 187, 120, 0.4);
        }
        
        .expiry-note {
            font-size: 14px;
            color: #718096;
            margin-top: 20px;
            font-weight: 600;
        }
        
        .email-footer {
            padding: 30px 40px;
            background: #1a202c;
            text-align: center;
        }
        
        .footer-text {
            font-size: 14px;
            color: #a0aec0;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            
            .email-container {
                border-radius: 15px;
            }
            
            .email-header, .email-content {
                padding: 30px 20px;
            }
            
            .logo {
                padding: 15px 25px;
            }
            
            .logo-text {
                font-size: 24px;
            }
            
            .email-title {
                font-size: 24px;
            }
            
            .reset-section {
                padding: 30px 20px;
                margin: 30px 0;
            }
            
            .reset-button {
                padding: 15px 35px;
                font-size: 15px;
            }
            
            .greeting {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="header-pattern"></div>
                <div class="logo">
                    <span class="logo-icon">🌿</span>
                    <span class="logo-text">Green Mart</span>
                </div>
                <div class="security-icon">🔒</div>
                <h1 class="email-title">Account Security</h1>
                <p class="email-subtitle">Secure your Green Mart account</p>
            </div>
            
            <!-- Content -->
            <div class="email-content">
                <h2 class="greeting">Hello ${name},</h2>
                
                <p class="message">
                    We received a request to reset your Green Mart account password. 
                    Click the button below to create a new secure password and continue 
                    your sustainable shopping journey with us.
                </p>
                
                <div class="reset-section">
                    <a href="${resetUrl}" class="reset-button">
                        🔑 Reset Your Password
                    </a>
                    <p class="expiry-note">
                        ⏰ This link expires in 1 hour for your security
                    </p>
                </div>
                
                <p class="message" style="font-size: 14px;">
                    If you didn't request this password reset, please ignore this email or 
                    contact our support team immediately. Your account security is our priority.
                </p>
                
                <div style="margin-top: 30px; padding: 20px; background: #f7fff9; border-radius: 10px; border-left: 4px solid #38a169;">
                    <p style="margin: 0; color: #2d3748; font-size: 14px;">
                        <strong>💡 Security Tip:</strong> Use a unique password that includes letters, numbers, 
                        and special characters for maximum security.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <p class="footer-text">🌿 Green Mart - Your Trusted Partner in Sustainable Living</p>
                <p class="footer-text" style="color: #718096; font-size: 12px; margin-top: 15px;">
                    This is an automated security message. Please do not reply to this email.<br>
                    &copy; ${new Date().getFullYear()} Green Mart. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

        return this.sendEmail({
            to: email,
            subject: '🔒 Reset Your Password - Green Mart Security',
            html
        });
    }

    // Send order confirmation email (new method for Green Mart)
    async sendOrderConfirmationEmail(email: string, name: string, orderId: string, totalAmount: number, deliveryDate: string): Promise<{ success: boolean; error?: string }> {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed - Green Mart</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Open Sans', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            padding: 20px 0;
        }
        
        .email-wrapper {
            max-width: 100%;
            width: 100%;
            margin: 0 auto;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(72, 187, 120, 0.1);
            border: 1px solid #e2f5ea;
        }
        
        .email-header {
            padding: 40px 32px;
            text-align: center;
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            position: relative;
            overflow: hidden;
        }
        
        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="white" stroke-width="2"/><circle cx="50" cy="50" r="20"/></svg>');
            background-size: 200px;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: white;
            padding: 18px 30px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 25px;
            position: relative;
            z-index: 2;
        }
        
        .logo-icon {
            font-size: 32px;
            color: #38a169;
        }
        
        .logo-text {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: #38a169;
            letter-spacing: -0.5px;
        }
        
        .order-success {
            font-size: 48px;
            margin: 20px 0;
            color: white;
            position: relative;
            z-index: 2;
        }
        
        .email-title {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 10px;
            color: white;
            font-family: 'Poppins', sans-serif;
            position: relative;
            z-index: 2;
        }
        
        .email-content {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 30px;
            color: #2d3748;
            font-family: 'Poppins', sans-serif;
            text-align: center;
        }
        
        .order-details {
            background: #f7fff9;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            border: 2px solid #e2f5ea;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #e2f5ea;
        }
        
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .detail-label {
            color: #718096;
            font-weight: 600;
        }
        
        .detail-value {
            color: #2d3748;
            font-weight: 700;
        }
        
        .highlight {
            color: #38a169;
        }
        
        .tracking-section {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            border-radius: 15px;
            margin: 40px 0;
        }
        
        .track-button {
            display: inline-block;
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            margin-top: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
        }
        
        .track-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(72, 187, 120, 0.4);
        }
        
        .eco-impact {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            text-align: center;
        }
        
        .impact-item {
            padding: 20px;
        }
        
        .impact-icon {
            font-size: 32px;
            margin-bottom: 10px;
            display: block;
        }
        
        .impact-text {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
        }
        
        .email-footer {
            padding: 30px 40px;
            background: #1a202c;
            text-align: center;
            border-top: 3px solid #38a169;
        }
        
        .footer-text {
            font-size: 14px;
            color: #a0aec0;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            
            .email-container {
                border-radius: 15px;
            }
            
            .email-header, .email-content {
                padding: 30px 20px;
            }
            
            .logo {
                padding: 15px 25px;
            }
            
            .logo-text {
                font-size: 24px;
            }
            
            .email-title {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 24px;
            }
            
            .order-details {
                padding: 20px;
            }
            
            .eco-impact {
                flex-direction: column;
                gap: 20px;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="header-pattern"></div>
                <div class="logo">
                    <span class="logo-icon">🌿</span>
                    <span class="logo-text">Green Mart</span>
                </div>
                <div class="order-success">✅</div>
                <h1 class="email-title">Order Confirmed!</h1>
                <p class="email-subtitle" style="color: white; position: relative; z-index: 2;">
                    Your fresh, organic order is being prepared
                </p>
            </div>
            
            <!-- Content -->
            <div class="email-content">
                <h2 class="greeting">Thank you, ${name}!</h2>
                
                <p style="text-align: center; color: #4a5568; margin-bottom: 30px; line-height: 1.8;">
                    Your order has been received and is being processed. 
                    We're gathering the freshest organic products from our partner farms.
                </p>
                
                <div class="order-details">
                    <div class="detail-row">
                        <span class="detail-label">Order Number:</span>
                        <span class="detail-value highlight">#${orderId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Estimated Delivery:</span>
                        <span class="detail-value highlight">${deliveryDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total Amount:</span>
                        <span class="detail-value highlight">$${totalAmount.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value" style="color: #38a169;">✅ Confirmed</span>
                    </div>
                </div>
                
                <div class="tracking-section">
                    <h3 style="color: #2d3748; margin-bottom: 15px; font-family: 'Poppins', sans-serif;">
                        🚚 Track Your Order
                    </h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">
                        You'll receive tracking updates as your order progresses. 
                        Our carbon-neutral delivery is on its way!
                    </p>
                    <a href="${process.env.FRONTEND_URL || 'https://greenmart.com'}/orders/${orderId}" class="track-button">
                        Track Order Status
                    </a>
                </div>
                
                <div class="eco-impact">
                    <div class="impact-item">
                        <span class="impact-icon">🌱</span>
                        <div class="impact-text">Organic Products</div>
                    </div>
                    <div class="impact-item">
                        <span class="impact-icon">♻️</span>
                        <div class="impact-text">Eco Packaging</div>
                    </div>
                    <div class="impact-item">
                        <span class="impact-icon">🌍</span>
                        <div class="impact-text">Carbon Neutral</div>
                    </div>
                    <div class="impact-item">
                        <span class="impact-icon">🤝</span>
                        <div class="impact-text">Fair Trade</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f7fff9; border-radius: 10px;">
                    <p style="margin: 0; color: #2d3748; font-size: 14px;">
                        <strong>📞 Need help?</strong> Contact our Green Support team at 
                        <a href="mailto:support@greenmart.com" style="color: #38a169; text-decoration: none;">
                            support@greenmart.com
                        </a>
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <p class="footer-text">🌿 Thank you for choosing sustainable shopping with Green Mart</p>
                <p class="footer-text" style="color: #718096; font-size: 12px; margin-top: 15px;">
                    This order contributes to our tree-planting initiative. You've helped plant 1 tree!<br>
                    &copy; ${new Date().getFullYear()} Green Mart. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

        return this.sendEmail({
            to: email,
            subject: `✅ Order Confirmed #${orderId} - Green Mart`,
            html
        });
    }
}

const emailService = new EmailService();
export { emailService };