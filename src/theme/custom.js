import { WLR } from "../utils";

const palette = {
  azureBlue: '#007AFF',
  dodgeBlue: '0A84FF',
  orangeRed: '#FF453A',
  black: '#121212',
  blackLess: '#272729',
  grey: '#808080',
  darkStoneGrey: '#23272E',
  darkStoneGreyRGBWithAlpha: 'rgba(35,39,46,1)',
  darkStoneGreyLess: '#2d3339',
  gainsboroughGrey: '#D8D8D8',
  darkStoneGreyLessLess: '#313940',
  whiteSmokeLess: '#F0F2F3',
  whiteSmoke: '#F2F2F2',
  whhiteSmokeRGBWithAlpha: 'rgba(242,242,242,1)',
  whiteSmokeMore: '#E5E5E7',
  whiteSmokeMoreMore: '#d5d5d5',
  orange: '#ff9933',
};

export const theme = {
  dark: false,
  colors: {
    primary: palette.azureBlue,
    background: palette.whiteSmoke,
    card: palette.white,
    subcard: palette.whiteSmokeMoreMore,
    text: palette.darkStoneGrey,
    border: palette.gainsboroughGrey,
    notification: palette.orangeRed,
    backdropMask: palette.whhiteSmokeRGBWithAlpha,
    cardBackground: palette.whiteSmokeMore,
  },
  spacing: {
    ss: 4 * WLR,
    s: 8 * WLR,
    m: 16 * WLR,
    l: 24 * WLR,
    xl: 40 * WLR,
    xxl: 60 * WLR,
    xxxl: 80 * WLR,
  },
  textVariants: {
    header: {
      fontSize: 36,
      fontWeight: 'bold',
    },
    box: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    tip: {
      textAlign: 'center',
    },
    title0: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    title1: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    title2: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    title3: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    title4: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: 15,
    },
    subtitle2: {
      fontSize: 14,
    },
    subtitle3: {
      fontSize: 13,
    },
    subtitle4: {
      fontSize: 12,
    },
    desc1: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      fontStyle: 'italic'
    },
    desc2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      fontStyle: 'italic'
    },
    desc3: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 20,
      fontStyle: 'italic'
    },
    desc4: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 20,
      fontStyle: 'italic'
    },
    star: {
      fontSize: 14,
      color: palette.grey,
    },
    starMarked: {
      fontSize: 14,
      color: palette.orange,
    },
    starText: {
      fontSize: 14,
      color: palette.orange,
    },
    placeholder: {
      fontSize: 14,
    },
    body: {
      fontSize: 13,
    },
    button: {
      fontSize: 13,
      fontWeight: 'bold'
    },
    tag: {
      textDecorationLine: 'underline'
    },
    rankNo: {
      fontWeight: 'bold',
      color: palette.orange,
    }
  },
};

export const darkTheme = {
  ...theme,
  dark: true,
  colors: {
    primary: palette.dodgeBlue,
    background: palette.darkStoneGrey,
    card: palette.darkStoneGreyLess,
    subcard: palette.darkStoneGreyLess,
    text: palette.whiteSmokeMore,
    border: palette.blackLess,
    notification: palette.orangeRed,
    backdropMask: palette.darkStoneGreyRGBWithAlpha,
    cardBackground: palette.darkStoneGreyLessLess,
  },
};

