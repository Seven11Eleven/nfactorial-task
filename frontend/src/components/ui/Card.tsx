import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
    <div
        className={`border rounded-2xl shadow p-4 bg-white ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => (
    <div className={`space-y-2 ${className}`} {...props}>
        {children}
    </div>
);