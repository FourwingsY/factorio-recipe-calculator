import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { CoreLoaderCard, ModLoaderCard } from './components/LoaderCard';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
});

const Home = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Factorio Recipe Calculator</title>
      </Head>
      <div id='root'>
        <div className={classes.layout}>
          <CoreLoaderCard />
          <ModLoaderCard />
        </div>
      </div>
    </>
  );
};

export default Home;
