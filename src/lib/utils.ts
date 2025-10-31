
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkPasswordStrength = (password: string) => {
    let score = 0;
    const feedback = [];

    if (password.length > 0) {
        if (password.length >= 8) {
            score++;
            feedback.push({ message: "At least 8 characters", met: true });
        } else {
            feedback.push({ message: "At least 8 characters", met: false });
        }

        if (/[a-z]/.test(password)) {
            score++;
            feedback.push({ message: "A lowercase letter", met: true });
        } else {
            feedback.push({ message: "A lowercase letter", met: false });
        }

        if (/[A-Z]/.test(password)) {
            score++;
            feedback.push({ message: "An uppercase letter", met: true });
        } else {
            feedback.push({ message: "An uppercase letter", met: false });
        }

        if (/[0-9]/.test(password)) {
            score++;
            feedback.push({ message: "A number", met: true });
        } else {
            feedback.push({ message: "A number", met: false });
        }

        if (/[^a-zA-Z0-9]/.test(password)) {
            score++;
            feedback.push({ message: "A special character", met: true });
        } else {
            feedback.push({ message: "A special character", met: false });
        }
    } else {
        feedback.push(
            { message: "At least 8 characters", met: false },
            { message: "A lowercase letter", met: false },
            { message: "An uppercase letter", met: false },
            { message: "A number", met: false },
            { message: "A special character", met: false }
        );
    }
    
    // Adjust score to be out of 4 for the indicator
    let strengthScore = 0;
    if (score > 0) strengthScore = Math.min(Math.floor((score-1)/1.25), 4);


    return { score: strengthScore, feedback };
}
