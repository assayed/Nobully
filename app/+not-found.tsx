import { Redirect } from 'expo-router';

/** Unknown links (old deep links, or a web host's own path) go back to the title screen. */
export default function NotFound() {
  return <Redirect href="/" />;
}
