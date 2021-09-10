import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { useHistory } from 'react-router';

import { useStore } from '../stores/RootStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 400,
      display: 'grid',
      gridTemplateRows: 'min-content min-content 1fr',
      overflow: 'auto',
    },
    center: {
      margin: '0 auto',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: theme.spacing(1),
    },
    card: {
      minWidth: 400,
    },
    margin: {
      margin: theme.spacing(1),
    },
  }),
);
const CustomWorkflowView = () => {
  const styles = useStyles();
  const {
    exploreStore: { workflow },
  } = useStore();
  const history = useHistory();

  const { customWorkflows = {}, setCurrentWorkflow } = workflow || {};

  const workflows = useMemo(() => {
    return Object.values(customWorkflows);
  }, [customWorkflows]);

  return (
    <div className={styles.root}>
      <div className={styles.center}>
        <Typography variant="h4">Workflows</Typography>
      </div>
      <div className={styles.list}>
        {workflows.map((wf) => (
          <Card key={wf.id} className={styles.card} raised>
            <CardHeader
              action={
                <ButtonGroup>
                  <Button
                    onClick={() => {
                      history.push({ pathname: '/explore', search: `?workflow=${wf.id}` });
                    }}
                  >
                    Load
                  </Button>
                  <Button
                    onClick={() => {
                      if (setCurrentWorkflow) setCurrentWorkflow(wf.id);
                    }}
                  >
                    Edit
                  </Button>
                </ButtonGroup>
              }
              title={wf.name}
            />
            <Divider />
            <CardContent>
              <Timeline align="alternate">
                {(wf.order || []).map((id, idx) => {
                  const node = wf.graph.nodes[id];

                  return (
                    <TimelineItem key={node.id}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {idx !== wf.order.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>{node.label}</TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default observer(CustomWorkflowView);
