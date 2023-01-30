import { memo } from "react";
import { TableRow } from "./TableRow";

export const EmployeeTable = memo((props) => {
    const { table } = props;

    if (!table) return null;

    return (
        <>
            <h1>{table.file}</h1>
            {table.data ? table.data.map((row, index) => <TableRow key={index} row={row} />) : 'There seems to be no data in this file.'}
        </>
    )
})
