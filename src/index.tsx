import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './app/styles/index.scss';

import { App } from './app';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
