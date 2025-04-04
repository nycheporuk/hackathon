import type { Route } from './+types/home';
import Header from '~/Header/Header';
import Home from '~/Home/Home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function HomePage() {
  return (
    <>
      <Header></Header>
      <Home />
    </>
  );
}
