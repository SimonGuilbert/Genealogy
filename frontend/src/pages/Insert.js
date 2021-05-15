import React from 'react';
import './Insert.css';
import AlertDialog from '../components/BoiteDialogue';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem'; 
import Select from '@material-ui/core/Select'; 
import InputLabel from '@material-ui/core/InputLabel'; 
import Button from '@material-ui/core/Button'; 
import LinearProgress from '@material-ui/core/LinearProgress'; 
import axios from 'axios';



export default function Insert() {

    async function makePostRequest(url, newName, newQuantity) {
    
        let res = await axios.post(url, {
          name: newName,
          quantity: newQuantity
        });
        //await new Promise(r => setTimeout(r, newQuantity/50 * 60000));
        setInProcess(false);
        setFinished(true);
        return res;
    }

    const [name, setName] = React.useState("");
    const [quantity, setQuantity] = React.useState(50);
    const [inProcess, setInProcess] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    const handleChange = (event) => {
        setQuantity(event.target.value);
      };
    
    const handleChangeName = (event) => {
        setName(event.target.value)
    }

      const handleSubmit = (event) => {
        setFinished(false);
        setInProcess(true);
        makePostRequest('http://localhost:3001/api/v1/insert', name, quantity)
        .then(( data ) => console.log(data))
        .catch((err) => console.log(err))
    };

    return (
      <div className="divInsert">
        <Typography>
            <Box letterSpacing={5} m={1} textAlign="center" fontSize={36} >
            Ajout d'un nom de famille
            </Box>
            <Box letterSpacing={4} m={1} textAlign="center">
            Cette page vous permet d'ajouter un nom de famille inconnu de nos services jusqu'à présent
            </Box>
        </Typography><br/><br/>
        <TextField onChange = {handleChangeName} label="Nom de famille"/><br/><br/>
        <div className="select">
        <FormControl fullWidth>
            <InputLabel>Quantité d'individus à chercher</InputLabel>
        <Select onChange={handleChange}>
          <MenuItem value={50}>50 individus ~ 1 minute</MenuItem>
          <MenuItem value={100}>100 individus ~ 2 minutes</MenuItem>
          <MenuItem value={200}>200 individus ~ 4 minutes</MenuItem>
          <MenuItem value={500}>500 individus ~ 10 minutes</MenuItem>
          <MenuItem value={1000}>1000 individus ~ 20 minutes</MenuItem>
        </Select>
      </FormControl><br/><br/><br/>
      </div>
      <Button variant="contained" onClick={handleSubmit}>Valider</Button><br/><br/>
      {inProcess ? <LinearProgress /> : null}
      {finished ? <AlertDialog /> : null}
      </div>
    );
  }