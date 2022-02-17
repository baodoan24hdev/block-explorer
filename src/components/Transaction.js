import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { convertToETH, convertToDecimal } from "../utils";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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

export default function Transaction() {
  const { txhash } = useParams();
  const [transaction, setTransaction] = React.useState("");
  const [timestamp, setTimestamp] = React.useState("");
  const [contract, setContract] = React.useState("");
  const [internalTxns, setInternalTxns] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const callApi = async () => {
    await axios
      .get(
        `https://api-goerli.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txhash}&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`
      )
      .then((res) => {
        const result = res.data.result;
        const blockNumber = convertToDecimal(res.data.result.blockNumber);
        if (result.value === "0x0") {
          axios
            .get(
              `https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&txhash=${txhash}&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`
            )
            .then((res) => {
              setContract(res.data.result);
            });
          axios
            .get(
              `https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&startblock=${blockNumber}&endblock=${blockNumber}&sort=asc&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`
            )
            .then((res) => {
              const txns = res.data.result.reduce(function (filtered, option) {
                if (option.hash === txhash) {
                  filtered.push(option);
                }
                return filtered;
              }, []);
              setInternalTxns(txns);
            });
        }
        axios
          .get(
            `https://api-goerli.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=1PQQQ3PTKPWJAB64XGHTW1T3UHKQIF458N`
          )
          .then((res) => {
            setTimestamp(res.data.result.timeStamp);
          });
        setTransaction(result);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    callApi();
  }, []);

  console.log(contract);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ color: "#4a4f55" }} mt={3} mb={2}>
        Transaction Details
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
              <Tab label="Overview" {...a11yProps(0)} />
              {Object.keys(internalTxns).length > 0 && (
                <Tab label="Internal Txns" {...a11yProps(1)} />
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Grid
              container
              spacing={5}
              sx={{ paddingLeft: "24px", paddingRight: "24px" }}
            >
              <Grid item xs={3}>
                Transaction Hash
              </Grid>
              <Grid item xs={9}>
                {txhash}
              </Grid>
              <Grid item xs={3}>
                Status
              </Grid>
              <Grid item xs={9}>
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
                    padding: "0.3rem 0.5rem",
                    borderRadius: "0.4rem",
                    textAlign: "center",
                    width: "auto",
                  }}
                >
                  SUCCESS
                </span>
              </Grid>
              <Grid item xs={3}>
                Block
              </Grid>
              <Grid item xs={9}>
                {convertToDecimal(transaction.blockNumber)}
              </Grid>
              <Grid item xs={3}>
                Timestamp
              </Grid>
              <Grid item xs={9}>
                {moment.unix(timestamp).format("MMM Do YYYY hh:mm:ss")}
              </Grid>
              <Divider
                sx={{ width: "100%", marginLeft: "20px", marginTop: "40px" }}
              />
              <Grid item xs={3}>
                From
              </Grid>
              <Grid item xs={9}>
                <a href={"/account/" + transaction.from}>{transaction.from}</a>
              </Grid>
              <Grid item xs={3}>
                To
              </Grid>
              <Grid item xs={9}>
                {Object.keys(contract).length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <span>
                      Contract{" "}
                      <a href={"/account/" + transaction.to}>
                        {transaction.to}
                      </a>
                    </span>
                    {contract.map((item, key) => (
                      <span
                        style={{ fontSize: "0.8rem", display: "flex" }}
                        key={key}
                      >
                        <ArrowCircleRightIcon
                          sx={{ color: "#00c9a7", fontSize: "1rem" }}
                        />
                        <span style={{ color: "#77838f" }}>TRANSFER</span>&nbsp;
                        {convertToETH(item.value)} Ether&nbsp;
                        <span style={{ color: "#77838f" }}>From</span>&nbsp;
                        <Tooltip title={item.from}>
                          <a
                            style={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "171px",
                            }}
                            href={"/account/" + item.from}
                          >
                            {item.from}
                          </a>
                        </Tooltip>{" "}
                        <span style={{ color: "#77838f" }}>To</span>&nbsp;
                        <Tooltip title={item.to}>
                          <a
                            style={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "171px",
                            }}
                            href={"/account/" + item.to}
                          >
                            {item.to}
                          </a>
                        </Tooltip>
                      </span>
                    ))}
                  </Box>
                ) : (
                  <a href={"/account/" + transaction.to}>{transaction.to}</a>
                )}
              </Grid>
              <Divider
                sx={{ width: "100%", marginLeft: "20px", marginTop: "40px" }}
              />
              <Grid item xs={3}>
                Value
              </Grid>
              <Grid item xs={9}>
                {convertToETH(convertToDecimal(transaction.value))} ETH
              </Grid>
              <Grid item xs={3}>
                Transaction Fee
              </Grid>
              <Grid item xs={9}>
                {convertToETH(
                  convertToDecimal(transaction.gas) *
                    convertToDecimal(transaction.gasPrice)
                )}{" "}
                ETH
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
              The contract call <b>From</b>{" "}
              <Tooltip title={transaction.from}>
                <a href={"/address/" + transaction.from}>{transaction.from}</a>
              </Tooltip>{" "}
              <b>To</b>{" "}
              <Tooltip title={transaction.to}>
                <a href={"/address/" + transaction.to}>{transaction.to}</a>
              </Tooltip>{" "}
              produced {Object.keys(internalTxns).length} Internal Transactions
            </Typography>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                sx={{ tableLayout: "fixed", boxShadow: "none" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">Type Trace Address</TableCell>
                    <TableCell width="20%">From</TableCell>
                    <TableCell width="4%"></TableCell>
                    <TableCell width="20%">To</TableCell>
                    <TableCell width="10%">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(internalTxns).length > 0 &&
                    internalTxns.map((row, key) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          <span
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
                            {row.type}_{row.traceId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.from}>
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
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <ArrowCircleRightIcon sx={{ color: "#00c9a7" }} />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.to}>
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
