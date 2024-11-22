// src/utils/auth.js
export function getUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return userData || {  username: '', email: '' };
  }