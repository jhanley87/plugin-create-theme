import { ThemeConfigProps } from "@twilio/flex-ui";
import IOverrideTheme from "../Types/IOverrideTheme";
import IUserThemeInfo from "../Types/IUserThemeInfo";

export default interface IManageThemes {
    getThemeByIdAsync: (id: string) => Promise<IOverrideTheme>,
    getAllThemesAsync: () => Promise<{[id:string]:IOverrideTheme} | undefined>,
    createOrUpdateThemeAsync: (theme: IOverrideTheme, id: string) => Promise<void>
    setUsersActiveThemeAsync: (themeName: string, userId: string) => Promise<void>
    getUsersActiveThemeAsync: (userId: string) => Promise<IUserThemeInfo>
}