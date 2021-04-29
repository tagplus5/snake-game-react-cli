const React = require('react');
const importJsx = require('import-jsx');
const { render } = require('ink');

const ui = importJsx('./ui');

// Вызывается рендер приложения
render(React.createElement(ui));
