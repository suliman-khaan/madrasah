//[Data Table Javascript]

//Project:	EduAdmin - Responsive Admin Template
//Primary use:   Used only for the Data Table

$(function () {
  "use strict";

  $("#example").DataTable({
    dom: "Bfrtip",
    buttons: ["excel"],
    language: {
      sSearch: "تلاش کریں",
      info: "_PAGES_ صفحے میں سے صفحہ _PAGE_ دکھایا جا رہا ہے",
      infoEmpty: "کوئی ریکارڈ دستیاب نہیں ہے",
      zeroRecords: "کوئی ریکارڈ دستیاب نہیں ہے",
      formatNoMatches: "کوئی مماثل ریکارڈ دستیاب نہیں ہیں",
      paginate: {
        first: "پہلا",
        last: "آخری",
        next: "اگلا",
        previous: "پچھلا",
      },
    },
  });
}); // End of use strict
