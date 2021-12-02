import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App'

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<App />)
    
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)
    // 1. finds H1
    const h1 = screen.queryByText('Contact Form')
    // 2. ensures H1 says Contact form
    expect(h1).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)

    // 1. find the firstName input
    const firstName = screen.getByLabelText(/First Name*/i);
    // 2. type 4 characters
    userEvent.type(firstName, "Jack");
    // 3. expect an error message
    await waitFor(() => {
        const error = screen.queryByText(/firstName must have at least 5 characters/i);
        expect(error).toBeInTheDocument();
    });
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const submit = screen.getByRole("button");
    userEvent.click(submit);
    await waitFor(()=> {
        const firstNameError = screen.queryByText(/firstName must have at least 5 characters/i);
        const lastNameError = screen.queryByText(/lastName is a required field/i);
        const emailError = screen.queryByText(/email must be a valid email address/i);
        expect(firstNameError).toBeVisible();
        expect(lastNameError).toBeVisible();
        expect(emailError).toBeVisible();
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)

    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "Jackson");

    const lastName = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastName, "Jack");
    
    const submit = screen.getByRole("button")
    userEvent.click(submit);
    await waitFor(() => {
        const error1 = screen.queryByText(/Error: email/i);
        const error2 = screen.queryByText(/Error: first/i);
        const error3 = screen.queryByText(/Error: last/i);
        expect(error1).toBeInTheDocument();
        expect(error2).not.toBeInTheDocument();
        expect(error3).not.toBeInTheDocument();
    });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm /> )

    const email = screen.getByLabelText(/email/i);
    userEvent.type(email, 'Heyo');

    await waitFor(()=>{
        const error = screen.queryByText(/email must be a valid email address/i)
        expect(error).toBeVisible();
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    
    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "Jackson");

    const email = screen.getByLabelText(/email/i);
    userEvent.type(email, "Jack@email.com");
    
    const submit = screen.getByRole("button")
    userEvent.click(submit);
    await waitFor(() => {
        const error1 = screen.queryByText(/Error: email/i);
        const error2 = screen.queryByText(/Error: first/i);
        const error3 = screen.queryByText(/lastName is a required field/i);
        expect(error3).toBeInTheDocument();
        expect(error1).not.toBeInTheDocument();
        expect(error2).not.toBeInTheDocument();
    });
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    
    const submit = screen.getByRole("button")
    userEvent.click(submit);
    await waitFor(() => {
        const first = screen.queryByText(/First Name:/i);
        const last = screen.queryByText(/Last Name:/i);
        const email = screen.queryByText(/Email:/i);
        const message = screen.queryByText(/You Submitted:/i);
        expect(first).not.toBeInTheDocument();
        expect(last).not.toBeInTheDocument();
        expect(email).not.toBeInTheDocument();
        expect(message).not.toBeInTheDocument();
    });

    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "Jackson");

    const lastName = screen.getByLabelText(/last Name*/i);
    userEvent.type(lastName, "Jack");

    const email = screen.getByLabelText(/email/i);
    userEvent.type(email, "Jack@email.com");

    userEvent.click(submit);
    await waitFor(() => {
        const first = screen.queryByText(/First Name:/i);
        const last = screen.queryByText(/Last Name:/i);
        const email = screen.queryByText(/Email:/i);
        const message = screen.queryByText(/You Submitted:/i);
        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(message).toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)
    const firstName = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstName, "Jackson");

    const lastName = screen.getByLabelText(/last Name*/i);
    userEvent.type(lastName, "Jack");

    const email = screen.getByLabelText(/email/i);
    userEvent.type(email, "Jack@email.com");
    
    const message = screen.getByLabelText(/message/i);
    userEvent.type(message, "You are the coolest!")

    const submit = screen.getByRole("button")
    userEvent.click(submit);
    await waitFor(() => {
        const done = screen.queryByText(/You Submitted/i);
        const first = screen.queryByText(/First Name:/i);
        const last = screen.queryByText(/Last Name:/i);
        const mail = screen.queryByText(/Email:/i);
        const note = screen.queryByText(/Message:/i)
        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(mail).toBeInTheDocument();
        expect(done).toBeInTheDocument();
        expect(note).toBeVisible();
    });
});