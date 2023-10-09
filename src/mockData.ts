export const rows = [
  { id: 1, Ward: 1, Room: 1, Bed: 1, Status: "HANDLING" },
  { id: 2, Ward: 2, Room: 1, Bed: 1, Status: "HANDLING" },
  { id: 3, Ward: 1, Room: 1, Bed: 1, Status: "COMPLETED" },
  { id: 4, Ward: 1, Room: 8, Bed: 8, Status: "OPEN" },
  { id: 5, Ward: 2, Room: 1, Bed: 8, Status: "OPEN" },
  { id: 6, Ward: 2, Room: 2, Bed: 1, Status: "HANDLING" },
  { id: 7, Ward: 2, Room: 2, Bed: 8, Status: "OPEN" },
];

export const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "Ward",
    headerName: "Ward",
    width: 90,
    editable: false,
  },
  {
    field: "Room",
    headerName: "Room",
    width: 90,
    editable: false,
  },
  {
    field: "Bed",
    headerName: "Bed",
    width: 90,
    editable: false,
  },
  {
    field: "Status",
    headerName: "Status",
    width: 150,
    editable: false,
  },
];

export const patientData = [
  {
    id: 1,
    name: "Jack Hunt",
    condition: "Lorem ipsum fhfjdf  iashdas  aids",
    ward: "1",
    bed: "1",
    bp: "120/80",
    adh: "70%",
    glucose: "115",
    hr: "96",
  },
  {
    id: 2,
    name: "Mike Cont",
    condition: "Sugma",
    ward: "1",
    bed: "2",
    bp: "121/50",
    adh: "70%",
    glucose: "90",
    hr: "100",
  },
  {
    id: 3,
    name: "Mike Oxlong",
    condition: "Ligma dasdsdasweefwe fsdf sf",
    ward: "1",
    bed: "3",
    bp: "121/50",
    adh: "70%",
    glucose: "90",
    hr: "100",
  },
];
