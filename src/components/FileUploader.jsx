import React, { memo, useCallback, useState, useRef } from 'react';
import Papa from 'papaparse';
import toastr from 'toastr';
import { useDispatch } from 'react-redux';
import { loadData, clearData } from '../store/reducer';
import { extractLongestCommonProject } from '../utils/common';
import { SELECT_FILE_ERROR, SELECT_CSV_FILE_ERROR, CLEAR_SUCCESS, FILE_UPLOAD_SUCCESS } from '../constants/notifications'
import './FileUploader.css';

export const FileUploader = memo(() => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);

    const handleFileChange = useCallback((event) => {
        const currentFile = event.target.files[0];

        if (currentFile.name.indexOf('.csv') === -1) {
            toastr.error(SELECT_CSV_FILE_ERROR);
            setFile(null);
            return;
        }
        setFile(currentFile);
    }, [setFile]);

    const onFileUploadClick = () => {
        if (!file) {
            toastr.error(SELECT_FILE_ERROR);
            return;
        }

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                const projectData = extractLongestCommonProject(results.data)
                fileRef.current.value = null;
                if (!projectData || !projectData.totalDays) {
                    return;
                }

                toastr.success(FILE_UPLOAD_SUCCESS);
                dispatch(loadData({ file: file.name, data: projectData }));
                setFile(null);
            }
        });
    };

    const onClearDataClick = () => {
        fileRef.current.value = null;
        setFile(null);
        toastr.success(CLEAR_SUCCESS);
        dispatch(clearData());
    };

    return (
        <>
            <input type='file' ref={fileRef} className='custom-file-input' accept=".csv" onChange={handleFileChange} />
            <div className='button-wrapper'>
                <button onClick={onFileUploadClick} className='upload-button'>Upload</button>
                <button onClick={onClearDataClick} className='clear-button'>Clear Data</button>
            </div>
        </>
    );
});
