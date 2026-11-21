// ============================================================
// Центр: г. Москва, ул. Декабристов, 10к2
// ============================================================
const CENTER = [55.865728, 37.598232];

const employees = [
  {
    name: "Петрова Анна Сергеевна",
    role: "Заведующая отделением",
    birth: "07.11.1990",
    address: "ул. Декабристов, 10к2 (отделение)",
    type: "static",
    lat: 55.865728, lng: 37.598232
  },
  {
    name: "Волкова Елена Андреевна",
    role: "Сотрудник кассы",
    birth: "18.04.1995",
    address: "ул. Декабристов, 10к2 (отделение)",
    type: "static",
    lat: 55.865800, lng: 37.598300
  },
  {
    name: "Сидоров Алексей Петрович",
    role: "Операционист",
    birth: "25.06.1988",
    address: "ул. Декабристов, 16",
    type: "moving",
    route: [
      [55.865000, 37.597000],
      [55.865500, 37.597800],
      [55.866200, 37.598800],
      [55.866800, 37.599800],
      [55.867200, 37.600500],
      [55.867500, 37.601200]
    ]
  },
  {
    name: "Кузнецова Мария Владимировна",
    role: "Операционист",
    birth: "14.02.1992",
    address: "ул. Декабристов, 22",
    type: "moving",
    route: [
      [55.864500, 37.596000],
      [55.865000, 37.596800],
      [55.865800, 37.597800],
      [55.866500, 37.598800],
      [55.867000, 37.599500],
      [55.867300, 37.600200]
    ]
  },
  {
    name: "Смирнов Дмитрий Олегович",
    role: "Операционист",
    birth: "30.09.1983",
    address: "ул. Декабристов, 27",
    type: "moving",
    route: [
      [55.866200, 37.599800],
      [55.865800, 37.599000],
      [55.865200, 37.598200],
      [55.864800, 37.597500],
      [55.864200, 37.596800],
      [55.863800, 37.596000]
    ]
  },
  {
    name: "Морозов Сергей Николаевич",
    role: "Сотрудник кассы",
    birth: "02.12.1987",
    address: "ул. Декабристов, 14",
    type: "walking",
    lat: 55.866000, lng: 37.599000,
    radius: 0.0012
  },
  {
    name: "Зайцева Ольга Игоревна",
    role: "Сотрудник кассы",
    birth: "21.07.1991",
    address: "ул. Декабристов, 18",
    type: "walking",
    lat: 55.866800, lng: 37.600200,
    radius: 0.0010
  },
  {
    name: "Белова Наталья Сергеевна",
    role: "Операционист",
    birth: "05.09.1993",
    address: "ул. Декабристов, 12",
    type: "walking",
    lat: 55.865200, lng: 37.597500,
    radius: 0.0013
  },
  {
    name: "Орлов Виктор Павлович",
    role: "Сотрудник службы безопасности",
    birth: "11.01.1986",
    address: "ул. Декабристов, 10к2",
    type: "patrol",
    lat: 55.865728, lng: 37.598232,
    radius: 0.0020
  },
];

const map = L.map('map', { zoomControl: true }).setView(CENTER, 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ЕДИНАЯ КРАСНАЯ ИКОНКА ДЛЯ ВСЕХ
const redIcon = L.divIcon({
  className: '', 
  html: '<div class="marker-pin"></div>',
  iconSize: [18, 18], 
  iconAnchor: [9, 9]
});

// Желтая метка для самого отделения банка (чтобы знать где база)
L.marker(CENTER, {
  icon: L.divIcon({
    className: '',
    html: '<div style="background:#ffd400;width:16px;height:16px;border-radius:50%;border:2px solid #000;"></div>',
    iconSize: [16, 16], iconAnchor: [8, 8]
  })
}).addTo(map).bindPopup('<b>Отделение банка</b><br>ул. Декабристов, 10к2');

function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function dist(a, b) { const dLat = b[0] - a[0]; const dLng = b[1] - a[1]; return Math.sqrt(dLat * dLat + dLng * dLng); }

const list = document.getElementById('list');
const countEl = document.getElementById('count');
if (countEl) countEl.textContent = employees.length;

const animations = [];

employees.forEach((emp) => {
  let startPos;
  if (emp.type === "static" || emp.type === "walking" || emp.type === "patrol") {
    startPos = [emp.lat, emp.lng];
  } else {
    startPos = emp.route[0];
  }

  // Всем ставим redIcon
  const marker = L.marker(startPos, { icon: redIcon }).addTo(map);
  
  marker.bindPopup(`<b>${emp.name}</b><br><span style="color:#8a93a6">${emp.role}</span><br><span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br><span style="color:#8a93a6">Адрес: ${emp.address}</span><br><span style="color:#ff4d4d">● Под наблюдением</span>`);

  if (list) {
    const li = document.createElement('li');
    li.innerHTML = `<b>${emp.name}</b><span>${emp.role} · ${emp.address}</span>`;
    li.addEventListener('click', () => { map.setView(marker.getLatLng(), 17); marker.openPopup(); });
    list.appendChild(li);
  }

  if (emp.type === "moving") animations.push({ kind: "route", marker, route: emp.route });
  else if (emp.type === "walking") animations.push({ kind: "walk", marker, base: [emp.lat, emp.lng], radius: emp.radius || 0.0012 });
  else if (emp.type === "patrol") animations.push({ kind: "patrol", marker, base: [emp.lat, emp.lng], radius: emp.radius || 0.0020 });
});

const ROUTE_CYCLE_MS = 5 * 60 * 1000;
const WALK_CYCLE_MS = 4 * 60 * 1000;
const PATROL_CYCLE_MS = 3 * 60 * 1000;
const startTime = Date.now();

function tick() {
  const elapsed = Date.now() - startTime;

  animations.forEach((a) => {
    if (a.kind === "route") {
      const path = [...a.route, ...[...a.route].reverse().slice(1)];
      let total = 0;
      const segLens = [];
      for (let i = 0; i < path.length - 1; i++) {
        const d = dist(path[i], path[i + 1]);
        segLens.push(d); total += d;
      }
      if (total === 0) return;

      const phase = (elapsed % ROUTE_CYCLE_MS) / ROUTE_CYCLE_MS;
      const t = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      let target = total * t;
      let pos = path[0];
      for (let i = 0; i < segLens.length; i++) {
        if (target <= segLens[i]) {
          const localT = segLens[i] === 0 ? 0 : target / segLens[i];
          pos = lerp(path[i], path[i + 1], localT);
          break;
        }
        target -= segLens[i];
      }
      a.marker.setLatLng(pos);
    }

    if (a.kind === "walk") {
      const angle = (elapsed / WALK_CYCLE_MS) * Math.PI * 2;
      const lat = a.base[0] + a.radius * Math.sin(angle);
      const lng = a.base[1] + (a.radius / Math.cos(a.base[0] * Math.PI / 180)) * Math.cos(angle);
      a.marker.setLatLng([lat, lng]);
    }

    if (a.kind === "patrol") {
      const angle = (elapsed / PATROL_CYCLE_MS) * Math.PI * 2;
      const lat = a.base[0] + a.radius * Math.sin(angle);
      const lng = a.base[1] + (a.radius / Math.cos(a.base[0] * Math.PI / 180)) * Math.cos(angle);
      a.marker.setLatLng([lat, lng]);
    }
  });
}

setInterval(tick, 50);
