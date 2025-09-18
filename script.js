// Datos de muestra (puedes expandir según tu necesidad)
const data = {
  "Bolívar": {
    "Heres": ["Agua Salada", "Catedral", "Zea"],
    "Caroní": ["Simón Bolívar", "Unare", "Vista al Sol"],
    "Gran Sabana": ["Capital Gran Sabana", "Ikabarú", ],
    "Piar": ["Andrés Eloy Blanco", "Pedro Cova",]
  },
  "Miranda": {
    "Sucre": ["Petare", "Caucagüita", "Leoncio Martínez"],
    "Baruta": ["Baruta", "El Cafetal", "Las Minas"]
  },
  "Zulia": {
    "Maracaibo": ["Chiquinquirá", "Santa Lucía", "Cacique Mara"],
    "San Francisco": ["Domitila Flores", "Francisco O. Duarte"]
  },
  "Monagas": {
    "Maturín": ["La Cruz", "El Corozo", "La Pica"],
    "Cedeño": ["Areo", "Viento Fresco"],
    "Sotillo": ["Barrancas", "Los Barrancos de Fajardo"],
    "Caripe": ["El Guácharo", "La Guanota", "San Agustín"]
  },
  "Mérida": {
  "Libertador": ["El Llano", "Milla", "Osuna Rodriguez"],
  "Andrés Bello": ["La Azulita"], 
  }
};

// Personas de ejemplo, por parroquia (puedes cambiar los nombres)
const ejemploPersonas = {
  "Bolívar|Heres|Agua Salada": ["Luis González", "Carmen Pérez", "José Ramírez", "Valeria Torres", "Ángel Medina"],
  "Bolívar|Heres|Catedral": ["Juan Rodríguez", "María López"],
  "Bolívar|Heres|Zea": ["Sofía Castillo", "Carlos Romero"],
  "Bolívar|Caroní|Simón Bolívar": ["Rosa García", "Miguel Hernández", "Adriana Salazar"],
  "Bolívar|Caroní|Unare": ["Antonio Fuentes"],
  "Bolívar|Caroní|Vista al Sol": ["Raúl Vargas", "Lucía Mendoza"],
  "Miranda|Sucre|Petare": ["Pedro Fernández", "Ana Ortiz", "Esteban Torres", "Gabriela Díaz"],
  "Miranda|Sucre|Caucagüita": ["Juana Díaz"],
  "Miranda|Sucre|Leoncio Martínez": ["Ricardo Morales"],
  "Miranda|Baruta|Baruta": ["Samuel Pinto", "Julián Castro", "Elena Paredes"],
  "Miranda|Baruta|El Cafetal": ["Nicolás González", "Marina Serpa"],
  "Miranda|Baruta|Las Minas": ["Dayana Rodríguez"],
  "Zulia|Maracaibo|Chiquinquirá": ["Marcos Prieto", "Estefanía Rivas", "Vicente Cardozo", "Diana Marcano"],
  "Zulia|Maracaibo|Santa Lucía": ["Pablo Suárez", "Paola Ledezma"],
  "Zulia|Maracaibo|Cacique Mara": ["José Luis", "Carla Urdaneta", "Andrea Pérez"],
  "Zulia|San Francisco|Domitila Flores": ["Sergio Linares", "Lorena Peña"],
  "Zulia|San Francisco|Francisco O. Duarte": ["Cristina Fuenmayor"]
};

// Inicialización de selects
const estadoSelect = document.getElementById('estado');
const municipioSelect = document.getElementById('municipio');
const parroquiaSelect = document.getElementById('parroquia');

// Cargar estados
function cargarEstados() {
  estadoSelect.innerHTML = '<option value="">Selecciona Estado...</option>';
  Object.keys(data).forEach(estado => {
    const opt = document.createElement("option");
    opt.value = estado;
    opt.textContent = estado;
    estadoSelect.appendChild(opt);
  });
}

// Cargar municipios
estadoSelect.addEventListener('change', function() {
  municipioSelect.innerHTML = '<option value="">Selecciona Municipio...</option>';
  municipioSelect.disabled = true;
  parroquiaSelect.innerHTML = '<option value="">Selecciona Parroquia...</option>';
  parroquiaSelect.disabled = true;
  if (data[this.value]) {
    municipioSelect.disabled = false;
    Object.keys(data[this.value]).forEach(municipio => {
      const opt = document.createElement("option");
      opt.value = municipio;
      opt.textContent = municipio;
      municipioSelect.appendChild(opt);
    });
  }
  actualizarConteos();
  mostrarPersonas();
});

