
const red = '#D43425';
const gray = '#D8D8D8';

module.exports = `
.cross-table {
  text-align: center;
  width: 100%;
  border-spacing: 0;
  order-collapse: collapse;
}

.cross-table .stripe-bar {
  margin: 0 auto;
}

.cross-table-header {
}

.cross-table-footer {
  backgroud-color: ${red};
  color: white;
}

.cross-table-content {
  border: 1px solid ${red};
}

.cross-table-content td {
  height: 75px;
}

.cross-table-content .cross-table-total-cell {
  width: 30px;
}

.cross-table-content td:first-child {
  white-space: nowrap;
  width: 100px;
}

.cross-table-content tr:not(:last-child) .cross-table-cell:not(:first-child) {
  border-bottom: 1px solid ${gray};
}

.cross-table-content .cross-table-cell:not(:first-child):not(:last-child) {
  border-right: 1px solid ${gray};
}

.cross-table-content tr:first-child td:not(:first-child) {
  border-top: 1px solid ${red};
}

.cross-table-content td:nth-child(2) {
  border-left: 1px solid ${red};
}

.cross-table-total-cell {
  background-color: ${red};
  color: white;
}

.cross-table-footer {
  height: 30px;
}
`;