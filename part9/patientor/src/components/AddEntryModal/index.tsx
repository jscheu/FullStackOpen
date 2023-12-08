import { Entry } from '../../types';

import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';

import AddEntryForm from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onCreateEntry: (date: Entry) => void;
}

const AddEntryModal = ({ modalOpen, onClose, onCreateEntry }: Props) => {
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new entry</DialogTitle>
      <Divider />
      <DialogContent>
        <AddEntryForm onCancel={onClose} onCreateEntry={onCreateEntry} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryModal;
