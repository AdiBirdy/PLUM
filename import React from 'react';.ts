import React from 'react';
import { createRoot } from 'react-dom/client';
import OnCallTrendsDashboard from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<OnCallTrendsDashboard />);
