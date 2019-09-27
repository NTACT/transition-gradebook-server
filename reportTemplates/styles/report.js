module.exports = `
  html, body {
    font-family: Open Sans, sans serif;
    color: #4A4A4A;
    padding: 0;
    margin: 0;
  }

  [data-break-after] {
    page-break-after: always;
  }

  [data-break-before] {
    page-break-before: always;
  }

  .risk-summary-report-container {
    display: -webkit-flex;
    -webkit-flex-direction: column;
    -webkit-justify-content: space-between;
  }

  .student-report-page-2 .page-count {
    margin-top: 335px;
  }

  .number-of-students-page {
    height: 579px;
  }

  .post-school-report {
    height: 580px;
  }

  .post-school-report-checkboxes {
    margin-top: 30px;
  }

  .post-school-report-checkboxes .checkboxes {
    margin-bottom: 20px;
  }

  .text-center {
    text-align: center;
  }

  @font-face {
    font-family: Open Sans;
    font-weight: 400;
    src: local(Open Sans Regular), local(OpenSans-Regular), url('report-fonts/open-sans-v15-latin-regular.otf');
  }

  @font-face {
    font-family: Open Sans;
    font-weight: 600;
    src: local(Open Sans SemiBold), local(OpenSans-SemiBold), url('report-fonts/open-sans-v15-latin-600.otf');
  }

  @font-face {
    font-family: Open Sans;
    font-weight: 700;
    src: local(Open Sans Bold), local(OpenSans-Bold), url('report-fonts/open-sans-v15-latin-700.otf');
  }

  @font-face {
    font-family: Oswald;
    font-weight: 400;
    src: local(Oswald Regular), local(Oswald-Regular), url('report-fonts/oswald-v16-latin-regular.otf');
  }
`;