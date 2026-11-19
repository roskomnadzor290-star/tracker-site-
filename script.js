// Центр района Выхино-Жулебино
const CENTER = [55.7150, 37.8300];

const employees = [
  { name: "Иванов Иван Иванович", role: "Руководитель отделения", birth: "12.03.1985", address: "ул. Хлобыстова, 14", type: "static", lat: 55.7168, lng: 37.8285 },
  { name: "Петрова Анна Сергеевна", role: "Заведующая отделением", birth: "07.11.1990", address: "ул. Ташкентская, 25", type: "static", lat: 55.7125, lng: 37.8330 },
  { name: "Сидоров Алексей Петрович", role: "Операционист", birth: "25.06.1988", address: "ул. Ферганская, 8", type: "moving", route: [[55.7180, 37.8260], [55.7190, 37.8310], [55.7195, 37.8350]] },
  { name: "Кузнецова Мария Владимировна", role: "Операционист", birth: "14.02.1992", address: "ул. Юных Ленинцев, 71", type: "moving", route: [[55.7130, 37.8280], [55.7145, 37.8330], [55.7175, 37.8380]] },
  { name: "Смирнов Дмитрий Олегович", role: "Операционист", birth: "30.09.1983", address: "ул. Привольная, 45", type: "moving", route: [[55.7195, 37.8350], [55.7170, 37.8390], [55.7100, 37.8370]] },
  { name: "Волкова Елена Андреевна", role: "Сотрудник кассы", birth: "18.04.1995", address: "ул. Академика Скрябина, 12", type: "walking", lat: 55.7115, lng: 37.8245 },
  { name: "Морозов Сергей Николаевич", role: "Сотрудник кассы", birth: "02.12.1987", address: "ул. Зеленодольская, 36", type: "walking", lat: 55.7175, lng: 37.8380 },
  { name: "Зайцева Ольга Игоревна", role: "Сотрудник кассы", birth: "21.07.1991", address: "ул. Жулебинская, 5", type: "walking", lat: 55.7100, lng: 37.8370 },
];

console.log("[tracker] старт, сотрудников:", employees.length);

const map = L.map('map', { zoomControl: true }).setView(CENTER, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const redIcon = L.divIcon({ className: '', html: '<div class="marker-pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
const movingIcon = L.divIcon({ className: '', html: '<div class="marker-pin moving"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
const walkingIcon = L.divIcon({ className: '', html: '<div class="marker-pin walking"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function dist(a, b) { const dLat = b[0] - a[0]; const dLng = b[1] - a[1]; return Math.sqrt(dLat * dLat + dLng * dLng); }

const list = document.getElementById('list');
const countEl = document.getElementById('count');
if (countEl) countEl.textContent = employees.length;

const animations = [];

employees.forEach((emp) => {
  let icon = redIcon;
  if (emp.type === "moving") icon = movingIcon;
  if (emp.type === "walking") icon = walkingIcon;

  let startPos;
  if (emp.type === "static" || emp.type === "walking") startPos = [emp.lat, emp.lng];
  else startPos = emp.route[0];

  const marker = L.marker(startPos, { icon: icon }).addTo(map);
  marker.bindPopup(`<b>${emp.name}</b><br>${emp.role}<br><span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br><span style="color:#8a93a6">Адрес: ${emp.address}</span><br><span style="color:#ff4d4d">● Под наблюдением</span>`);

  if (list) {
    const li = document.createElement('li');
    li.innerHTML = `<b>${emp.name}</b><span>${emp.role} · ${emp.address}</span>`;
    li.addEventListener('click', () => { map.setView(marker.getLatLng(), 16); marker.openPopup(); });
    list.appendChild(li);
  }

  if (emp.type === "moving") animations.push({ kind: "route", marker, route: emp.route });
  else if (emp.type === "walking") animations.push({ kind: "walk", marker, base: [emp.lat, emp.lng], radius: 0.002 });
});

// ---------- АНИМАЦИЯ через setInterval (надёжнее) ----------
const ROUTE_CYCLE_MS = 5 * 60 * 1000; // 5 минут
const WALK_CYCLE_MS = 4 * 60 * 1000;  // 4 минуты
const startTime = Date.now();

let tickCount = 0;

function tick() {
  tickCount++;
  if (tickCount === 1) console.log("[tracker] tick #1 — анимация реально идёт");
  if (tickCount === 100) console.log("[tracker] tick #100 — всё ок, движение продолжается");

  const elapsed = Date.now() - startTime;

  animations.forEach((a) => {
    if (a.kind === "route") {
      const path = [...a.route, ...[...a.route].reverse().slice(1)];
      let total = 0;
      const segLens = [];
      for (let i = 0; i < path.length - 1; i++) {
        const d = dist(path[i], path[i + 1]);
        segLens.push(d);
        total += d;
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
  });
}

// Запуск: каждые 50 мс = 20 раз в секунду (плавно)
setInterval(tick, 50);
console.log("[tracker] setInterval запущен, tick каждые 50 мс");
