import React from 'react';
import tete from './en-tête.png';
import pied from './pied.png'
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import MapView from './components/mapView';

function App() {
  return (
    <div className="App">

      <header className="App-header">
          <img src={tete} className="App-image-bord"/>
          <p>Bienvenue ! Vous vous demandez d'où vous venez ? Où sont nés vos ancêtres ? Où on t'ils grandis ? Où ce sont t'ils mariés ?</p>
          <p>Venez le découvrir facilement avec notre site Web !</p>
          <p>Notre méthode est très simple d'utilisation et nécessite que deux étapes très courtes. </p>
        <form>
            <h1> Étape 1 : rentrer votre nom de famille et patientez quelques instants </h1>
            <Grid container spacing={2} justify='center'>
                <Grid item xs={2}>
                    <TextField className="App-TextField" label="Nom de famille" variant="outlined" />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained">Valider</Button>
                </Grid>
            </Grid>
        </form>
      </header>

      <body className="App-body">
      <h1>Étape 2 : visualiser les déplacements sur la carte</h1>
      <p>Sélectionner le nom de famille souhaité</p>
        <Grid container spacing={2} justify="center">
          <Grid item xs={3}>
              <Autocomplete
                  className="App-combo-box"
                  options={['nom1','nom2']}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => <TextField {...params} label="Noms de famille" variant="outlined" />}
              />
          </Grid>
          <Grid item xs={3}>
              <p>Curseur de temps</p>
              <Slider className='App-Slider'
                      defaultValue={[1800, 2021]}
                      min={1800}
                      step={5}
                      max={2021}
                      aria-labelledby="range-slider"
                      valueLabelDisplay="on"/>
          </Grid>
          <Grid item xs={3}>
              <Button variant="contained">Valider</Button>
          </Grid>
        </Grid>
        <MapView/>
        <h2>Quelques statistiques en + </h2>
        <p> Palce des diagrammes</p>
      </body>

      <footer>
          <img src={pied} className="App-image-bord"/>
      </footer>
    </div>
  );
}

export default App;
