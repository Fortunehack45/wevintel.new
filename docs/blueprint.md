# **App Name**: Web Insights

## Core Features:

- URL Analysis: Analyze a user-provided URL to gather comprehensive website intelligence.
- Website Overview: Display core website details such as domain, title, description and language.
- SEO and Performance Analysis: Fetch and display SEO and performance scores using the Google PageSpeed Insights and Lighthouse APIs.
- Security Scan: Perform SSL certificate checks and analyze security headers to identify vulnerabilities.
- Hosting Information: Determine and display the hosting provider's IP address, ISP, and country.
- Recent Analysis History: Store and display the recent analysis history of each user using Firestore.
- Visitor Tracking Tool Script: Generate a JavaScript tracking tool script.  The tool uses an LLM to determine whether visitor events (IP, country, timestamp, referrer) should be recorded in Firestore for future analytics.

## Style Guidelines:

- Primary color: A deep, futuristic blue (#29ABE2) to reflect technology and trust.
- Background color: Dark navy (#1A2A3A) for a sophisticated, tech-focused feel.
- Accent color: Electric purple (#8E44AD) to highlight interactive elements and key metrics.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its modern and neutral appearance, suitable for both headlines and body text.
- Use consistent and professional icons from a set like Font Awesome or Material Icons to represent different data categories.
- Implement a dashboard-like layout with clearly defined cards and sections for different types of analysis data, utilizing Tailwind CSS and ShadCN UI components.
- Incorporate subtle loading animations and transitions to enhance user experience during data fetching and display.