import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { View } from "@twilio/flex-ui";

import { ThemeConfigurationPanel } from "./components/ThemeConfigurationPanel/ThemeConfigurationPanel";
import SideBarButton from "./components/ThemeConfigurationPanel/SideBarButton";
import ThemeService from "./helpers/ThemeLoader";
import FirebaseThemeManager from "./API/implementations/FirebaseThemeManager"

const PLUGIN_NAME = "CreateThemePlugin";

export default class CreateThemePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };

    var persistanceLayerImplementation = new FirebaseThemeManager()

    var themeService = new ThemeService(persistanceLayerImplementation);

    //load the theme initially if the component isnt loaded
    themeService.getAllThemes().then((themes) => {
      themeService
        .getUsersActiveTheme(Flex.Manager.getInstance().workerClient?.sid ?? "")
        .then((userThemeInfo) => {
          if (themes) {
            //try to load the workers theme
            if(userThemeInfo && userThemeInfo.activeTheme) {
              themeService.setThemeOverrides(themes[userThemeInfo.activeTheme]);
            }
            //else try load default theme
            else if(themes["default"]){
              themeService.setThemeOverrides(themes["default"]);
            }
          }
        });
    });

    flex.SideNav.Content.add(<SideBarButton key="theme-config-button" />);

    flex.ViewCollection.Content.add(
      <View name="theme-config" key="theme-config-view">
        <ThemeConfigurationPanel
          themeService={themeService}
          key="theme-config-panel"
        />
      </View>
    );
  }
}
