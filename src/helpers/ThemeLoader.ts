import IOverrideTheme from "../Types/IOverrideTheme"
import * as Flex from "@twilio/flex-ui";
import IManageThemes from "../API/IManageThemes";

export default class ThemeService {
  constructor(private _apiClient: IManageThemes) {  }

  getAllThemes = async () => {
    return await this._apiClient.getAllThemesAsync();
  };

  getUsersActiveTheme = (userId: string) => {
    return this._apiClient.getUsersActiveThemeAsync(userId);
  };

  loadThemeForUser = (userId: string) => {
    if (isNullOrWhitespace(userId)) return;

    this._apiClient.getAllThemesAsync().then((themes) => {
      this._apiClient
        .getUsersActiveThemeAsync(Flex.Manager.getInstance().workerClient?.sid ?? "")
        .then((userInfo) => {
          if (themes && userInfo && userInfo.activeTheme) {
            var usersTheme = themes[userInfo.activeTheme];
            this.setThemeOverrides(usersTheme);
          }
        });
    });
  };
  setThemeOverrides = (overrides: IOverrideTheme) => {
    const theme = Flex.Manager.getInstance().configuration.theme;

    Flex.MainHeader.defaultProps.logoUrl = overrides.logo;

    if (theme) {
      //Set the light or dark theme
      theme.isLight = overrides.lightOrDark === "light";

      //Set the elements of the theme that we built up
      theme.componentThemeOverrides = overrides;
    }
    Flex.Manager.getInstance().updateConfig({ theme: theme });
  };

  saveTheme = async (themeOverrides: IOverrideTheme) => {
    if (themeOverrides.name && !isNullOrWhitespace(themeOverrides.name)) {
      var worker = Flex.Manager.getInstance().workerClient?.sid;

      if (!worker) return;

      themeOverrides &&
        (await this._apiClient.createOrUpdateThemeAsync(
          themeOverrides,
          themeOverrides.name
        ));

      await this._apiClient.setUsersActiveThemeAsync(themeOverrides.name, worker);
    }
  };
}

export const isNullOrWhitespace = (input: any) => {
  return (
    typeof input === "undefined" ||
    input == null ||
    input.replace(/\s/g, "").length < 1
  );
};
