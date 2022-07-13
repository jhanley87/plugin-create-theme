import { SideLink, Actions } from '@twilio/flex-ui';
import {
    ThemeIcon
  } from "@twilio-paste/icons/esm/ThemeIcon";

interface Props {
  activeView?: string;
  key: string;
}

export default ({ activeView }: Props) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'theme-config' });
  }

  return (
    <SideLink showLabel={true} icon={<ThemeIcon decorative={false} title="Theme Config"/>} iconActive={<ThemeIcon decorative={false} title="Theme Config"/>} isActive={activeView === 'theme-config'} onClick={navigate}>
      Manage Theme
    </SideLink>
  );
};