// Центр района Выхино-Жулебино (примерно)
const CENTER = [55.7150, 37.8300];

const employees = [
  { name: "Иванов Иван Иванович",         role: "Руководитель отделения", birth: "12.03.1985" },
  { name: "Петрова Анна Сергеевна",       role: "Заведующая отделением",  birth: "07.11.1990" },
  { name: "Сидоров Алексей Петрович",     role: "Операционист",           birth: "25.06.1988" },
  { name: "Кузнецова Мария Владимировна", role: "Операционист",           birth: "14.02.1992" },
  { name: "Смирнов Дмитрий Олегович",     role: "Операционист",           birth: "30.09.1983" },
  { name: "Волкова Елена Андреевна",      role: "Сотрудник кассы",        birth: "18.04.1995" },
  { name: "Морозов Сергей Николаевич",    role: "Сотрудник кассы",        birth: "02.12.1987" },
  { name: "Зайцева Ольга Игоревна",       role: "Сотрудник кассы",        birth: "21.07.1991" },
];

const map = L.map('map', { zoomControl: true }).setView(CENTER, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Красный пульсирующий маркер
const redIcon = L.divIcon({
  className: '',
  html: '<div class="marker-pin"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Разброс точек по району в радиусе ~1.5 км
function jitter(base, radiusMeters) {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.random() * radiusMeters;
  return [
    base[0] + (r / 111320) * Math.sin(angle),
    base[1] + (r / (111320 * Math.cos(base[0] * Math.PI / 180))) * Math.cos(angle)
  ];
}

const list = document.getElementById('list');
const countEl = document.getElementById('count');
countEl.textContent = employees.length;

employees.forEach((emp) => {
  const pos = jitter(CENTER, 1500); // радиус разброса 1500 метров (1.5 км)
  const marker = L.marker(pos, { icon: redIcon }).addTo(map);
  marker.bindPopup(
    `<b>${emp.name}</b><br>${emp.role}<br>
     <span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br>
     <span style="color:#ff4d4d">● Под наблюдением</span>`
  );

  const li = document.createElement('li');
  li.innerHTML = `<b>${emp.name}</b><span>${emp.role}</span>`;
  li.addEventListener('click', () => {
    map.setView(pos, 16);
    L.popup().setLatLng(pos)
      .setContent(`<b>${emp.name}</b><br>${emp.role}`).openOn(map);
  });
  list.appendChild(li);
});
