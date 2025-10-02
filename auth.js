// ====== Signup ======
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstname = document.getElementById("firstname-input").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const repeat = document.getElementById("signup-repeat").value;
    const error = document.getElementById("error-message");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!firstname || !email || !password || !repeat) {
      error.innerText = "All fields are required";
      return;
    }
    if (password.length < 8) {
      error.innerText = "Password must be at least 8 characters";
      return;
    }
    if (password !== repeat) {
      error.innerText = "Passwords do not match";
      return;
    }
    if (users.find(u => u.email === email)) {
      error.innerText = "Email already registered";
      return;
    }

    const newUser = { firstname, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    window.location.href = "dashboard.html";
  });
}

// ====== Login ======
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const error = document.getElementById("error-message");

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(
      u => u.email === email && u.password === password
    );

    if (!existingUser) {
      error.innerText = "Invalid login credentials";
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(existingUser));
    window.location.href = "dashboard.html";
  });
}

// ====== Show/Hide Password ======
document.querySelectorAll(".show-hide-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if(input.type === "password") {
      input.type = "text";
      btn.innerText = "Hide";
    } else {
      input.type = "password";
      btn.innerText = "Show";
    }
  });
});

// ====== Dashboard ======
const dashboardUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (dashboardUser) {
  const usernameDisplay = document.getElementById("username-display");
  if(usernameDisplay) usernameDisplay.innerText = `Hello, ${dashboardUser.firstname}`;
} else if(document.body.classList.contains('dashboard')) {
  window.location.href = "index.html";
}

// Dropdown logout
const profileBtn = document.getElementById("profile-btn");
if(profileBtn){
  const dropdown = document.querySelector(".dropdown-content");
  profileBtn.addEventListener("click", ()=> {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
}

 // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.navbar-right a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({behavior: 'smooth'});
      });
    });

    
// INTERNSHIP SECTION
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', function(e){
  e.preventDefault();

  // Gather form data
  const formData = new FormData(contactForm);

  // Submit via fetch to Web3Forms
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if(data.success){
      formMessage.innerText = "Form submitted successfully!";
      contactForm.reset();
    } else {
      formMessage.innerText = "Error submitting form. Try again.";
    }
  })
  .catch(error => {
    console.error(error);
    formMessage.innerText = "Error submitting form. Try again.";
  });
});


//  ORDER SECTION
  document.addEventListener('DOMContentLoaded', function() {
      const hostingerTabs = document.querySelectorAll('.hostinger-tab-btn');
      const hostingerContents = document.querySelectorAll('.hostinger-tab-content');

      hostingerTabs.forEach(tab => {
          tab.addEventListener('click', () => {
              hostingerTabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              hostingerContents.forEach(c => c.classList.remove('active'));
              document.getElementById(tab.dataset.tab).classList.add('active');
              if(tab.dataset.tab === 'hostinger-my-orders') hostingerLoadOrders();
          });
      });

      const hostingerOrderForm = document.getElementById('hostingerOrderForm');
      hostingerOrderForm.addEventListener('submit', function(e){
          e.preventDefault();
          const name = document.getElementById('hostingerName').value;
          const phone = document.getElementById('hostingerPhone').value;
          const service = document.getElementById('hostingerService').value;
          const address = document.getElementById('hostingerAddress').value;

          const orderId = 'HST' + Math.floor(Math.random()*100000);
          const status = 'Pending';
          const order = {orderId, name, phone, service, address, status, date:new Date().toLocaleString()};

          let orders = JSON.parse(localStorage.getItem('hostingerOrders')) || [];
          orders.push(order);
          localStorage.setItem('hostingerOrders', JSON.stringify(orders));

          document.getElementById('hostingerSuccessMsg').innerText = `Order Placed Successfully! Your Order ID: ${orderId}`;
          hostingerOrderForm.reset();
      });

      function hostingerLoadOrders(){
          const ordersList = document.getElementById('hostingerOrdersList');
          const orders = JSON.parse(localStorage.getItem('hostingerOrders')) || [];
          if(orders.length === 0) {
              ordersList.innerHTML = '<p>No hosting orders found.</p>';
          } else {
              ordersList.innerHTML = '';
              orders.forEach(o => {
                  ordersList.innerHTML += `<div class="hostinger-order">
                  <h3>${o.service} - ${o.orderId}</h3>
                  <p><strong>Name:</strong> ${o.name}</p>
                  <p><strong>Phone:</strong> ${o.phone}</p>
                  <p><strong>Email/Account:</strong> ${o.address}</p>
                  <p><strong>Status:</strong> ${o.status}</p>
                  <p><strong>Date:</strong> ${o.date}</p>
                  </div>`;
              });
          }
      }

      window.hostingerLoadOrders = hostingerLoadOrders;
  });

  document.addEventListener('DOMContentLoaded', function() {
      window.hostingerTrackOrder = function() {
          const orderId = document.getElementById('hostingerOrderIdInput').value.trim();
          const orders = JSON.parse(localStorage.getItem('hostingerOrders')) || [];
          const order = orders.find(o => o.orderId === orderId);
          const resultDiv = document.getElementById('hostingerResult');
          if(order) {
              resultDiv.innerHTML = `<p><strong>Service:</strong> ${order.service}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Name:</strong> ${order.name}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
              <p><strong>Email/Account:</strong> ${order.address}</p>`;
          } else {
              resultDiv.innerHTML = '<p style="color:red;">Order not found.</p>';
          }
      }
  });
