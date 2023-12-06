import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { Entry } from '../../types';
import AddEntryForm from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: () => Entry;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      <AddEntryForm onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
