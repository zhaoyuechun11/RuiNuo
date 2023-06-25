import React, { FC } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import { useSetState } from 'ahooks';
// import { useRequest } from "ahooks";

interface State {
  displayColorPicker: boolean;
  color: string;
}

interface ColorPickerProps {
  onChange?: (value: any) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({ onChange, backgroundColor }) => {
  const [selectColor, setSelectColor] = useSetState<State>({
    displayColorPicker: false,
    color: '#fff',
  });

  const handleClick = () => {
    setSelectColor({ displayColorPicker: !selectColor.displayColorPicker });
  };

  const handleClose = () => {
    setSelectColor({ displayColorPicker: false });
  };

  const handleChange = ({ hex }: any) => {
    setSelectColor({ color: hex });
    onChange && onChange(hex);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: backgroundColor?.color || selectColor.color,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {selectColor.displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker color={selectColor.color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
