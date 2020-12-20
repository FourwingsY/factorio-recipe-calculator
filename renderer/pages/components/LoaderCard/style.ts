import { makeStyles } from '@material-ui/core/styles';

export const useCardStyle = makeStyles({
  card: {
    maxWidth: 300,
    margin: 5,
  },
  media: {
    height: 140,
  },
  actions: {
    justifyContent: 'flex-end',
  },
});
