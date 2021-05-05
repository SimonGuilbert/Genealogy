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

export default function Home() {
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
                  options={['nom1','nom2']}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => <TextField {...params} 
                  label="Nom de famille" variant="outlined" />}
              /><br/>
            <div className = "valider">
              <Button variant="contained">Valider</Button>
            </div><br/>
            <Link href="/insert">
                Vous ne trouvez pas votre nom ? Cliquez ici pour l'enregistrer dans nos bases de données
            </Link>
            </div>

            <div className="inner-right">
                <h1>Emplacement pour graphique (diagramme en barres du nombre d'ancetres trouvés en fonction du temps)</h1>
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
            <MapView/>
        </div>
    </div>
  );
}