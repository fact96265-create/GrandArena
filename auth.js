/* ================================
   AUTH.JS – FULL & FINAL VERSION
   Handles login, signup, logout,
   session detection & page lock
================================ */

// CHECK SESSION EVERY TIME PAGE LOADS
document.addEventListener("DOMContentLoaded", async () => {
  const protectedPages = [
    "index.html",
    "wallet.html",
    "tournaments.html",
    "create-tournament.html",
    "withdraw.html",
    "upload.html",
    "transactions.html",
    "notifications.html",
    "admin.html"
  ];

  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage)) {
    await protectUser();
  }
});

/* ===============================
   PROTECT PAGE
================================ */
async function protectUser() {
  const { data, error } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
  }
}

/* ===============================
   SIGNUP HANDLER
================================ */
async function handleSignup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  // CREATE WALLET FOR NEW USER
  await supabase.from("wallets").insert({
    user_id: data.user.id,
    balance: 0
  });

  alert("Account created! Please login.");
  window.location.href = "login.html";
}

/* ===============================
   LOGIN HANDLER
================================ */
async function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "index.html";
}

/* ===============================
   LOGOUT HANDLER
================================ */
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

/* ===============================
   CHECK IF USER IS ADMIN (OPTIONAL)
================================ */
async function isAdmin() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;

  const adminEmails = [
    "admin@gmail.com",
    "owner@gmail.com",
    "dipanshu@admin.com"
  ];

  return adminEmails.includes(data.user.email);
}

/* ===============================
   REDIRECT NON-ADMIN FROM ADMIN PAGE
================================ */
async function protectAdmin() {
  const allowed = await isAdmin();
  if (!allowed) {
    alert("Admin access only!");
    window.location.href = "index.html";
  }
}