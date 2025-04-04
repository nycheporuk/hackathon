import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // This code runs after the initial render, so it won't break <StaticRouter> on SSR/test
    navigate(`/chat/${uuid()}`);
  }, [navigate]);

  // You can render nothing, or a simple loading indicator
  return null;
}
