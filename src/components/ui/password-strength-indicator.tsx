
'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const strengthLevels = [
    { label: "Very Weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-lime-500" },
    { label: "Strong", color: "bg-green-500" }
];


export function PasswordStrengthIndicator({ score }: { score: number }) {

    const level = strengthLevels[Math.min(score, 4)];
    const activeBars = score + 1;

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: index < activeBars ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={cn(
                            "h-1.5 flex-1 rounded-full origin-bottom",
                            index < activeBars ? level.color : 'bg-muted'
                        )}
                    />
                ))}
            </div>
            {score > -1 &&
                <p className="text-xs font-medium" style={{ color: `var(--${level.color.replace('bg-', 'chart-')})`}}>
                    {level.label}
                </p>
            }
        </div>
    );
}

