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
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  callDeleteReportApi,
  callFetchAllReportsWithPatientParticularsApi,
  callFetchReportApi,
} from "@/pages/api/report_api";
import { callRetrieveFileWithPresignedUrl } from "@/pages/api/s3_api";
import { ModalBoxStyle } from "@/styles/StyleTemplates";
import { fetchPatientByPatientId } from "@/pages/api/patients_api";
import { convertToSingaporeTime } from "../utils/datetime";

interface PatientReportProps {
  viewType: "all" | "single";
  patientId?: string;
}

export default function PatientReport({
  viewType,
  patientId,
}: PatientReportProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
        const reports = await Promise.all(reportPromises);
        setReports(reports);
      }
    } else {
      const reports = await callFetchAllReportsWithPatientParticularsApi();
      setReports(reports);
    }
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
                <TableCell>Report Type</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {reports.map((report, index) => (
              <>
                <TableRow key={index}>
                  {viewType == "all" && (
                    <>
                      <TableCell>{report.patientName}</TableCell>
                      <TableCell>{report.patientNric}</TableCell>
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
                      onClick={() => handleShowDeleteModal()}
                      startIcon={<DeleteIcon />}
                    />
                    <Button
                      onClick={() => handleDownloadReport(report.url)}
                      startIcon={<DownloadIcon />}></Button>
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
                        sx={{ mt: 2 }}>
                        Delete
                      </Button>
                      <Button
                        onClick={handleShowDeleteModal}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, ml: 2 }}>
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
            No reports available for this patient.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
