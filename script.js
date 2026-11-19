// Центр: г. Москва, ул. Ташкентская, 9
const CENTER = [55.7054, 37.7423];

// Сотрудники под наблюдением (демо-данные).
// Координаты смещены вокруг дома для наглядности.
const employees = [
  { name: "Иванов Иван Иванович",       role: "Руководитель отделения", birth: "12.03.1985", lat: 55.7056, lng: 37.7428 },
  { name: "Петрова Анна Сергеевна",     role: "Заведующая отделением",  birth: "07.11.1990", lat: 55.7051, lng: 37.7419 },
  { name: "Сидоров Алексей Петрович",   role: "Операционист",           birth: "25.06.1988", lat: 55.7059, lng: 37.7421 },
  { name: "Кузнецова Мария Владимировна", role: "Операционист",         birth: "14.02.1992", lat: 55.7048, lng: 37.7429 },
  { name: "Смирнов Дмитрий Олегович",   role: "Операционист",           birth: "30.09.1983", lat: 55.7052, lng: 37.7433 },
  { name: "Волкова Елена Андреевна",    role: "Сотрудник кассы",        birth: "18.04.1995", lat: 55.7057, lng: 37.7415 },
  { name: "Морозов Сергей Николаевич",  role: "Сотрудник кассы",        birth: "02.12.1987", lat: 55.7049, lng: 37.7417 },
  { name: "Зайцева Ольга Игоревна",     role: "Сотрудник кассы",        birth: "21.07.1991", lat: 55.7054, lng: 37.7425 },
];

// Инициализация карты
const map = L.map('map', { zoomControl: true }).setView(CENTER, 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Метка самого здания
L.marker(CENTER, {
  icon: L.divIcon({
    className: '',
    html: '<div style="background:#ffd400;width:14px;height:14px;border-radius:50%;border:2px solid #000;"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  })
}).addTo(map).bindPopup('<b>Объект:</b> ул. Ташкентская, 9');

// Красные пульсирующие маркеры
const redIcon = L.divIcon({
  className: '',
  html: '<div class="marker-pin"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

employees.forEach((emp) => {
  const marker = L.marker([emp.lat, emp.lng], { icon: redIcon }).addTo(map);
  marker.bindPopup(
    `<b>${emp.name}</b><br>
     ${emp.role}<br>
     <span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br>
     <span style="color:#ff4d4d">● Под наблюдением</span>`
  );
});

// Боковая панель
const list = document.getElementById('list');
const countEl = document.getElementById('count');
countEl.textContent = employees.length;

employees.forEach((emp) => {
  const li = document.createElement('li');
  li.innerHTML = `<b>${emp.name}</b><span>${emp.role}</span>`;
  li.addEventListener('click', () => {
    map.setView([emp.lat, emp.lng], 19);
    L.popup()
      .setLatLng([emp.lat, emp.lng])
      .setContent(`<b>${emp.name}</b><br>${emp.role}`)
      .openOn(map);
  });
  list.appendChild(li);
});
