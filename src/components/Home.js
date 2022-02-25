import React from "react";
import { Typography, Container, TextField, Box, Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Web3 from "web3";
import AlertMessage from "./AlertMessage";

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

export default function Home() {
  const NODE_URL =
    "https://goerli.infura.io/v3/1191fa36660247c2bc17ec6a68754ca0";
  const provider = new Web3.providers.HttpProvider(NODE_URL);
  const web3 = new Web3(provider);
  const address = "0xB5369F8300e5dCC90f243bF73f3d994EFdfbE76A";
  const privateKey =
    "c8d1f252d468a588252b57b14d7322e9d454f0262c3f43a5bebbd94ecadc2550";

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [newAddress, setNewAddress] = React.useState("");
  const [newPrivateKey, setNewPrivateKey] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const sendTransaction = async (data) => {
    console.log(`Sending a transaction from ${address} to ${data.address}`);

    setMessage(`Faucetting to ${data.address}`);

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: address,
        to: data.address,
        value: web3.utils.toWei("1.1", "ether"),
        gas: 21000,
      },
      privateKey
    );

    //Deploy our transaction
    const receipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    setMessage([
      "Transaction successful with hash: ",
      <a href={"http://localhost:3000/transaction/" + receipt.transactionHash}>
        {receipt.transactionHash}
      </a>,
    ]);
    setLoading(false);
  };

  const onSubmit = (data) => {
    setLoading(true);
    sendTransaction(data);
  };

  const createNewWallet = (data) => {
    const res = web3.eth.accounts.create();
    setNewAddress(res.address);
    setNewPrivateKey(res.privateKey);
  };

  return (
    <Container maxWidth="lg">
      <Box
        mt={10}
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50ch" },
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          textAlign: "center",
          backgroundColor: "#ffffff",
          padding: "20px 20px 40px",
          borderRadius: "10px",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ justifyContent: "center", marginBottom: "20px" }}
        >
          <Tab label="Create Wallet" {...a11yProps(0)} />
          <Tab label="Faucet" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Typography variant="h5" gutterBottom component="div" mb={5}>
            Create new wallet
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField label="Address" value={newAddress} />
            <Button
              sx={{
                marginLeft: "auto",
                marginRight: "75px",
                padding: "0px",
                marginBottom: "20px",
              }}
              onClick={() => {
                navigator.clipboard.writeText(newAddress);
              }}
            >
              Copy
            </Button>
            <TextField label="Private key" value={newPrivateKey} />
            <Button
              sx={{ marginLeft: "auto", marginRight: "75px", padding: "0px" }}
              onClick={() => {
                navigator.clipboard.writeText(newPrivateKey);
              }}
            >
              Copy
            </Button>
          </div>
          <Button
            variant="outlined"
            size="large"
            sx={{
              marginTop: "40px",
            }}
            onClick={createNewWallet}
          >
            Create
            <ArrowForwardIcon sx={{ ml: 1 }} />
          </Button>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h5" gutterBottom component="div" mb={5}>
            Faucet to your address
          </Typography>
          <TextField
            label="Address"
            {...register("address", { required: true })}
            error={!!errors.address}
            helperText={!!errors.address && "Please enter your address"}
          />
          <LoadingButton
            variant="outlined"
            size="large"
            loading={loading}
            loadingIndicator="Loading..."
            type="submit"
            sx={{
              marginTop: "40px",
            }}
          >
            Faucet 1.1 Ether
            <ArrowForwardIcon sx={{ ml: 1 }} />
          </LoadingButton>
        </TabPanel>
      </Box>
      <AlertMessage message={message} />
    </Container>
  );
}
