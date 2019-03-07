function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const React = require('react');

const {
  Component
} = React;

const VerticalBarChart = require('./components/VerticalBarChart');

const SingleTermReportTitle = require('./components/SingleTermReportTitle');

const crossTableStyle = require('./styles/crossTable');

const StripeBar = require('./components/StripeBar');

class NumberOfStudentsCross extends Component {
  render() {
    const {
      reportName,
      schoolSettings,
      data,
      schoolYear,
      term,
      barSize,
      criteria1Labels,
      criteria2Labels,
      studentGroups,
      columnWidth
    } = this.props.data;
    const columnTotals = criteria1Labels.map(({
      key
    }) => {
      return Object.values(studentGroups[key]).reduce((a, b) => a + b, 0);
    });
    const overallTotal = columnTotals.reduce((a, b) => a + b, 0);
    return React.createElement(React.Fragment, null, React.createElement("style", null, crossTableStyle), React.createElement(SingleTermReportTitle, {
      reportName: reportName,
      schoolSettings: schoolSettings,
      schoolYear: schoolYear,
      term: term
    }), React.createElement(VerticalBarChart, {
      title: "Number of Students (Cross)",
      data: data,
      barSize: barSize || 5,
      multipleBars: true
    }), React.createElement(SingleTermReportTitle, {
      reportName: reportName,
      schoolSettings: schoolSettings,
      schoolYear: schoolYear,
      term: term
    }), React.createElement(CrossTable, null, React.createElement(CrossTableHeader, null, React.createElement("tr", null, React.createElement("th", null), criteria1Labels.map(({
      key,
      label
    }) => React.createElement("th", {
      key: key,
      style: {
        position: 'relative',
        width: columnWidth
      }
    }, label)), React.createElement("th", null))), React.createElement(CrossTableContent, null, criteria2Labels.map(({
      key,
      label
    }, i) => {
      const total = criteria1Labels.reduce((total, {
        key: criteria1Key
      }) => total + studentGroups[criteria1Key][key], 0);
      return React.createElement(React.Fragment, {
        key: key
      }, React.createElement("tr", null, React.createElement(CrossTableCell, null, React.createElement(StripeBar, {
        index: i
      }), React.createElement(RowTitle, null, label)), criteria1Labels.map(({
        key: criteria1Key
      }) => React.createElement(CrossTableCell, {
        key: criteria1Key
      }, studentGroups[criteria1Key][key])), React.createElement(CrossTableTotalCell, null, total)));
    })), React.createElement(CrossTableFooter, null, React.createElement("tr", null, React.createElement(CrossTableTotalCell, null, "TOTALS"), columnTotals.map((total, i) => React.createElement(CrossTableTotalCell, {
      key: i
    }, total)), React.createElement(CrossTableTotalCell, null, overallTotal)))));
  }

}

function CrossTable(props) {
  return React.createElement("table", _extends({}, props, {
    className: "cross-table"
  }));
}

function CrossTableHeader(props) {
  return React.createElement("thead", _extends({}, props, {
    className: "cross-table-header"
  }));
}

function CrossTableContent(props) {
  return React.createElement("tbody", _extends({}, props, {
    className: "cross-table-content"
  }));
}

function CrossTableFooter(props) {
  return React.createElement("tfoot", _extends({}, props, {
    className: "cross-table-footer"
  }));
}

function CrossTableCell(props) {
  return React.createElement("td", _extends({}, props, {
    className: "cross-table-cell"
  }));
}

function CrossTableTotalCell(props) {
  return React.createElement("td", _extends({}, props, {
    className: "cross-table-total-cell"
  }));
}

function RowTitle(props) {
  return React.createElement("div", _extends({}, props, {
    className: "cross-table-row-title",
    style: {
      maxWidth: 150,
      width: '100%',
      whiteSpace: 'normal',
      marginTop: 5,
      textAlign: 'center'
    }
  }));
}

module.exports = data => React.createElement(NumberOfStudentsCross, {
  data: data
});