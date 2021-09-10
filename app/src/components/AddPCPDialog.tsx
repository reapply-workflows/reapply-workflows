/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Chip,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { useCallback, useMemo, useState } from 'react';

import { useStore } from '../stores/RootStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

type Props = {
  show: boolean;
  onClose: () => void;
};

const AddPCPDialog = ({ show, onClose }: Props) => {
  const styles = useStyles();

  const {
    exploreStore: { data, addPCP },
  } = useStore();

  const [_dimensions, setDimensions] = useState<string[]>([]);

  const dimensions = useMemo(() => {
    return [...new Set(_dimensions)];
  }, [_dimensions]);

  const handleClose = useCallback(() => {
    setDimensions([]);
    onClose();
  }, [onClose]);

  if (!data) return <div>Test</div>;

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>Select dimensions</DialogContentText>
        <div>
          {dimensions.map((d) => (
            <Chip
              key={d}
              label={d}
              onClick={() => {
                setDimensions((dim) => dim.filter((di) => d !== di));
              }}
            />
          ))}
        </div>
        <FormControl className={styles.formControl}>
          <InputLabel id="x-col-label">Dimensions</InputLabel>
          <Select
            id="x-col"
            labelId="x-col-label"
            value={[]}
            multiple
            onChange={(ev: any) => {
              const d = ev.target.value;

              if (dimensions.includes(d)) return;

              setDimensions((dims) => {
                const d = ev.target.value;

                return [d, ...dims];
              });
            }}
          >
            {data.numericColumns.map((opt) => (
              <MenuItem key={opt} disabled={dimensions.includes(opt)} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (dimensions.length > 0) {
              addPCP(dimensions);
            }
            handleClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(AddPCPDialog);
