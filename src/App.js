import { memo } from 'react';
import { FileUploader } from './components/FileUploader';
import './App.css';
import { Table } from './components/Table';

export const App = memo(() => {
  return (
    <div className="app">
        <FileUploader />
        <Table />
    </div>
  );
});
