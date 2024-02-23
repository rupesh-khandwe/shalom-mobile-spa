const COLORS = {
  primary: "#000000",
  secondary: "#444262",
  tertiary: "#FF7754",

  gray: "#83829A",
  gray2: "#C1C0C8",

  white: "#F3F4F8",
  lightWhite: "#FAFAFC",

  purplePrimary: "#8E7AB5",
  purple: "#AD40AF",
  //white: '#FFFFFF',
  black: '#000000',
  //gray: 'rgba(36, 39, 96, 0.05)',
  secondaryGray: 'rgba(84, 76, 76, 0.14)'
};

const SIZES = {
  xSmall: 5,
  small: 12,
  medium: 30,
  large: 20,
  xLarge: 24,
  xxLarge: 32,

      // global SIZES
      base: 8,
      font: 14,
      radius: 30,
      padding: 10,
      padding2: 12,
      padding3: 16,
  
      // font sizes
      largeTitle: 50,
      h1: 30,
      h2: 20,
      h3: 18,
      h4: 16,
      body1: 30,
      body2: 20,
      body3: 18,
      body4: 14,
      body5: 12,
  
      // app dimensions
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

const FONTS = {
  largeTitle: {
      fontFamily: 'black',
      fontSize: SIZES.largeTitle,
      lineHeight: 55,
  },
  h1: { fontFamily: 'bold', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'bold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'bold', fontSize: SIZES.h4, lineHeight: 20 },
  body1: { fontFamily: 'regular', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'regular', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'regular', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20 },
}

export { COLORS, SIZES, SHADOWS, FONTS };
