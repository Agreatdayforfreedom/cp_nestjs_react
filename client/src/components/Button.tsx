import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  color?: 'red' | 'blue' | 'green';
  name: string;
  className?: string;
  disabled?: boolean;
  to?: string;
  tag?: 'button' | 'link';
  onClick?: () => void | undefined;
}

const Button = ({
  type = 'button',
  name,
  color = 'green',
  className = '',
  disabled = false,
  tag = 'button',
  to = '#',
  onClick = undefined,
}: Props) => {
  const classColor = `btn-grad-${color}`;
  const payload = {
    className: ` ${className}`,
  };
  return (
    <div className={` w-full flex items-center justify-end`}>
      {tag === 'link' ? (
        <Link className={`${classColor} btn-grad ${className}`} to={to}>
          {name}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`${classColor} btn-grad ${className}`}
          disabled={disabled}
          type={type}
        >
          {name}
        </button>
      )}
    </div>
  );
};

export default Button;
