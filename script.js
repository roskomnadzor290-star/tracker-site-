// Центр района Выхино-Жулебино
const CENTER = [55.7150, 37.8300];

// Каждый сотрудник — по своему адресу в районе
const employees = [
  {
    name: "Иванов Иван Иванович",
    role: "Руководитель отделения",
    birth: "12.03.1985",
    address: "ул. Хлобыстова, 14",
    lat: 55.7168, lng: 37.8285
  },
  {
    name: "Петрова Анна Сергеевна",
    role: "Заведующая отделением",
    birth: "07.11.1990",
    address: "ул. Ташкентская, 25",
    lat: 55.7125, lng: 37.8330
  },
  {
    name: "Сидоров Алексей Петрович",
    role: "Операционист",
    birth: "25.06.1988",
    address: "ул. Ферганская, 8",
    lat: 55.7180, lng: 37.8260
  },
  {
    name: "Кузнецова Мария Владимировна",
    role: "Операционист",
    birth: "14.02.1992",
    address: "ул. Юных Ленинцев, 71",
    lat: 55.7130, lng: 37.8280
  },
  {
    name: "Смирнов Дмитрий Олегович",
    role: "Операционист",
    birth: "30.09.1983",
    address: "ул. Привольная, 45",
    lat: 55.7195, lng: 37.8350
  },
  {
    name: "Волкова Елена Андреевна",
    role: "Сотрудник кассы",
    birth: "18.04.1995",
    address: "ул. Академика Скрябина, 12",
    lat: 55.7115, lng: 37.8245
  },
  {
    name: "Морозов Сергей Николаевич",
    role: "Сотрудник кассы",
    birth: "02.12.1987",
    address: "ул. Зеленодольская, 36",
    lat: 55.7175, lng: 37.8380
  },
  {
    name: "Зайцева Ольга Игоревна",
    role: "Сотрудник кассы",
    birth: "21.07.1991",
    address: "ул. Жулебинская, 5",
    lat: 55.7100, lng: 37.8370
  },
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

const list = document.getElementById('list');
const countEl = document.getElementById('count');
countEl.textContent = employees.length;

employees.forEach((emp) => {
  const pos = [emp.lat, emp.lng];
  const marker = L.marker(pos, { icon: redIcon }).addTo(map);
  marker.bindPopup(
    `<b>${emp.name}</b><br>${emp.role}<br>
     <span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br>
     <span style="color:#8a93a6">Адрес: ${emp.address}</span><br>
     <span style="color:#ff4d4d">● Под наблюдением</span>`
  );

  const li = document.createElement('li');
  li.innerHTML = `<b>${emp.name}</b><span>${emp.role} · ${emp.address}</span>`;
  li.addEventListener('click', () => {
    map.setView(pos, 16);
    L.popup().setLatLng(pos)
      .setContent(`<b>${emp.name}</b><br>${emp.role}<br>${emp.address}`).openOn(map);
  });
  list.appendChild(li);
});
