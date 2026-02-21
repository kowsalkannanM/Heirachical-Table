

export const TableRow = ({
    row,
    inputValue,
    onInputChange,
    onAllocationPercent,
    onAllocationValue,
}) => {

    const calculateVariance = (row) => {
        if (row.originalValue === 0) return 0;
        return Number((((row.value - row.originalValue) / row.originalValue) * 100).toFixed(2))
    }

    const variance = calculateVariance(row);

    const labelPrefix = row.depth > 0 ? '— '.repeat(row.depth) : ''

    return (
        <tr className="table-row">
            <td className="label-cell">
                <span className="label-text">{labelPrefix}{row.label}</span>
            </td>
            <td className="value-cell">{row.value.toFixed(2)}</td>
            <td className="input-cell">
                <input
                    type="text"
                    className="value-input"
                    placeholder="Enter value"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                />
            </td>
            <td className="button-cell">
                <button
                    type="button"
                    className="btn btn-allocation"
                    onClick={onAllocationPercent}
                >
                    Allocation %
                </button>
            </td>
            <td className="button-cell">
                <button
                    type="button"
                    className="btn btn-allocation"
                    onClick={onAllocationValue}
                >
                    Allocation Val
                </button>
            </td>
            <td className="variance-cell">{variance}%</td>
        </tr>
    )
}