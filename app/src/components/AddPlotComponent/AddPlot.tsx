import {
  Button,
  createStyles,
  FormControl,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { observer } from 'mobx-react';
import React, { FC, useCallback, useContext, useState } from 'react';

import Store from '../../Store/Store';
import { Plot } from '../../Store/Types/Plot';
import { getPlotId } from '../../Utils/IDGens';
import useDropdown from '../Dropdown';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
    },
  }),
);

const AddPlot: FC = () => {
  const classes = useStyles();
  const [isAdding, setIsAdding] = useState(false);
  const { loadedDataset: dataset, addPlot } = useContext(Store).exploreStore;

  const columns =
    dataset?.numericColumns.map((col) => ({
      key: col,
      desc: `${dataset?.columnInfo[col].fullname || ''} (${dataset?.columnInfo[col].unit || ''})`,
    })) || [];

  const { selected: xCol, Dropdown: XDropdown, setSelected: setX } = useDropdown(
    'x-axis-dropdown',
    'X Axis',
    '',
    columns,
  );
  const { selected: yCol, Dropdown: YDropdown, setSelected: setY } = useDropdown(
    'y-axis-dropdown',
    'Y Axis',
    '',
    columns,
  );

  const handleSubmit = useCallback(() => {
    const plot: Plot = {
      id: getPlotId(),
      x: xCol,
      y: yCol,
      brushes: {},
      selectedPoints: [],
    };

    addPlot(plot);
    setX('');
    setY('');
    setIsAdding(false);
  }, [setX, setY, xCol, yCol, addPlot]);

  const addButton = (
    <FormControl className={classes.formControl}>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => {
          setIsAdding(true);
        }}
      >
        Add Plot
      </Button>
    </FormControl>
  );

  const plotMenu = (
    <>
      <XDropdown />
      <YDropdown />
      <IconButton color="primary" disabled={!(xCol && yCol)} onClick={handleSubmit}>
        <DoneIcon />
      </IconButton>
      <IconButton
        color="secondary"
        onClick={() => {
          setX('');
          setY('');
          setIsAdding(false);
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );

  return !isAdding ? addButton : plotMenu;
};

export default observer(AddPlot);