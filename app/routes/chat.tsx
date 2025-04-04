import Chat from '~/Chat/Chat';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Chat' }, { name: 'description', content: 'Chat' }];
}

export default function ChatPage(props: Route.MetaArgs) {
  console.log('ChatPage', props);
  return props.params.id ? <Chat id={props.params.id} /> : null;
}
