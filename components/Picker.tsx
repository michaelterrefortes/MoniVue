import { Host, Picker, Text as Text2 } from "@expo/ui/swift-ui";
import { frame, pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";

const PickerComponent = ({ selectedTag, setSelectedTag, setType, options }) => {
  return (
    <Host matchContents>
      <Picker
        modifiers={[
          pickerStyle("menu"),
          frame({ width: 200, alignment: "trailing" }),
          //foregroundStyle({ type: "color", color: "#000" }),
          //background("#FF6B6B"),
        ]}
        label="Select a Catgory"
        selection={selectedTag}
        onSelectionChange={(selection) => {
          setSelectedTag(selection);
          const index = options.findIndex((tag) => tag === selectedTag) + 1;
          setType(String(index));
        }}
      >
        {options.map((option) => (
          <Text2 key={option} modifiers={[tag(option)]}>
            {option}
          </Text2>
        ))}
      </Picker>
    </Host>
  );
};

export default PickerComponent;
