import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField, Alert } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from 'react-hook-form'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  border: "none"
};
 
export default function Form({ formModal, setFormModal, prefill, name, onData }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      uname: prefill?.uname || null,
      sname: prefill?.sname || null,
      email: prefill?.email || null,
      contact: prefill?.contact || null,
    }
  })
  const [open, setOpen] = React.useState(true);
  //   const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormModal(false);
  };
  function onSubmit(data) {
    // console.log(data);
    onData(data);
  }

  return (
    <div>
      {/* <Button sx={{margin: 2}} variant='contained' onClick={handleOpen}>Add User</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant='h5' sx={{ width: '100%', textAlign: 'center' }}>{name}</Typography>
            <Controller
              control={control}
              name="uname"
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  sx={{ marginY: 2 }}
                  label="Name"
                  size='small'
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="sname"
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  sx={{ marginY: 2 }}
                  label="Father Name"
                  size='small'
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  sx={{ marginY: 2 }}
                  label="Email"
                  size='small'
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="contact"
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  sx={{ marginY: 2 }}
                  label="Contact"
                  size='small'
                  fullWidth
                  {...field}
                />
              )}
            />
             {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
            <Button type='submit' variant='contained' fullWidth>Submit</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
