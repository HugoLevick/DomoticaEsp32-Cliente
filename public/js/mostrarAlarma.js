function mostrarAlarma(motivo) {
  let mensaje;
  switch (motivo) {
    case 'rfid':
      mensaje = 'Se detectaron demasiados intentos de acceso';
      break;
    case 'puerta':
      mensaje = 'Se detectó un acceso no autorizado';
      break;
  }
  Toastify({
    text: 'Alarma: ' + mensaje,
    duration: -1,
    //destination: 'https://github.com/apvarun/toastify-js',
    //newWindow: true,
    close: true,
    gravity: 'bottom', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: 'alarm',
    style: {
      background: 'red',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
