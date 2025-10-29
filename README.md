
# WebIntel: Website Analysis & Intelligence Tool

WebIntel is a powerful, privacy-focused tool designed to give developers, marketers, and curious minds a comprehensive analysis of any website. It aggregates public data and uses AI to provide deep insights into a site's performance, security, technology stack, and more.

![WebIntel Screenshot](https://i.imgur.com/your-screenshot.png) <!-- It's a good idea to add a screenshot of your app! -->

## ✨ Core Features

- **Comprehensive Performance Analysis**: Get detailed Core Web Vitals reports for both mobile and desktop, powered by Google PageSpeed Insights.
- **In-Depth Security Scanning**: Checks for SSL, essential security headers (`CSP`, `HSTS`, etc.), and other potential vulnerabilities.
- **AI-Powered Insights**: Receive AI-generated summaries, actionable recommendations, and traffic estimations to quickly understand a site's profile.
- **Technology Stack Detection**: Uncover the frameworks, libraries, CMS, and other services a website is built with.
- **Hosting & Domain Information**: Discover the IP address, ISP, and geographic location of the hosting server.
- **Metadata & SEO Health**: Inspects Open Graph tags, `robots.txt`, and `sitemap.xml` to evaluate SEO readiness.
- **Detailed Lighthouse Audits**: Access detailed reports on performance, accessibility, best practices, and SEO from Lighthouse.
- **Side-by-Side Comparison**: Analyze two websites simultaneously to benchmark against competitors.
- **Privacy-First**: All analysis history is stored exclusively in your browser's local storage. No user activity is tracked on a backend server.
- **Responsive & Modern UI**: A clean, beautiful, and fully responsive interface built with the latest web technologies.

## 💻 Technology Stack

WebIntel is built with a modern, powerful, and scalable technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **AI Integration**: [Google Gemini & Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Vercel](https://vercel.com/) / Firebase App Hosting
- **Icons**: [Lucide React](https://lucide.dev/)

## 📊 Data Sources

WebIntel gathers data from a variety of trusted, public APIs to compile its reports:

- **Google PageSpeed Insights**: For performance, accessibility, SEO, and best practices audits.
- **ip-api.com**: For IP and hosting information.
- **Google Gemini**: Powers all AI features, including summaries, traffic estimations, and technology detection.

*Please note that all data is fetched on-demand and represents a public snapshot of the target website at the time of analysis.*

## 🚀 Getting Started

To run this project locally, you'll need Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/web-intel.git
    cd web-intel
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your API keys.
    ```env
    # Required for Google PageSpeed Insights & Google Gemini
    PAGESPEED_API_KEY=YOUR_GOOGLE_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## 🔒 Privacy

Your privacy is paramount. WebIntel operates entirely on your client-side (your browser) for history storage.

- **No Backend Tracking**: We do not have a traditional backend server that logs your activity or the URLs you analyze.
- **Local Storage**: Your analysis and comparison history is stored exclusively in your browser's local storage, which you can clear at any time from the "History" page.

---

<<<<<<< HEAD

=======
Developed with ❤️ by [Fortune](https://wa.me/2349167689200).
>>>>>>> 22de3c8 (Can you make the about section fully detailed and also for the README.md)
