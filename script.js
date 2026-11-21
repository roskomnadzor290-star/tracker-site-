// ============================================================
// Центр: г. Москва, ул. Декабристов, 10к2
// ============================================================
const CENTER = [55.865728, 37.598232];

// Координаты всех сотрудников вокруг здания (с небольшим смещением в метрах)
const employees = [
  {
    name: "Петрова Анна Сергеевна",
    role: "Заведующая отделением",
    birth: "07.11.1990",
    address: "ул. Декабристов, 10к2",
    lat: 55.865728, lng: 37.598232 // Центр
  },
  {
    name: "Волкова Елена Андреевна",
    role: "Сотрудник кассы",
    birth: "18.04.1995",
    address: "ул. Декабристов, 10к2",
    lat: 55.865750, lng: 37.598250 
  },
  {
    name: "Сидоров Алексей Петрович",
    role: "Операционист",
    birth: "25.06.1988",
    address: "ул. Декабристов, 10к2",
    lat: 55.865700, lng: 37.598200
  },
  {
    name: "Кузнецова Мария Владимировна",
    role: "Операционист",
    birth: "14.02.1992",
    address: "ул. Декабристов, 10к2",
    lat: 55.865760, lng: 37.598180
  },
  {
    name: "Смирнов Дмитрий Олегович",
    role: "Операционист",
    birth: "30.09.1983",
    address: "ул. Декабристов, 10к2",
    lat: 55.865690, lng: 37.598270
  },
  {
    name: "Морозов Сергей Николаевич",
    role: "Сотрудник кассы",
    birth: "02.12.1987",
    address: "ул. Декабристов, 10к2",
    lat: 55.865780, lng: 37.598300
  },
  {
    name: "Зайцева Ольга Игоревна",
    role: "Сотрудник кассы",
    birth: "21.07.1991",
    address: "ул. Декабристов, 10к2",
    lat: 55.865670, lng: 37.598150
  },
  {
    name: "Белова Наталья Сергеевна",
    role: "Операционист",
    birth: "05.09.1993",
    address: "ул. Декабристов, 10к2",
    lat: 55.865800, lng: 37.598100
  },
  {
    name: "Орлов Виктор Павлович",
    role: "Сотрудник службы безопасности",
    birth: "11.01.1986",
    address: "ул. Декабристов, 10к2",
    lat: 55.865650, lng: 37.598320
  }
];

console.log("[tracker] старт, сотрудников:", employees.length);

// ============================================================
// Карта
// ============================================================
const map = L.map('map', { zoomControl: true }).setView(CENTER, 18); // Зум 18 (очень близко к дому)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ============================================================
// Иконки
// ============================================================
// Единый красный пульсирующий маячок
const redIcon = L.divIcon({
  className: '', 
  html: '<div class="marker-pin"></div>',
  iconSize: [18, 18], 
  iconAnchor: [9, 9]
});

// Желтая метка самого отделения (для ориентира)
L.marker(CENTER, {
  icon: L.divIcon({
    className: '',
    html: '<div style="background:#ffd400;width:16px;height:16px;border-radius:50%;border:2px solid #000;box-shadow:0 0 6px #ffd400;"></div>',
    iconSize: [16, 16], 
    iconAnchor: [8, 8]
  })
}).addTo(map).bindPopup('<b>Отделение банка</b><br>ул. Декабристов, 10к2');

// ============================================================
// Создание маркеров (без анимации)
// ============================================================
const list = document.getElementById('list');
const countEl = document.getElementById('count');
if (countEl) countEl.textContent = employees.length;

employees.forEach((emp) => {
  const pos = [emp.lat, emp.lng];
  
  // Ставим маркер
  const marker = L.marker(pos, { icon: redIcon }).addTo(map);
  
  // Всплывающее окно
  marker.bindPopup(`
    <b>${emp.name}</b><br>
    <span style="color:#8a93a6">${emp.role}</span><br>
    <span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br>
    <span style="color:#8a93a6">Адрес: ${emp.address}</span><br>
    <span style="color:#ff4d4d">● Под наблюдением</span>
  `);

  // Добавляем в левый список
  if (list) {
    const li = document.createElement('li');
    li.innerHTML = `<b>${emp.name}</b><span>${emp.role} · ${emp.address}</span>`;
    li.addEventListener('click', () => {
      map.setView(pos, 19); // При клике приближаем
      marker.openPopup();
    });
    list.appendChild(li);
  }
});
