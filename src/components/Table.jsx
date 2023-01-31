import { useCallback } from 'react';
import { memo } from 'react';
import './Table.css';

export const Table = memo((props) => {
    const { table } = props;

    const renderTableRows = useCallback(() => {
        return table.data.pairs.map((pair, index) => {
            const [employee, secondEmployee] = pair.employeePair.split(', ');

            return(
                <tr key={index}>
                    <td>{employee}</td>
                    <td>{secondEmployee}</td>
                    <td>{pair.days}</td>
                    <td>{pair.projectId}</td>
                </tr>    
            )
            });
    }, [table.data]);

    if (!table.data) return null;
    
    return (
        <>
            <h1>{table.file}</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Employee ID #1</th>
                        <th>Employee ID #2</th>
                        <th>Days</th>
                        <th>Project ID</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        </>
    )
})
