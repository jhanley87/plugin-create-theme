import { Heading, Input, Text, Box, Button, Card } from "@twilio-paste/core";
import { useEffect, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";

interface IColorPickerProps {
  color: string;
  title: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  colorChanged: (newColor: string) => void;
}

export const ColorPicker = (props: IColorPickerProps) => {
  const [color, setColor] = useState<string>(props.color);

  useEffect(() => {
    props.colorChanged && props.colorChanged(color);
  }, [color]);

  useEffect(() => {
    setColor(props.color);
  }, [props.color]);
  
  return (
    <Text as="div" textAlign="center">
      <Card>
        <Box padding="space40" minHeight={"100px"}>
          <Heading as="h2" variant="heading30">
            {props.title}
          </Heading>
        </Box>
        <Box padding="space40">
          <RgbaStringColorPicker
            color={color ?? ""}
            onChange={setColor}
            style={{ width: "100%" }}
          />
        </Box>
        <Box padding="space40">
          <Input
            type="text"
            value={color ?? ""}
            onChange={(e) => setColor(e.target.value)}
          />
        </Box>
      </Card>
    </Text>
  );
};
