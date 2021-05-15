import React from 'react';
import './Home.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Slider from '@material-ui/core/Slider';
import MapView from '../components/mapView';
import Histogramme from '../components/Histogramme';
import axios from "axios";

export default function Home() {
  
  async function makeGetRequest(url) {
        let res = await axios.get(url)
        return res;
  }
  const [listePersonne, setListePersonne] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const [actualName, setActualName] = React.useState("");
  const [dataHisto, updateDataHisto] = React.useState({"init":0});

  function getDic(data) {
    let result = {
        1700:0,1710:0,1720:0,1730:0,1740:0,1750:0,1760:0,1770:0,1780:0,1790:0,
        1800:0,1810:0,1820:0,1830:0,1840:0,1850:0,1860:0,1870:0,1880:0,1890:0,
        1900:0,1910:0,1920:0,1930:0,1940:0,1950:0,1960:0,1970:0,1980:0,1990:0}
    let i = 0;
    for (i = 0; i < data.length; i++) {
        try{
            let date = (data[i].events[0].date).substring(0,3)
            date = Number(date + "0")
            if (date in result) {
                result[date] += 1
            } 
        } catch {
            console.log("Unavailable date")
        }
    }
    return result;
  }
  
  function handleClick(e) {    
    setActualName(inputValue.toLowerCase())
        makeGetRequest("http://localhost:3001/api/v1/data/"+inputValue.toLowerCase())
        .then((data) => updateDataHisto(getDic(data.data)))
        .catch((err) => console.log(err))
    }

  React.useEffect(() => {
    makeGetRequest("http://localhost:3001/api/v1/distinct")
    .then(( data ) => setListePersonne(data.data))
    .catch((err) => console.log(err))
  }, []);

  return (
    <div className="divHome">
        <div className="bienvenue">
        <Typography>
            <Box letterSpacing={7} m={1} textAlign="center" fontSize={36} >
            Bienvenue ! 
            </Box>
            <Box letterSpacing={4} m={1} textAlign="center">
            Vous vous demandez d'où vous venez ? Où sont nés vos ancêtres ? Où ils ont grandi ? Où ils se sont mariés ?
            </Box>
            <Box letterSpacing={7} m={1} textAlign="center" fontSize={21}>
            Venez le découvrir facilement avec notre site Web !
            </Box>
        </Typography>
        </div>

        <div className="outer">
            <div className="inner-left">
              <Autocomplete
                  className="App-combo-box"
                  value={value}
                  onChange={(event, newValue) => {
                      setValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                  }}
                  options={listePersonne}
                  renderInput={(params) => <TextField {...params}
                  label="Nom de famille" variant="outlined" />}
              /><br/>
            <div className = "valider">
              <Button variant="contained" onClick={handleClick}>Valider</Button>
            </div><br/>
            <Link href="/insert">
                Vous ne trouvez pas votre nom ? Cliquez ici pour l'enregistrer dans nos bases de données
            </Link>
            </div>

            <div className="inner-right">
            Ancêtres trouvés par période de 10 ans de 1700 à 2000
            {actualName ? <Histogramme data={dataHisto}/> : null}
            </div>
        </div>
          
                <div className="curseur">
                <Slider className='App-Slider'
                    defaultValue={[1500, 2021]}
                    min={1500}
                    step={20}
                    max={2021}
                    aria-labelledby="range-slider"
                    valueLabelDisplay="on"
                />
                </div>
          
        <div>
            <MapView actualName={actualName} setActualName={setActualName}/>
        </div>
    </div>
  );
}