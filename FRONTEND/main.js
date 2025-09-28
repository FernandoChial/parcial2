const API =  "https://parcial2-2sep.onrender.com";//"http://localhost:3000"; // tu backend // tu backend

function showScreen(screen) {
  document.getElementById('registerScreen').style.display = screen === 'register' ? 'block' : 'none';
  document.getElementById('loginScreen').style.display = screen === 'login' ? 'block' : 'none';
  document.getElementById('ordersScreen').style.display = screen === 'orders' ? 'block' : 'none';

  const logged = !!localStorage.getItem('userId');
  document.getElementById('navLogin').style.display = logged ? 'none' : '';
  document.getElementById('navRegister').style.display = logged ? 'none' : '';
  document.getElementById('ordersBtn').style.display = logged ? '' : 'none';
  document.getElementById('ordersBtn').disabled = !logged;
  document.getElementById('logoutBtn').style.display = logged ? '' : 'none';
}

// ---------- Registro ----------
function register(e) {
  e.preventDefault();
  const nombre = document.getElementById('regNombre').value;
  const email = document.getElementById('regEmail').value;
  const telefono = document.getElementById('regTelefono').value;

  fetch(`${API}/clientes/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, telefono })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        document.getElementById('regMsg').textContent = "Registrado correctamente";
        showScreen('login');
      } else {
        document.getElementById('regMsg').textContent = res.message || "Error al registrar";
      }
    })
    .catch(() => document.getElementById('regMsg').textContent = "Error de red");
}

// ---------- Login ----------
function login(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const telefono = document.getElementById('loginTelefono').value;

  fetch(`${API}/clientes/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, telefono })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        localStorage.setItem('userId', res.userId);
        showScreen('orders');
        loadOrders();
      } else {
        document.getElementById('loginMsg').textContent = "Credenciales incorrectas";
      }
    })
    .catch(() => document.getElementById('loginMsg').textContent = "Error de red");
}

// ---------- Logout ----------
function logout() {
  localStorage.removeItem('userId');
  showScreen('login');
}

// ---------- Nuevo pedido ----------
function newOrder(e) {
  e.preventDefault();
  const cliente = localStorage.getItem('userId');
  const patillo_nombre = document.getElementById('orderPlatillo').value;
  const note = document.getElementById('orderNote').value;

  fetch(`${API}/ordenes/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente, patillo_nombre, note })
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        document.getElementById('orderMsg').textContent = "Pedido creado";
        document.getElementById('orderPlatillo').value = "";
        document.getElementById('orderNote').value = "";
        loadOrders();
      } else {
        document.getElementById('orderMsg').textContent = "Error al crear pedido";
      }
    })
    .catch(() => document.getElementById('orderMsg').textContent = "Error de red");
}

// ---------- Cargar pedidos ----------
function loadOrders() {
  const clienteId = localStorage.getItem('userId');

  fetch(`${API}/ordenes/${clienteId}`)
    .then(r => r.json())
    .then(data => {
      const tbody = document.getElementById('ordersTable');
      tbody.innerHTML = '';
      data.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${o.id}</td>
          <td>${o.patillo_nombre}</td>
          <td>${o.note}</td>
          <td>${o.estado}</td>
          <td>${new Date(o.creado).toLocaleString()}</td>
          <td>${o.estado !== 'delivered' ? 
              `<button class="btn btn-sm btn-info" onclick="changeEstado(${o.id})">Cambiar Estado</button>` : ''}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error(err));
}

// ---------- Cambiar estado ----------
function changeEstado(id) {
  fetch(`${API}/ordenes/${id}/estado`, { method: 'PUT' })
    .then(() => loadOrders())
    .catch(err => console.error(err));
}

// Inicialización: mostrar login
showScreen('login');
