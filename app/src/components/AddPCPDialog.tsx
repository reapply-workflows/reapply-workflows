import { Dialog, DialogContent } from '@material-ui/core';
import { observer } from 'mobx-react';
import { useCallback } from 'react';

type Props = {
  show: boolean;
  onClose: () => void;
};

const AddPCPDialog = ({ show, onClose }: Props) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogContent>Test</DialogContent>
    </Dialog>
  );
};

export default observer(AddPCPDialog);
