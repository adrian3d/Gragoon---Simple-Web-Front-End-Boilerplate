module.exports = {
  'responsive': {
    'mobile': {
      'minWidth': 0,
      'maxWidth': 500
    },
    'tablet': {
      'minWidth': 501,
      'maxWidth': 900
    },
    'desktop': {
      'minWidth': 901,
      'maxWidth': 1399
    },
    'largeDesktop': {
      'minWidth': 1400
    }
  },

  'pano': {
    'swfSource': './dist/swf/marzipano.swf',
    'initialLayer': 'polygon',
    'layers': [
      {
        'id': 'realistic',
        'url': './dist/img/pano_textures.jpg',
        'opacity': 0,
      },
      {
        'id': 'realistic_lightdown',
        'url': './dist/img/pano-lighting.jpg',
        'opacity': 0,
      },
      {
        'id': 'realistic_blured',
        'url': './dist/img/pano_textures_blurred_22.jpg',
        'opacity': 0,
      },
      {
        'id': 'polygon',
        'url': './dist/img/theater360_1.png',
        'opacity': 1,
      }
    ],
    'parallaxCoef': 5,
    'parallaxContemplationCoef': 15,
    'initialView': {
      'yawCoef': 0.01,
      'pitchCoef': 0.01,
      'fovCoef': 60
    },
    'hotspots': [
      {
        'element': '#icon_robot',
        'coordinates': {
          'yawCoef': 99,
          'pitchCoef': 13,
          'fovCoef': 60
        }
      },

      {
        'element': '#icon_sound',
        'coordinates': {
          'yawCoef': 35,
          'pitchCoef': 25,
          'fovCoef': 60
        }
      },

      {
        'element': '#icon_light',
        'coordinates': {
          'yawCoef': 78,
          'pitchCoef': -10,
          'fovCoef': 60
        }
      },

      {
        'element': '#emotions',
        'coordinates': {
          'yawCoef': 90,
          'pitchCoef': -3,
          'fovCoef': 60
        }
      },

      {
        'element': '.pulse-box-1',
        'coordinates': {
          'yawCoef': 76,
          'pitchCoef': -20,
          'fovCoef': 60
        },

      },

      {
        'element': '.pulse-box-2',
        'coordinates': {
          'yawCoef': 60,
          'pitchCoef': -12,
          'fovCoef': 60
        },
      },

      {
        'element': '.pulse-box-3',
        'coordinates': {
          'yawCoef': 37,
          'pitchCoef': -3,
          'fovCoef': 60
        }
      }
    ],
    'emotions': [
      {
        'id': 'happy',
        'url': './dist/img/emoji-happy.png'
      },
      {
        'id': 'sad',
        'url': './dist/img/emoji-mdr.png'
      },
      {
        'id': 'thumbup',
        'url': './dist/img/emoji-thumbup.png'
      }
    ]
  },
};
