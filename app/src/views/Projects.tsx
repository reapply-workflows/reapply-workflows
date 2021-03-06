/* eslint-disable react-hooks/exhaustive-deps */
import { createStyles, makeStyles } from '@material-ui/core';
import Axios from 'axios';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { PROJECT } from '..';
import DataView from '../components/DataView';
import Sidebar from '../components/Sidebar';
import If from '../components/utils/If';
import { useStore } from '../stores/RootStore';
import { Project } from '../stores/types/Project';

const fetchAllProjects = async () => {
  const { data } = await Axios.get<Project[]>(`${PROJECT}/all`);

  return data;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    project: {
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

const Projects = () => {
  const styles = useStyles();

  const {
    projectStore: { project, dataset_id, projects: prj, setProjects },
  } = useStore();

  const { isLoading, isError, error, data: projects = [] } = useQuery<Project[], Error>(
    'projects',
    fetchAllProjects,
  );

  useEffect(() => {
    if (isLoading) return;

    if (projects.length > 0 && Object.values(prj).length === 0) setProjects(projects);
  }, [isLoading, projects]);

  if (isLoading) return <div>Loading Projects</div>;

  if (isError && error) return <div>{error.message}</div>;

  return (
    <div className={styles.root}>
      <Sidebar projects={projects} />
      <If condition={Boolean(project && dataset_id)}>
        <DataView />
      </If>
    </div>
  );
};

export default observer(Projects);
