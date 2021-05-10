import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Merci !"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Traitement terminé avec succès. Vous pouvez maintenant retourner sur la page 
            d'accueil pour visualiser la carte des déplacements de votre famille
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button href={'/'} color="primary">
            Retour page d'accueil
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}