/* Déclaration de type pour les imports CSS */
declare module '*.css' {
  const content: string;
  export default content;
}

/* Déclaration pour chart.js/auto */
declare module 'chart.js/auto' {
  export * from 'chart.js';
}

declare global {
  namespace L {
    namespace control {
      function fullscreen(options?: any): Control;
    }
  }
}
