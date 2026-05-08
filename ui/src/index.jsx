import { render } from 'preact';
import './styles/style.scss';
import App from './App';

const app = document.getElementById('app')
if (app) render(<App/>, app)
