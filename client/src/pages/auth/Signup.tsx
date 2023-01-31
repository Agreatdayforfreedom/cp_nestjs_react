import { useMutation } from '@apollo/client';
import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import InitSpinner from '../../components/loaders/InitSpinner';
import { useForm } from '../../hooks/UseForm';
import { SIGN_UP } from '../../typedefs';

interface Form {
  username: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [handleChange, form] = useForm<Form>();
  const navigate = useNavigate();

  const [fetch, { data, loading, error }] = useMutation(SIGN_UP);
  useEffect(() => {
    console.log(form);
  }, [form]);
  useEffect(() => {
    if (data) {
      localStorage.setItem('token', data.signup.token);
      navigate('/');
    }
  }, [data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(username, email, password);

    fetch({
      variables: {
        ...form,
      },
    });
  };

  if (error) return <span>there was an error</span>;
  if (loading) return <InitSpinner />;
  return (
    <main className="h-full flex items-center justify-center">
      <div className="relative bg-blue-900 w-3/4 h-96 flex items-end justify-center">
        <form
          onSubmit={handleSubmit}
          className="absolute bg-slate-900 w-80 h-[80%] -left-[30px] right-0 top-0 bottom-0 my-auto flex items-center"
        >
          <fieldset className="mt-2">
            <legend className="absolute -top-3 left-0 right-0 m-auto w-fit text-4xl">
              Sign up
            </legend>
            <FormField
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            <FormField
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <FormField
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            <Button type="submit" name="Sign up" />
          </fieldset>
        </form>
        <div className="mb-2.5">
          <span className="text-sm">Do you already have an account? </span>
          <Link to="/login" className="text-sm hover:text-slate-400 underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Signup;
