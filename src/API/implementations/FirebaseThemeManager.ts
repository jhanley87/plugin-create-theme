import { ThemeConfigProps } from "@twilio/flex-ui";
import axios from "axios";
import IOverrideTheme from "../../Types/IOverrideTheme";
import IUserThemeInfo from "../../Types/IUserThemeInfo";
import IManageThemes from "../IManageThemes";

export default class FirebaseThemeManager implements IManageThemes {
  
  getThemeByIdAsync = async (id: string) => {
    return {};
  };
  
  getAllThemesAsync = async () => {
    const url = `https://flexingthemes-default-rtdb.firebaseio.com/themes.json`;
    const result = (await this.getApiRequest<{[id:string]:IOverrideTheme}>(url))?.data;
    return result;
  };

  createOrUpdateThemeAsync = async (theme: IOverrideTheme, id: string) => {
    //todo url from config
    const url = `https://flexingthemes-default-rtdb.firebaseio.com/themes/${id}.json`;
    await this.putApiRequest(url, theme);
    return;
  };


  getUsersActiveThemeAsync = async (userId: string) => {
    const url = `https://flexingthemes-default-rtdb.firebaseio.com/users/${userId}.json`;
    const result = (await this.getApiRequest<IUserThemeInfo>(url))?.data ?? {}
    return result;
  };

  setUsersActiveThemeAsync = async (themeName: string, userId: string) => {
    const url = `https://flexingthemes-default-rtdb.firebaseio.com/users/${userId}.json`;
    await this.putApiRequest(url, {activeTheme: themeName});
    return;
  };

  private async getApiRequest<T>(url: string) {
    try {
      const axiosResponse = await axios.get<T>(url, { timeout: 10000 });

      return axiosResponse;
    } catch (error) {
      console.error(`Error making api request to ${url}`, error);
    }
  }

  private async putApiRequest<T>(url: string, data: any) {
    try {
      const axiosResponse = await axios.put<T>(url, data, { timeout: 10000 });

      return axiosResponse;
    } catch (error) {
      console.error(`Error making api request to ${url}`, error);
    }
  }
}
