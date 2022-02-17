import React from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import TableCell from "@mui/material/TableCell";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { convertToETH } from "../utils";
import { useParams } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Account() {
  const { address } = useParams();
  const [transactions, setTransactions] = React.useState("");
  const [internalTxns, setInternalTxns] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const callApi = async () => {
    await axios
      .get(
        `https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=9999999&sort=desc&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`
      )
      .then((res) => {
        setInternalTxns(res.data.result);
      });

    await axios
      .get(
        `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=9999999&sort=desc&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`
      )
      .then((res) => {
        setTransactions(res.data.result);
      });

    setLoading(false);
  };

  React.useEffect(() => {
    callApi();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ color: "#4a4f55" }} mt={4} mb={2}>
        Address <span style={{ color: "#77838f" }}>{address}</span>
      </Typography>
      {loading ? (
        <Box className="card card-loading" sx={{ flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className="card" sx={{ flexGrow: 1 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Transactions" {...a11yProps(0)} />
              <Tab label="Internal Txns" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                sx={{ tableLayout: "fixed" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">Txn Hash</TableCell>
                    <TableCell width="10%">Block</TableCell>
                    <TableCell width="17%">Time</TableCell>
                    <TableCell width="20%">From</TableCell>
                    <TableCell width="6%"></TableCell>
                    <TableCell width="20%">To</TableCell>
                    <TableCell width="10%">Value</TableCell>
                    <TableCell width="10%">Txn Fee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(transactions).length > 0 &&
                    transactions.slice(0, 24).map((row, key) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          <Tooltip title={row.hash}>
                            <a
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                              }}
                              href={"/transaction/" + row.hash}
                            >
                              {row.hash}
                            </a>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {row.blockNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {moment
                              .unix(row.timeStamp)
                              .format("DD-MM-YYYY hh:mm:ss")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.from}>
                            {row.from === address.toLowerCase() ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                              >
                                {row.from}
                              </span>
                            ) : (
                              <a
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                                href={"/account/" + row.from}
                              >
                                {row.from}
                              </a>
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {row.to === address.toLowerCase() ? (
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                                color: "#02977e",
                                backgroundColor: "rgba(0,201,167,.2)",
                                fontWeight: "700",
                                fontSize: "0.7rem",
                                lineHeight: "1.7",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "0.4rem",
                                textAlign: "center",
                              }}
                            >
                              IN
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                                color: "#b47d00",
                                backgroundColor: "rgba(219,154,4,.2)",
                                fontWeight: "700",
                                fontSize: "0.7rem",
                                lineHeight: "1.7",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "0.4rem",
                                textAlign: "center",
                              }}
                            >
                              OUT
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.to}>
                            {row.to === address.toLowerCase() ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                              >
                                {row.to}
                              </span>
                            ) : (
                              <a
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                                href={"/account/" + row.to}
                              >
                                {row.to}
                              </a>
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={convertToETH(row.value) + " ETH"}>
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                              }}
                            >
                              {convertToETH(row.value)} ETH
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              convertToETH(row.gasPrice * row.gasUsed) + " ETH"
                            }
                          >
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                              }}
                              className=""
                            >
                              {convertToETH(row.gasPrice * row.gasUsed)} ETH
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                sx={{ tableLayout: "fixed" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">Parent Txn Hash</TableCell>
                    <TableCell width="12%">Block</TableCell>
                    <TableCell width="20%">Time</TableCell>
                    <TableCell width="20%">From</TableCell>
                    <TableCell width="6%"></TableCell>
                    <TableCell width="20%">To</TableCell>
                    <TableCell width="10%">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(internalTxns).length > 0 &&
                    internalTxns.slice(0, 24).map((row, key) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          <Tooltip title={row.hash}>
                            <a
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                              }}
                              href={"/transaction/" + row.hash}
                            >
                              {row.hash}
                            </a>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {row.blockNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {moment
                              .unix(row.timeStamp)
                              .format("DD-MM-YYYY hh:mm:ss")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.from}>
                            {row.from === address.toLowerCase() ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                              >
                                {row.from}
                              </span>
                            ) : (
                              <a
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                                href={"/account/" + row.from}
                              >
                                {row.from}
                              </a>
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <ArrowCircleRightIcon sx={{ color: "#00c9a7" }} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.to}>
                            {row.to === address.toLowerCase() ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                              >
                                {row.to}
                              </span>
                            ) : (
                              <a
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "bottom",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100%",
                                }}
                                href={"/account/" + row.to}
                              >
                                {row.to}
                              </a>
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={convertToETH(row.value) + " ETH"}>
                            <span
                              style={{
                                display: "inline-block",
                                verticalAlign: "bottom",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                              }}
                            >
                              {convertToETH(row.value)} ETH
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      )}
    </Container>
  );
}
