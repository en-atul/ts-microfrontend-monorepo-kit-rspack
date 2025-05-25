import React from 'react';
import classNames from 'classnames';
import * as styles from './Button.module.scss';
// import './button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger';
	outline?: boolean;
	className?: string;
}

const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	outline = false,
	className,
	children,
	...props
}) => {
	const buttonClass = classNames(
		styles.btn,
		styles[`btn-${variant}`],
		{ [styles.outline]: outline },
		className,
	);

	// const buttonClass = classNames('btn', `btn-${variant}`, { outline }, className);

	return (
		<button className={buttonClass} {...props}>
			{children}
		</button>
	);
};

export default Button;
