import { memo } from 'react';
import { FileUploader } from './components/FileUploader';
import './App.css';

export const App = memo(() => {
  return (
    <div className="app">
        <FileUploader />
    </div>
  );
});
