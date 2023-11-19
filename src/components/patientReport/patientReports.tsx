import React, { useState, useEffect } from "react";
import { Patient } from "@/types/patient";
import { Report } from "@/types/report";
import {
  Button,
  Box,
  Modal,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  callDeleteReportApi,
  callFetchDischargeReportsApi,
  callFetchReportApi,
} from "@/pages/api/report_api";
import { callRetrieveFileWithPresignedUrl } from "@/pages/api/s3_api";
import { ModalBoxStyle } from "@/styles/StyleTemplates";
import { fetchPatientByPatientId } from "@/pages/api/patients_api";
import { convertToSingaporeTime } from "../utils/datetime";
import SelectFilter from "../SelectFilter";
import { report } from "process";

interface PatientReportsProps {
  viewType: "all" | "single";
  patientId?: string;
}

export default function PatientReports({
  viewType,
  patientId,
}: PatientReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [reportTypeCriteria, setReportTypeCriteria] = useState("");

  useEffect(() => {
    fetchPatientReports();
  }, [refreshKey]);

  const fetchPatientReports = async () => {
    if (patientId) {
      const patient: Patient = await fetchPatientByPatientId(patientId);
      if (patient && patient.reports) {
        const reportPromises = patient.reports.map((reportId) => {
          return callFetchReportApi(reportId as string);
        });
        const reportData = await Promise.all(reportPromises);
        if (reportData) {
          setReports(reportData);
          setFilteredReports(reportData);
        }
      }
    } else {
      const reportData = await callFetchDischargeReportsApi();
      if (reportData) {
        setReports(reportData);
        setFilteredReports(reportData);
      }
    }
  };

  const handleFilterReports = (searchInput: string, reportType: string) => {
    setSearchTerm(searchInput);
    setReportTypeCriteria(reportType);
    console.log(searchInput);
    const filteredReports = reports.filter((report) => {
      if (viewType === "all") {
        console.log("view all")
        return (
          report.patientName.toLowerCase().includes(searchInput.toLowerCase()) ||
          report.patientNric.toLowerCase().includes(searchInput.toLowerCase())
        );
      } else {
        return (
          report.name.toLowerCase().includes(searchInput.toLowerCase()) &&
          report.type.toLowerCase().includes(reportType)
        );
      }
    });
    setFilteredReports(filteredReports);
  };

  const capitaliseFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal((prevState) => !prevState);
  };

  const handleDeleteReport = async (reportId: string) => {
    await callDeleteReportApi(reportId);
    handleShowDeleteModal();
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleDownloadReport = async (url: string) => {
    const downloadUrl = await callRetrieveFileWithPresignedUrl(url);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box p={2}>
      <h3 className="text-left mb-5">
        {viewType == "all" ? "Discharge Reports" : "Patient Reports"}
      </h3>

      <TextField
        label={
          viewType == "all"
            ? "Search by Patient Name or NRIC"
            : "Search by Report Name"
        }
        variant="outlined"
        fullWidth
        onChange={(e) => {
          handleFilterReports(e.target.value, reportTypeCriteria);
        }}
        value={searchTerm}
        sx={{ mb: 2 }}
      />
      {reports.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {viewType == "all" && (
                  <>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Patient NRIC</TableCell>
                  </>
                )}
                <TableCell>Report Name</TableCell>
                {viewType !== "all" && (
                  <TableCell id="report-type-and-filter">
                    Report Type&nbsp;&nbsp;&nbsp;
                    <select
                      value={reportTypeCriteria}
                      onChange={(e) =>
                        handleFilterReports(searchTerm, e.target.value)
                      }
                    >
                      <option value={""}>All</option>
                      <option value={"event"}>Event</option>
                      <option value={"discharge"}>Discharge</option>
                    </select>
                  </TableCell>
                )}
                <TableCell>Created At</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {filteredReports
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((report, index) => (
                <>
                  <TableRow key={index}>
                    {viewType == "all" && (
                      <>
                        <TableCell>{report.patientName}</TableCell>
                        <TableCell>
                          {report.patientNric.replace(/^.{5}/, "XXXXX")}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      {capitaliseFirstLetter(report.type)} Report
                    </TableCell>
                    <TableCell>
                      {convertToSingaporeTime(report.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDownloadReport(report.url)}
                        startIcon={<DownloadIcon />}
                      ></Button>
                      {report.type == "event" && (
                        <Button
                          onClick={() => handleShowDeleteModal()}
                          startIcon={<DeleteIcon />}
                        />
                      )}
                    </TableCell>
                  </TableRow>

                  <Modal open={showDeleteModal} onClose={handleShowDeleteModal}>
                    <Box sx={ModalBoxStyle}>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete {report.name}?
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          onClick={() => handleDeleteReport(report._id)}
                          variant="contained"
                          color="error"
                          sx={{ mt: 2 }}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={handleShowDeleteModal}
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2, ml: 2 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                </>
              ))}
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="body1">
            {viewType == "single"
              ? "No reports created for this patient."
              : "No discharge reports created."}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
