import React, { memo, useCallback, useState, useRef } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { loadData, clearData } from '../store/reducer';
import { Table } from './Table';
import { extractLongestCommonProject } from '../utils/common';
import './FileUploader.css';

export const FileUploader = memo(() => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.project.data);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const handleFileChange = useCallback((event) => {
        const currentFile = event.target.files[0];

        if (currentFile.name.indexOf('.csv') === -1) {
            setError('Please select a .csv file');
            setFile(null);
            return;
        }
        setError('');
        setFile(currentFile);
    }, [setFile, setError]);

    const onFileUploadClick = () => {
        if (!file || error) {
            setError(error ? error : 'Please select a file');
            return;
        }

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                const projectData = extractLongestCommonProject(results.data)
                fileRef.current.value = null;
                if (projectData.error) {
                    setError(projectData.error);
                    return;
                }

                dispatch(loadData({ file: file.name, data: projectData }));
                setFile(null);
            }
        });
    };

    const onClearDataClick = () => {
        fileRef.current.value = null;
        setFile(null);
        setError('');
        dispatch(clearData());
    };

    return (
        <>
            <div className='intro'>Daniel Popov's <b>Pair of employees who have worked together</b> solution</div>
            <input type='file' ref={fileRef} className='custom-file-input' accept=".csv" onChange={handleFileChange} />
            <div className='button-wrapper'>
                <button onClick={onFileUploadClick} className='upload-button'>Upload</button>
                <button onClick={onClearDataClick} className='clear-button'>Clear Data</button>
            </div>

            {error ? <div className='error'>{error}</div> : null}

            <div>
                {data.map((row, index) => (
                    <Table key={index} table={row} />
                ))}
            </div>
        </>
    );
});
