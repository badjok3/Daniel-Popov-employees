import React, { memo, useCallback, useState } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { loadData } from "../store/reducer";
import { EmployeeTable } from './EmployeeTable';
import { extractCommonProjects } from '../utils/common';

export const FileUploader = memo(() => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.project.data);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = useCallback((event) => {
        const currentFile = event.target.files[0];

        setError(currentFile.name.indexOf('.csv') === -1 ? 'Please upload a .csv file' : '');
        setFile(currentFile);
    }, [setFile, setError]);

    const handleFileUpload = () => {
        if (!file || error) {
            return;
        }

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                const projectData = extractCommonProjects(results.data)
                dispatch(loadData({ file: file.name, data: projectData }));
            }
        })
    };

    return (
        <>
            {error ? <h1>{error}</h1> : null}
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            <div>
                {data.map((row, index) => (
                    <EmployeeTable key={index} table={row} />
                ))}
            </div>
        </>
    );
});
