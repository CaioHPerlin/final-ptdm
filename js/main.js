//registrando a service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', {
        type: 'module',
      });

      console.log('Service worker registrada.', reg);
    } catch (err) {
      console.log('Service worker registro falhou.', err);
    }
  });
}

let posicaoInicial;
const capturarPosicao = document.getElementById('localizacao');

const sucesso = (posicao) => {
  posicaoInicial = posicao;

  localizar(posicaoInicial.coords.latitude, posicaoInicial.coords.longitude);
};

const erro = (err) => {
  let errorMessage;
  switch (err.code) {
    case 0:
      errorMessage = 'Erro desconhecido!';
      break;
    case 1:
      errorMessage = 'Permissão negada!';
      break;
    case 2:
      errorMessage = 'Captura de posição indisponível!';
      break;
    case 3:
      errorMessage = 'Tempo de solicitação excedido';
      break;
  }
  console.log('Ocorreu um erro: ' + errorMessage);
};

capturarPosicao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(sucesso, erro);
});

export function localizar (lat, long) {
  const embedString = `http://maps.google.com/maps?q=${lat},${long}&z=16&output=embed`;
  
  document.getElementById('feiraAtual').innerHTML = "SUA LOCALIZAÇÃO"
  document.getElementsByTagName('iframe')[0].src = embedString;
}