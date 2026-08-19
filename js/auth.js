// js/auth.js
import { supabase } from './supabaseClient.js';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const errorMsg = document.getElementById('error-msg');

// Handle login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      errorMsg.textContent = error.message;
      return;
    }

    // Login successful — go to dashboard
    window.location.href = 'dashboard.html';
  });
}

// Handle signup
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      errorMsg.textContent = error.message;
      return;
    }

    errorMsg.style.color = 'green';
    errorMsg.textContent = 'Account created! You can now log in.';
    signupForm.reset();
  });
}