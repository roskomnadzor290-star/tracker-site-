// Центр: г. Москва, ул. Декабристов, 10к2
const CENTER = [55.865728, 37.598232];

// Все сотрудники строго по адресу (с микро-смещением, чтобы не слипались)
const employees = [
  { name: "Петрова Анна Сергеевна", role: "Заведующая отделением", birth: "07.11.1990", address: "ул. Декабристов, 10к2", lat: 55.865728, lng: 37.598232 },
  { name: "Волкова Елена Андреевна", role: "Сотрудник кассы", birth: "18.04.1995", address: "ул. Декабристов, 10к2", lat: 55.865750, lng: 37.598250 },
  { name: "Сидоров Алексей Петрович", role: "Операционист", birth: "25.06.1988", address: "ул. Декабристов, 10к2", lat: 55.865700, lng: 37.598200 },
  { name: "Кузнецова Мария Владимировна", role: "Операционист", birth: "14.02.1992", address: "ул. Декабристов, 10к2", lat: 55.865760, lng: 37.598180 },
  { name: "Смирнов Дмитрий Олегович", role: "Операционист", birth: "30.09.1983", address: "ул. Декабристов, 10к2", lat: 55.865690, lng: 37.598270 },
  { name: "Морозов Сергей Николаевич", role: "Сотрудник кассы", birth: "02.12.1987", address: "ул. Декабристов, 10к2", lat: 55.865780, lng: 37.598300 },
  { name: "Зайцева Ольга Игоревна", role: "Сотрудник кассы", birth: "21.07.1991", address: "ул. Декабристов, 10к2", lat: 55.865670, lng: 37.598150 },
  { name: "Белова Наталья Сергеевна", role: "Операционист", birth: "05.09.1993", address: "ул. Декабристов, 10к2", lat: 55.865800, lng: 37.598100 },
  { name: "Орлов Виктор Павлович", role: "Сотрудник службы безопасности", birth: "11.01.1986", address: "ул. Декабристов, 10к2", lat: 55.865650, lng: 37.598320 }
];

// Карта (зум 18 - очень близко к дому)
const map = L.map('map', { zoomControl: true }).setView(CENTER, 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Иконка (без анимации)
const redIcon = L.divIcon({
  className: '', 
  html: '<div class="marker-pin"></div>',
  iconSize: [18, 18], 
  iconAnchor: [9, 9]
});

// Желтая метка отделения
L.marker(CENTER, {
  icon: L.divIcon({
    className: '',
    html: '<div style="background:#ffd400;width:16px;height:16px;border-radius:50%;border:2px solid #000;"></div>',
    iconSize: [16, 16], iconAnchor: [8, 8]
  })
}).addTo(map).bindPopup('<b>Отделение банка</b><br>ул. Декабристов, 10к2');

// Вывод списка
const list = document.getElementById('list');
const countEl = document.getElementById('count');
if (countEl) countEl.textContent = employees.length;

employees.forEach((emp) => {
  const pos = [emp.lat, emp.lng];
  
  // Ставим маркер на карту
  const marker = L.marker(pos, { icon: redIcon }).addTo(map);
  
  // Окно при клике
  marker.bindPopup(`<b>${emp.name}</b><br><span style="color:#8a93a6">${emp.role}</span><br><span style="color:#8a93a6">Дата рождения: ${emp.birth}</span><br><span style="color:#8a93a6">Адрес: ${emp.address}</span><br><span style="color:#ff4d4d">● Под наблюдением</span>`);

  // Добавляем в левое меню
  if (list) {
    const li = document.createElement('li');
    li.innerHTML = `<b>${emp.name}</b><span>${emp.role} · ${emp.address}</span>`;
    li.addEventListener('click', () => {
      map.setView(pos, 19); 
      marker.openPopup();
    });
    list.appendChild(li);
  }
});
