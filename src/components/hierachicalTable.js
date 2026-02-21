import { useState, useCallback, useMemo } from 'react'
import { TableRow } from './TableRow'

export const HierarchicalTable = ({ initialRows, searchTerm = '' }) => {

    const [rows, setRows] = useState(JSON.parse(JSON.stringify(initialRows)));

    const [inputValues, setInputValues] = useState({});

    const buildOriginalsMap = (rows) => {

        const map = new Map();
        function rowsloop(r) {
            for (const row of r) {
                map.set(row.id, row.value)
                if (row.children?.length) {
                    rowsloop(row.children)
                }
            }
        }
        rowsloop(rows)
        return map
    }

    const originals = useMemo(
        () => buildOriginalsMap(initialRows),
        [initialRows]
    )

    const flattenForDisplay = useCallback((rows, originals) => {
        const result = []
        function rowsloop(r, depth, parentId) {
            for (const row of r) {
                const isLeaf = !row.children || row.children.length === 0
                result.push({
                    id: row.id,
                    label: row.label,
                    value: row.value,
                    originalValue: originals.get(row.id) ?? row.value,
                    depth,
                    parentId,
                    isLeaf,
                })
                if (row.children?.length) {
                    rowsloop(row.children, depth + 1, row.id)
                }
            }
        }
        rowsloop(rows, 0)
        return result
    }, [])

    const flatRows = useMemo(() => {
        const all = flattenForDisplay(rows, originals)
        if (!searchTerm.trim()) return all
        const term = searchTerm.trim().toLowerCase()
        return all.filter((r) => r.label.toLowerCase().includes(term))
    }, [rows, originals, searchTerm, flattenForDisplay])

    const getGrandTotal = (rows) => {
        return rows.reduce((sum, r) => sum + r.value, 0)
    }

    const grandTotal = useMemo(() => getGrandTotal(rows), [rows])
    const grandTotalOriginal = useMemo(
        () => initialRows.reduce((s, r) => s + r.value, 0),
        [initialRows]
    )

    const handleInputChange = useCallback((rowId, value) => {
        setInputValues((prev) => ({ ...prev, [rowId]: value }))
    }, [])

    function propagateParentTotals(rows) {
        function updateParents(nodes) {
            for (const node of nodes) {
                if (node.children && node.children.length > 0) {
                    updateParents(node.children)
                    node.value = Math.round(node.children.reduce((s, c) => s + c.value, 0) * 100) / 100
                }
            }
        }
        updateParents(rows)
    }

    const applyAllocationPercent = useCallback((rows, targetId, percent) => {

        const data = JSON.parse(JSON.stringify(rows))
        function updateValue(nodes) {

            for (const node of nodes) {
                if (node.id === targetId) {
                    node.value = Math.round(node.value * (1 + percent / 100) * 100) / 100;
                    return true
                }

                if (node.children && updateValue(node.children)) {
                    node.value = node.children.reduce((s, c) => s + c.value, 0)
                    return true
                }
            }
            return false
        }
        updateValue(data)
        propagateParentTotals(data)
        return data
    }, [])

    const handleAllocationPercent = useCallback(
        (rowId) => {
            const raw = inputValues[rowId]?.trim()
            if (!raw) return
            const num = parseFloat(raw.replace('%', ''))
            if (Number.isNaN(num)) return
            setRows((prev) => applyAllocationPercent(prev, rowId, num))
            setInputValues((prev) => ({ ...prev, [rowId]: '' }))
        },
        [inputValues, applyAllocationPercent]
    )

    const applyAllocationValue = useCallback((rows, targetId, newValue) => {
        const data = JSON.parse(JSON.stringify(rows))
        const rounded = Math.round(newValue * 100) / 100

        function updateNode(nodes) {
            for (const node of nodes) {
                if (node.id === targetId) return node
                if (node.children) {
                    const found = updateNode(node.children)
                    if (found) return found
                }
            }
            return null
        }

        const target = updateNode(data)
        if (!target) return data

        const isLeaf = !target.children || target.children.length === 0
        if (isLeaf) {
            target.value = rounded
            propagateParentTotals(data)

        } else {
            const children = target ? target.children : null;
            const totalBefore = children.reduce((s, c) => s + c.value, 0)
            if (totalBefore === 0) {

                const perChild = rounded / children.length

                children.forEach((c) => (c.value = Math.round(perChild * 100) / 100
                ))

            } else {

                children.forEach((c) => {
                    const ratio = c.value / totalBefore
                    c.value = Math.round(rounded * ratio * 100) / 100
                })
            }
            target.value = rounded
            propagateParentTotals(data)
        }
        return data

    }, [])
    
    const handleAllocationValue = useCallback(
        (rowId) => {
            const raw = inputValues[rowId]?.trim()
            if (!raw) return
            const num = parseFloat(raw)
            if (Number.isNaN(num) || num < 0) return
            setRows((prev) => applyAllocationValue(prev, rowId, num))
            setInputValues((prev) => ({ ...prev, [rowId]: '' }))
        },
        [inputValues, applyAllocationValue]
    )

    const grandVariance =
        grandTotalOriginal === 0
            ? 0
            : Math.round(
                (((grandTotal - grandTotalOriginal) / grandTotalOriginal) * 100) * 100 / 100
            )

    return (
        <div className="table-container">
            <table className="hierarchical-table">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Value</th>
                        <th>Input</th>
                        <th>Allocation %</th>
                        <th>Allocation Val</th>
                        <th>Variance %</th>
                    </tr>
                </thead>
                <tbody>
                    {flatRows.map((row) => (
                        <TableRow
                            key={row.id}
                            row={row}
                            inputValue={inputValues[row.id] ?? ''}
                            onInputChange={(v) => handleInputChange(row.id, v)}
                            onAllocationPercent={() => handleAllocationPercent(row.id)}
                            onAllocationValue={() => handleAllocationValue(row.id)}
                        />
                    ))}
                    <tr className="grand-total-row">
                        <td className="label-cell">Grand Total</td>
                        <td className="value-cell">{grandTotal.toFixed(2)}</td>
                        <td className="input-cell" />
                        <td className="button-cell" />
                        <td className="button-cell" />
                        <td className="variance-cell">{grandVariance}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}