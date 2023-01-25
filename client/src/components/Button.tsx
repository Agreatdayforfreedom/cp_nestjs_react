import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  name: string;
  className?: string;
  disabled?: boolean;
  to?: string;
  tag?: 'button' | 'link';
}

const Button = ({
  type = 'button',
  name,
  className = '',
  disabled = false,
  tag = 'button',
  to = '#',
}: Props) => {
  const payload = { type, className: 'btn-grad p-2', disabled };
  return (
    <div className={`${className} w-full flex justify-end`}>
      {tag === 'link' ? (
        <Link to={to} {...payload}>
          {name}
        </Link>
      ) : (
        <button {...payload} disabled={disabled} type={type}>
          {name}
        </button>
      )}
    </div>
  );
};

export default Button;
