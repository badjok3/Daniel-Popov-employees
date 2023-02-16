import { memo } from 'react';
import { FileUploader } from './components/FileUploader';
import { Table } from './components/Table';
import './App.css';

export const App = memo(() => {
  return (
    <div className="app">
        <div className='intro'>Daniel Popov's <b>Pair of employees who have worked together</b> solution</div>
        <FileUploader />
        <Table />
    </div>
  );
});
