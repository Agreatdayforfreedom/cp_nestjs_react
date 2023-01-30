import React from 'react';
import { BiCheck } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';

interface Props {
  type?: 'submit' | 'reset' | 'button';
  color?: 'red' | 'blue' | 'green';
  name: string | React.ReactElement;
  className?: string;
  disabled?: boolean;
  to?: string;
  success?: boolean;
  tag?: 'button' | 'link';
  onClick?: () => void | undefined;
}

const Button = ({
  type = 'button',
  name,
  color = 'green',
  className = '',
  disabled = false,
  success = false,
  tag = 'button',
  to = '#',
  onClick = undefined,
}: Props) => {
  const classColor = `btn-grad-${color}`;

  return (
    <div className={` w-full flex items-center justify-end`}>
      {tag === 'link' ? (
        <Link className={`${classColor} btn-grad ${className}`} to={to}>
          {name}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`${classColor} ${
            success && 'btn-success'
          } btn-grad ${className}`}
          disabled={disabled}
          type={type}
        >
          {success ? <BiCheck size={25} /> : name}
        </button>
      )}
    </div>
  );
};

export default Button;
