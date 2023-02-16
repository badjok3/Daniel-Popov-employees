import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import { TableRow } from './TableRow';
import './Table.css';

export const Table = memo(() => {
    const data = useSelector(state => state.project.data);
    
    const renderTable = useCallback(() => (<div>
        {data.map((row, index) => (
            <TableRow key={index} row={row} />
        ))}
    </div>
    ), [data]);

    if (!data) return null;

    return (
        <>
            {renderTable()} 
        </>
    );
});
