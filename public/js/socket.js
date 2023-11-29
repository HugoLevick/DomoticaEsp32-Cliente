const socket = io();

socket.on('ledUpdate', (data) => {
  const ledCard = document.getElementById('led-' + data.ledName);
  if (!ledCard) return;

  data.state
    ? ledCard.classList.add('enabled')
    : ledCard.classList.remove('enabled');

  ledCard.querySelector('.card-value').innerHTML = data.state
    ? 'Encendido'
    : 'Apagado';
});

socket.on('alarm', (motivo) => {
  playAlarmAudio.play();
  mostrarAlarma(motivo);
});
