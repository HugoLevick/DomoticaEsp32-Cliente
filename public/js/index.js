document.getElementById('mute-button').onclick = async () => {
  const response = await fetch('/api/auth/alarmas/silenciar');
  if (!response.ok) {
    Toastify({
      text: 'No se pudo silenciar la alarma',
      duration: 3000,
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'red',
      },
      onClick: function () {}, // Callback after click
    }).showToast();

    console.log(response);
  } else {
    const toasts = document.querySelectorAll('.alarm.toastify');
    for (const toast of toasts) {
      toast.classList.remove('on');
      toast.classList.add('off');

      setTimeout(() => {
        toast.remove();
      }, 500);
    }
    playAlarmAudio.pause();
    silenceAlarmAudio.play();

    Toastify({
      text: 'Alarma silenciada',
      duration: 3000,
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'green',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
};

// const botones = document.querySelectorAll('.button.device-card');

const containerLeds = document.querySelector('#leds');
const containerStats = document.querySelector('#stats');

getStatsAndDisplay();
setInterval(getStatsAndDisplay, 20000);

async function start() {
  const leds = await fetch('/api/leds').then((res) => res.json());

  const alarmas = await fetch('/api/auth/alarmas').then((res) => res.json());
  if (alarmas.length > 0) {
    playAlarmAudio.play();
  }
  for (const motivo of alarmas) {
    mostrarAlarma(motivo);
  }

  containerLeds.innerHTML = '';

  for (const led of leds) {
    const card = document.createElement('div');
    card.id = 'led-' + led.nombre;
    card.classList.add('button');
    card.classList.add('device-card');
    card.classList.add('clickable');
    if (led.estado) card.classList.add('enabled');

    const cardIcon = document.createElement('div');
    cardIcon.classList.add('card-icon');
    cardIcon.innerHTML = bulbIcon;
    card.appendChild(cardIcon);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    cardTitle.innerHTML = led.nombre;
    card.appendChild(cardTitle);

    const cardValue = document.createElement('div');
    cardValue.classList.add('card-value');
    cardValue.innerHTML = led.estado ? 'Encendido' : 'Apagado';
    card.appendChild(cardValue);

    card.addEventListener('click', async (event) => {
      //Verificar que se dé click al botón y no al texto u otro elemento

      let target;
      if (event.target != card)
        target = event.target.closest('.button.device-card');
      else target = event.target;
      if (target.disabled) return;
      target.disabled = true;

      target.classList.toggle('loading');

      const response = await fetch('/api/leds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ledName: led.nombre,
        }),
      });

      if (!response.ok) {
        console.log(await response.json());
      }
      target.classList.toggle('loading');
      target.disabled = false;
    });

    containerLeds.appendChild(card);
  }
}

async function getStatsAndDisplay() {
  const response = await fetch('/api/stats');
  if (!response.ok) console.log(response);

  const tempCardValue = document.querySelector('#temp .card-value');
  const humCardValue = document.querySelector('#hum .card-value');
  const accCardValue = document.querySelector('#acc .card-value');
  const stats = await response.json();

  tempCardValue.innerHTML = stats.temperatura.toFixed(1) + '°C';
  tempCardValue.parentElement.classList.remove('loading');

  humCardValue.innerHTML = stats.humedad.toFixed(1) + '%';
  humCardValue.parentElement.classList.remove('loading');

  accCardValue.style.color = 'black';
  if (stats.usuario) {
    if (stats.usuario.name === 'Intruso') {
      accCardValue.style.color = 'red';
    }
    accCardValue.innerHTML = stats.usuario.name;
  } else {
    accCardValue.innerHTML = 'Sin accesos...';
  }
  accCardValue.parentElement.classList.remove('loading');
  console.log(stats);
}
start();
