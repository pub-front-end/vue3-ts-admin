import { ObjectDirective } from 'vue';

const Waves: ObjectDirective = {
  mounted(el) {
    let tempClass = el.getAttribute('class') + ' button-waves';
    el.setAttribute('class', tempClass);
    let node = document.createElement('div');
    node.setAttribute('class', 'anim');
    el.appendChild(node);
  }
};

export default Waves;
