import { format } from 'date-fns';

function component() {
  const element = document.createElement('div');
  element.setAttribute('id', 'app');
  element.innerHTML = 'Hello Webpack! ' + format(1596258181790, 'yyyy-MM-dd hh:mm:ss');
  return element;
}

document.body.appendChild(component());
