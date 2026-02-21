# TableUI - Hierarchical Table Website

A React application featuring a hierarchical table with allocation controls, variance tracking.

---

## Functionality

### 1. Hierarchical Table Structure

- **Parent-child rows**: Categories (e.g., Electronics, Furniture) contain child items (e.g., Phones, Laptops, Tables, Chairs).
- **Automatic subtotals**: Parent row values are calculated from their children. When a child value changes, the parent updates automatically.
- **Grand Total**: A footer row sums all top-level category values.

### 2. Allocation % Button

- **Purpose**: Increase a row's value by a percentage.
- **How to use**: Enter a percentage number (e.g., `10`) in the input field, then click **Allocation %**.
- **Example**: Phones at 800 + 10% → 880. Electronics subtotal updates to 1580.

### 3. Allocation Val Button

- **Purpose**: Set a row's value to a specific number.
- **Leaf rows**: The value is set directly; parent subtotals recalculate.
- **Parent rows**: The new value is distributed to children based on their current contribution ratio.
  - Example: Furniture 1100 → 2000. Tables (400/1100) and Chairs (700/1100) scale proportionally to 727.27 and 1272.73.

### 4. Variance Display

- **Purpose**: Shows percentage change from the original value.
- **Formula**: `(current - original) / original × 100`
- **Display**: Each row and the Grand Total show variance %. 0% means unchanged.

### 5. Search

- **Purpose**: Filter table rows by label.
- **How to use**: Type in the search box; only rows whose label contains the search term are shown.

---

## Tech Stack

- React 18

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```