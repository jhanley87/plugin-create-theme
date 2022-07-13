import { UseMultiSelectPrimitiveStateChange } from "@twilio-paste/core";

export default interface IOverrideTheme {
  SideNav?: {
    Icon?: {
      color?: string;
    };
    SelectedIcon?: {
      color?: string;
    };
    Container?: {
      background?: string;
      ["& button:hover"]?: { background: string };
    };
  };
  MainHeader?: {
    Container?: {
      background?: string;
      ["& button:hover"]?: { background: string };
    };
  };
  logo?: string;
  lightOrDark?: string;
  name?: string;
}
