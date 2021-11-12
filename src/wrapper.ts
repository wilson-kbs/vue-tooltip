import component from './index';

// Déclaration de la méthode d'installation utilisée via Vue.use(...)
export function install(Vue: any) {
  if ((install as any).installed) return;

  (install as any).installed = true;

  Vue.component('MyComponent', component);
}

// Création du module à destionation Vue.use(...)
const plugin = {
  install,
};

// Installation automatique si Vue est détecté (par exemple dans un navigation via la balise <script>)
let GlobalVue = null;

declare let global: any;

if (typeof window !== 'undefined') {
  GlobalVue = (window as any).Vue;
} else if (typeof (global as any) !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default component;
