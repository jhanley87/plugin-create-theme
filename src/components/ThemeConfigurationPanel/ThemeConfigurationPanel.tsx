import { Box } from "@twilio-paste/core/box";
import { Theme } from "@twilio-paste/core/theme";
import { useUID } from "react-uid";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Column,
  Heading,
  RadioGroup,
  Radio,
  Input,
  Text,
  Label,
  Select,
  Option,
} from "@twilio-paste/core";
import * as Flex from "@twilio/flex-ui";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import IOverrideTheme from "../../Types/IOverrideTheme";
import { Button, ThemeConfigProps } from "@twilio/flex-ui";
import ThemeService, { isNullOrWhitespace } from "../../helpers/ThemeLoader";

export interface IThemeConfigPanelProps {
  themeService: ThemeService;
}

export const ThemeConfigurationPanel = (props: IThemeConfigPanelProps) => {
  const [themes, setThemes] = useState<{ [id: string]: IOverrideTheme }>({});
  const [overrides, setOverrides] = useState<IOverrideTheme>({});
  const [activeThemeName, setActiveThemeName] = useState("");

  useEffect(() => {
    init();
    setOverrides({
      ...overrides,
      MainHeader: { Container: { background: "rgba(83, 177, 51, 1)" } },
    });
  }, []);

  const init = async () => {
    var workerId = Flex.Manager.getInstance().workerClient?.sid;
    var themes = await props.themeService.getAllThemes();

    if (workerId && themes) {
      setThemes(themes);

      const userThemeInfo = await props.themeService.getUsersActiveTheme(
        workerId
      );

      if (userThemeInfo.activeTheme) {
        if (themes[userThemeInfo.activeTheme])
          setOverrides({ ...overrides, ...themes[userThemeInfo.activeTheme] });

        setActiveThemeName(userThemeInfo.activeTheme ?? "");
      }
    }
  };

  useEffect(() => {
    props.themeService.setThemeOverrides(overrides);
  }, [overrides, activeThemeName]);

  const setThemeState = (key: string) => {
    if (isNullOrWhitespace(key)) return;

    const selectedThemeOverride = themes[key];

    setOverrides({ ...overrides, ...selectedThemeOverride });
  };

  useEffect(() => {
    setThemeState(activeThemeName);
  }, [activeThemeName]);

  const saveTheme = async () => {
    setOverrides({ ...overrides, name: activeThemeName });

    await props.themeService.saveTheme(overrides);

    init();
  };

  const setDefaults = () => {
    setOverrides({ ...overrides, MainHeader: {}, SideNav: {}, logo: "" });
  };

  return (
    <Theme.Provider
      theme={
        Flex.Manager.getInstance().configuration.theme?.isLight
          ? "flex"
          : "dark"
      }
    >
      <Box
        width={"100%"}
        padding="space40"
        style={{ background: "colorBackgroundBody" }}
      >
        <Grid vertical gutter={"space40"}>
          <Column>
            <Label htmlFor="themeSelect">Load a theme</Label>
            <Select
              id="themeSelect"
              value={activeThemeName}
              onChange={(e) => setActiveThemeName(e.target.value)}
            >
              {Object.keys(themes).map((key, index) => (
                <Option value={key}>{key}</Option>
              ))}
            </Select>
          </Column>
          <Column>
            <Box
              width={"100%"}
              padding="space40"
              style={{ background: "colorBackgroundBody" }}
            >
              <Text as="div" textAlign={"center"}>
                <Label htmlFor="themeName">
                  <Heading as="h3" variant="heading30">
                    Theme Name
                  </Heading>
                </Label>
                <Input
                  id="themeName"
                  type="text"
                  placeholder="Theme Name"
                  value={overrides.name}
                  onChange={(e) =>
                    setOverrides({ ...overrides, name: e.target.value })
                  }
                ></Input>
              </Text>
            </Box>
          </Column>
          <Column>
            <Box
              overflow="hidden"
              borderRadius="borderRadius20"
              borderStyle="solid"
              borderWidth="borderWidth10"
              borderColor="colorBorderPrimaryWeak"
              alignContent={"center"}
            >
              <Text as="div" textAlign="center">
                <Box padding="space40">
                  <RadioGroup
                    value={overrides.lightOrDark}
                    name="uncontrolled-radio-group"
                    legend={
                      <Heading as="h2" variant="heading20">
                        Base Theme
                      </Heading>
                    }
                    onChange={(val) =>
                      setOverrides({ ...overrides, lightOrDark: val })
                    }
                  >
                    <Radio
                      id={useUID()}
                      value="light"
                      name="uncontrolled-radio-group"
                    >
                      Light
                    </Radio>
                    <Radio
                      id={useUID()}
                      value="dark"
                      name="uncontrolled-radio-group"
                    >
                      Dark
                    </Radio>
                  </RadioGroup>
                </Box>
              </Text>
            </Box>
          </Column>
          <Column>
            <Box
              overflow="hidden"
              borderRadius="borderRadius20"
              borderStyle="solid"
              borderWidth="borderWidth10"
              borderColor="colorBorderPrimaryWeak"
              alignContent={"center"}
            >
              <Box padding="space40">
                <Heading as="h2" variant="heading20">
                  Logo
                </Heading>
                <Input
                  type="text"
                  value={overrides.logo}
                  onChange={(e) =>
                    setOverrides({ ...overrides, logo: e.target.value })
                  }
                  placeholder="url"
                />
              </Box>
            </Box>
          </Column>
        </Grid>

        <Grid vertical gutter={"space40"}>
          <Column>
            <Grid gutter={"space40"} equalColumnHeights>
              <Column span={2}>
                <ColorPicker
                  colorChanged={(val: string) =>
                    setOverrides({
                      ...overrides,
                      MainHeader: {
                        ...overrides?.MainHeader,
                        Container: {
                          ...overrides?.MainHeader?.Container,
                          background: val === "" ? undefined : val,
                        },
                      },
                    })
                  }
                  color={overrides?.MainHeader?.Container?.background ?? ""}
                  title="Header Background"
                ></ColorPicker>
              </Column>
              <Column span={2}>
                <ColorPicker
                  colorChanged={(val: string) =>
                    setOverrides({
                      ...overrides,
                      MainHeader: {
                        ...overrides?.MainHeader,
                        Container: {
                          ...overrides?.MainHeader?.Container,
                          "& button:hover": { background: val },
                        },
                      },
                    })
                  }
                  color={
                    overrides.MainHeader?.Container?.["& button:hover"]
                      ?.background ?? ""
                  }
                  title="Header Hover Background"
                ></ColorPicker>
              </Column>
              <Column span={2}>
                <ColorPicker
                  colorChanged={(val: string) =>
                    setOverrides({
                      ...overrides,
                      SideNav: {
                        ...overrides?.SideNav,
                        Container: {
                          ...overrides?.SideNav?.Container,
                          background: val,
                        },
                      },
                    })
                  }
                  color={overrides.SideNav?.Container?.background ?? ""}
                  title="Side Nav Background"
                ></ColorPicker>
              </Column>
              <Column span={2}>
                <ColorPicker
                  colorChanged={(val: string) =>
                    setOverrides({
                      ...overrides,
                      SideNav: {
                        ...overrides?.SideNav,
                        Container: {
                          ...overrides?.SideNav?.Container,
                          "& button:hover": { background: val },
                        },
                      },
                    })
                  }
                  color={
                    overrides.SideNav?.Container?.["& button:hover"]
                      ?.background ?? ""
                  }
                  title="Side Nav Hover Background"
                ></ColorPicker>
              </Column>
              <Column span={2}>
                <ColorPicker
                  colorChanged={(val: string) =>
                    setOverrides({
                      ...overrides,
                      SideNav: { ...overrides.SideNav, Icon: { color: val } },
                    })
                  }
                  color={overrides.SideNav?.Icon?.color ?? ""}
                  title="Nav Icon Color"
                ></ColorPicker>
              </Column>
              <Column span={2}>
                <ColorPicker
                  colorChanged={(val: string) =>
                    setOverrides({
                      ...overrides,
                      SideNav: {
                        ...overrides.SideNav,
                        SelectedIcon: { color: val },
                      },
                    })
                  }
                  color={overrides.SideNav?.SelectedIcon?.color ?? ""}
                  title="Active Nav Icon Color"
                ></ColorPicker>
              </Column>
            </Grid>
          </Column>
          <Column>
            <Button onClick={setDefaults} variant="secondary" fullWidth>
              Set Defaults
            </Button>
          </Column>
          <Column>
            <Button onClick={saveTheme} variant="primary" fullWidth>
              Save
            </Button>
          </Column>
        </Grid>
      </Box>
    </Theme.Provider>
  );
};
