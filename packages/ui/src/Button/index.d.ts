import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    outline?: boolean;
    className?: string;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
//# sourceMappingURL=index.d.ts.map