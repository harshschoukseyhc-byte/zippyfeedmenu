import { menuData } from '@/lib/menu-data';
import { CoreMenu } from '@/components/CoreMenu';

export default function HomePage() {
  return <CoreMenu menu={menuData} />;
}
