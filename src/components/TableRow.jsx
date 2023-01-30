import { memo } from 'react';
import './TableRow.css';

export const TableRow = memo((props) => {
    const { row } = props;
    return ((
        <div className='row'>
            <span>{row['EmpID']}</span>
            <span>{row['ProjectID']}</span>
            <span>{row['DateFrom']}</span>
            <span>{row['DateTo']}</span>
        </div>
    ));
});