// Cargar parroquias
municipioSelect.addEventListener('change', function() {
  parroquiaSelect.innerHTML = '<option value="">Selecciona Parroquia...</option>';
  parroquiaSelect.disabled = true;
  const estado = estadoSelect.value;
  if (data[estado] && data[estado][this.value]) {
    parroquiaSelect.disabled = false;
    data[estado][this.value].forEach(parroquia => {
      const opt = document.createElement("option");
      opt.value = parroquia;
      opt.textContent = parroquia;
      parroquiaSelect.appendChild(opt);
    });
  }
  actualizarConteos();
  mostrarPersonas();
});

parroquiaSelect.addEventListener('change', function() {
  actualizarConteos();
  mostrarPersonas();
});

// Manejo de formulario y localStorage
const form = document.getElementById('main-form');
form.addEventListener('submit', function(e){
  e.preventDefault();
  const estado = estadoSelect.value;
  const municipio = municipioSelect.value;
  const parroquia = parroquiaSelect.value;
  const persona = document.getElementById('persona').value.trim();
  if (!estado || !municipio || !parroquia || !persona) return;
  const key = `${estado}|${municipio}|${parroquia}`;
  let parroquiaData = JSON.parse(localStorage.getItem(key) || "[]");
  parroquiaData.push(persona);
  localStorage.setItem(key, JSON.stringify(parroquiaData));
  document.getElementById('persona').value = '';
  actualizarConteos();
  mostrarPersonas();
});

// Cargar personas de ejemplo al localStorage si no existen
function cargarPersonasEjemplo() {
  Object.entries(ejemploPersonas).forEach(([key, lista]) => {
    const actuales = JSON.parse(localStorage.getItem(key) || "[]");
    if (actuales.length === 0) {
      localStorage.setItem(key, JSON.stringify(lista));
    }
  });
}

// Mostrar conteo por parroquia
function actualizarConteos() {
  let html = "<b>Conteo de personas por parroquia seleccionada:</b><br>";
  const estado = estadoSelect.value;
  const municipio = municipioSelect.value;
  if (estado && municipio && data[estado] && data[estado][municipio]) {
    data[estado][municipio].forEach(parroquia => {
      const key = `${estado}|${municipio}|${parroquia}`;
      const count = JSON.parse(localStorage.getItem(key) || "[]").length;
      html += `<span class="person-count"><strong>${parroquia}</strong>: ${count} personas</span><br>`;
    });
  } else {
    html += "<i>Seleccione Estado, Municipio y Parroquia para ver conteos.</i>";
  }
  document.getElementById('conteo-parroquias').innerHTML = html;
}

// Mostrar tarjetas de personas por parroquia actual
function mostrarPersonas() {
  const estado = estadoSelect.value;
  const municipio = municipioSelect.value;
  const parroquia = parroquiaSelect.value;
  let html = "";
  if (estado && municipio && parroquia) {
    const key = `${estado}|${municipio}|${parroquia}`;
    const personas = JSON.parse(localStorage.getItem(key) || "[]");
    if (personas.length > 0) {
      html += `<div class="personas-tarjetas">`;
      personas.forEach((p, i) => {
        html += `
          <div class="person-card">
            <div class="avatar">${getAvatar(p)}</div>
            <div class="person-details">
              <div class="person-name">${p}</div>
              <div class="person-parroquia"><i class="fa-solid fa-location-dot"></i> Parroquia: <strong>${parroquia}</strong></div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    } else {
      html += `<div style="margin-top:10px;color:#0093e9"><i>No hay personas registradas en esta parroquia.</i></div>`;
    }
  }
  document.getElementById('personas-list').innerHTML = html;
}

// Generador de "avatar" (iniciales) visual
function getAvatar(nombre) {
  const partes = nombre.split(" ");
  let avatar = partes[0][0];
  if (partes.length > 1) avatar += partes[partes.length-1][0];
  return avatar.toUpperCase();
}

// Inicializar
cargarEstados();
cargarPersonasEjemplo();
actualizarConteos();