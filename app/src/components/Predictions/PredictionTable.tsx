import {
  CircularProgress,
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import debounce from 'debounce';
import { observer } from 'mobx-react';
import { useContext, useMemo } from 'react';

import Store from '../../Store/Store';

import Bar from './Bar';

export const useStyles = makeStyles(() =>
  createStyles({
    centerContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    table: {
      tableLayout: 'auto',
    },
  }),
);

const PredictionTable = () => {
  const classes = useStyles();

  const {
    exploreStore: {
      predictions,
      setPredictionSelection,
      setHoveredPrediction,
      isLoadingPredictions,
    },
  } = useContext(Store);

  const debouncedSetHoveredPrediction = useMemo(() => {
    return debounce(setHoveredPrediction, 500);
  }, [setHoveredPrediction]);

  if (isLoadingPredictions)
    return (
      <div className={classes.centerContainer}>
        <CircularProgress />
        <Typography variant="button">Computing Predictions</Typography>
      </div>
    );

  if (predictions.length === 0)
    return (
      <div className={classes.centerContainer}>
        <Typography variant="button">Please make a selection</Typography>
      </div>
    );

  return (
    <div style={{ overflow: 'scroll', padding: '1em' }}>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {/* <TableCell width="20%">Intent</TableCell> */}
              <TableCell
                align="center"
                style={{
                  fontWeight: 'bold',
                  fill: '#F2',
                  fontSize: '18px',
                  fontFamily: 'Lato, Helvetica Neue,Arial,Helvetica,sans-serif',
                }}
                width="90%"
              >
                Selection Predictions
              </TableCell>
              <TableCell width="10%" />
            </TableRow>
          </TableHead>
          <TableBody>
            {predictions.map((pred) => {
              return (
                <TableRow
                  key={pred.hash}
                  hover
                  onMouseOut={() => {
                    debouncedSetHoveredPrediction(null);
                  }}
                  onMouseOver={() => {
                    debouncedSetHoveredPrediction(pred);
                  }}
                >
                  <Tooltip title={pred.description}>
                    <TableCell width="90%">
                      <Bar label={`${pred.intent} (${pred.rank.toFixed(2)})`} rank={pred.rank} />
                    </TableCell>
                  </Tooltip>
                  <TableCell width="10%">
                    <IconButton onClick={() => setPredictionSelection(pred)}>
                      <TouchAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default observer(PredictionTable);
